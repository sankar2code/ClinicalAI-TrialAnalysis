import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResultSchema, type AnalysisResult } from "../schema/analysisResult";
import { TAXONOMY } from "../taxonomy";
import type { EvidencePacket } from "../pipeline/buildEvidencePacket";
import { nodeHttpsFetch } from "./nodeFetch";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const MAX_TOKENS = 4096;

export class AnalysisSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalysisSchemaError";
  }
}

export class AnthropicUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnthropicUpstreamError";
  }
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AnthropicUpstreamError(
      "ANTHROPIC_API_KEY is not set — add it to .env.local before running an analysis."
    );
  }
  if (!client) {
    // See lib/clients/nodeFetch.ts — Node's default fetch (undici)
    // unreliably drops long-running requests on this project's network
    // path ("Premature close"), confirmed via isolated testing against
    // both curl and Node's core https module. This custom fetch routes
    // around it.
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      fetch: nodeHttpsFetch as unknown as typeof fetch,
    });
  }
  return client;
}

// Mirrors prompts/reasoning-prompt.v1.md — see that file for the
// human-readable version of this same contract.
function buildSystemPrompt(): string {
  const taxonomyLines = Object.entries(TAXONOMY)
    .map(([key, t]) => `- "${key}" (${t.label}): ${t.description}`)
    .join("\n");

  return `You are a careful clinical trial analyst. Given structured evidence about a terminated, withdrawn, or suspended clinical trial, produce ranked hypotheses for why it most likely failed — reasoning only from the evidence provided, never from outside knowledge about the sponsor, drug, or disease.

LABELING CONTRACT (non-negotiable):
Every claim must be tagged with exactly one epistemic status:
- "fact": directly stated in the evidence packet (an exact number, the literal whyStopped text, etc.)
- "inference": a reasonable, evidence-grounded read of the facts
- "hypothesis": plausible given the pattern, but not directly evidenced by this trial's own record
Never state a hypothesis-level claim as if it were a fact. If evidence is genuinely insufficient, say so plainly in bottomLine and guardrail rather than inventing a hypothesis.

TAXONOMY (categories are not mutually exclusive):
${taxonomyLines}

COUNTER-ARGUMENT REQUIREMENT:
Every hypothesis must include its strongest real counter-argument, not a token objection. If you cannot construct a real one, that itself signals the hypothesis is under-evidenced — lower its confidence accordingly.

Every evidenceFor item and every item in the top-level evidence array must include a real sourceUrl. Use the provided ClinicalTrials.gov URL for facts drawn from the trial record, and the provided PubMed URL for facts drawn from a linked publication.

Reason through the evidence carefully before committing to your final answer, then call submit_analysis with your result. Do not return any text outside the tool call.`;
}

function buildUserMessage(packet: EvidencePacket): string {
  return `Evidence packet for ${packet.nctId}:\n\n${JSON.stringify(packet, null, 2)}`;
}

const SUBMIT_ANALYSIS_TOOL: Anthropic.Tool = {
  name: "submit_analysis",
  description: "Submit the final structured failure analysis for this trial.",
  input_schema: {
    type: "object",
    properties: {
      bottomLine: {
        type: "string",
        description: "One-paragraph plain-language conclusion, honestly hedged if evidence is thin.",
      },
      hypotheses: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: Object.keys(TAXONOMY),
            },
            label: { type: "string", description: 'Short human-readable name, e.g. "Recruitment Shortfall"' },
            confidence: { type: "string", enum: ["low", "medium", "high", "very_high"] },
            evidenceFor: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                properties: {
                  claim: { type: "string" },
                  epistemicStatus: { type: "string", enum: ["fact", "inference", "hypothesis"] },
                  sourceUrl: { type: "string" },
                },
                required: ["claim", "epistemicStatus", "sourceUrl"],
              },
            },
            strongestCounterArgument: { type: "string" },
          },
          required: ["category", "label", "confidence", "evidenceFor", "strongestCounterArgument"],
        },
      },
      evidence: {
        type: "array",
        items: {
          type: "object",
          properties: {
            claim: { type: "string" },
            epistemicStatus: { type: "string", enum: ["fact", "inference", "hypothesis"] },
            sourceUrl: { type: "string" },
          },
          required: ["claim", "epistemicStatus", "sourceUrl"],
        },
      },
      guardrail: {
        type: "string",
        description: "Plain-language statement of what's known, inferred, and speculative for this specific analysis.",
      },
    },
    required: ["bottomLine", "hypotheses", "guardrail"],
  },
};

async function callOnce(packet: EvidencePacket): Promise<AnalysisResult> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserMessage(packet) }],
    tools: [SUBMIT_ANALYSIS_TOOL],
    tool_choice: { type: "tool", name: "submit_analysis" },
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new AnalysisSchemaError("Model did not return a tool_use block");
  }

  const parsed = AnalysisResultSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new AnalysisSchemaError(parsed.error.message);
  }
  return parsed.data;
}

// Retry once on any failure (API error or schema-validation failure) —
// the system never renders a response that fails schema validation, even
// partially (engineering-doc.md Section 8, "Fallback").
export async function runReasoningPass(packet: EvidencePacket): Promise<AnalysisResult> {
  try {
    return await callOnce(packet);
  } catch (firstError) {
    try {
      return await callOnce(packet);
    } catch (secondError) {
      const message = secondError instanceof Error ? secondError.message : "unknown error";
      throw new AnthropicUpstreamError(`Reasoning pass failed after retry: ${message}`);
    }
  }
}
