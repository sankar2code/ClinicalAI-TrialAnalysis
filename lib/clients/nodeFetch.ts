import https from "node:https";
import http from "node:http";

// Node's built-in fetch (undici) reliably throws "Invalid response body...
// Premature close" on this project's network path for any Anthropic call
// long enough to matter (~30s+ — i.e. most real reasoning calls), while
// both `curl` and Node's core `https` module complete the identical
// request without issue. This is a fetch-compatible shim backed by
// `https`/`http` directly, passed as the `fetch` option to the Anthropic
// client (lib/clients/anthropic.ts) to route around the bug rather than
// around the SDK's request/response handling.
type FetchInit = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  signal?: AbortSignal | null;
};

function headersToObject(headers?: HeadersInit): Record<string, string> {
  const result: Record<string, string> = {};
  if (!headers) return result;
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result[key] = value;
    });
  } else if (Array.isArray(headers)) {
    for (const [k, v] of headers) result[k] = v;
  } else {
    Object.assign(result, headers as Record<string, string>);
  }
  return result;
}

// Vercel's serverless runtime is a different network path than the local
// dev machine this shim was built for — this transport was seen failing
// fast (<1s, connection-level) there instead of hitting the slow
// "Premature close" symptom above. Rather than guess which environment
// has which bug, try the raw-https transport first (works locally) and
// fall back to the platform's native fetch on any failure (works on
// Vercel) — whichever transport is actually broken in a given
// environment, the other one covers it.
export async function nodeHttpsFetch(input: string | URL, init: FetchInit = {}): Promise<Response> {
  try {
    return await rawHttpsFetch(input, init);
  } catch (err) {
    return fetch(input, init as RequestInit);
  }
}

async function rawHttpsFetch(input: string | URL, init: FetchInit = {}): Promise<Response> {
  const url = new URL(typeof input === "string" ? input : input.toString());
  const isHttps = url.protocol === "https:";
  const transport = isHttps ? https : http;

  const bodyString = typeof init.body === "string" ? init.body : undefined;
  const headers = headersToObject(init.headers);
  if (bodyString !== undefined && !("content-length" in headers)) {
    headers["content-length"] = String(Buffer.byteLength(bodyString));
  }

  return new Promise((resolve, reject) => {
    const req = transport.request(
      {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: init.method ?? "GET",
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const bodyBuffer = Buffer.concat(chunks);
          const responseHeaders = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (value === undefined) continue;
            responseHeaders.set(key, Array.isArray(value) ? value.join(", ") : value);
          }
          resolve(
            new Response(bodyBuffer, {
              status: res.statusCode ?? 0,
              statusText: res.statusMessage ?? "",
              headers: responseHeaders,
            })
          );
        });
      }
    );

    req.on("error", reject);
    if (init.signal) {
      init.signal.addEventListener("abort", () => req.destroy(new Error("Request aborted")));
    }
    if (bodyString !== undefined) req.write(bodyString);
    req.end();
  });
}
