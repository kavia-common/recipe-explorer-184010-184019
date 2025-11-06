const DEFAULT_TIMEOUT_MS = 15000;

function getBaseURL() {
  const env = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (env && env.trim()) return env.trim();
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return `${window.location.origin}/api`;
  }
  return "/api";
}

function toQuery(params) {
  const q = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) {
      v.forEach((val) => q.append(k, String(val)));
    } else {
      q.set(k, String(v));
    }
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

// PUBLIC_INTERFACE
export async function fetchJSON(path, { method = "GET", params, body, headers, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  /**
   * Fetch JSON helper with base URL, query params, timeout and error handling.
   */
  const base = getBaseURL();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${base}${path}${toQuery(params)}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Accept": "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJSON = contentType.includes("application/json");
    const payload = isJSON ? await res.json().catch(() => ({})) : await res.text();

    if (!res.ok) {
      const errMsg = isJSON ? (payload?.message || JSON.stringify(payload)) : String(payload || res.statusText);
      const error = new Error(errMsg || `HTTP ${res.status}`);
      error.status = res.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  } catch (err) {
    if (err.name === "AbortError") {
      const e = new Error("Request timed out");
      e.code = "TIMEOUT";
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(t);
  }
}
