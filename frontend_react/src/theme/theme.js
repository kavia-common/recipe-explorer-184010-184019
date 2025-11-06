export const themeTokens = {
  name: "Ocean Professional",
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  gradient: "linear-gradient(135deg, rgba(37,99,235,0.10), #f9fafb)",
};

// PUBLIC_INTERFACE
export function injectThemeCSSVariables(doc = document, tokens = themeTokens) {
  /** Injects CSS variables based on theme tokens to :root. */
  if (!doc || !doc.documentElement) return;
  const root = doc.documentElement;
  root.style.setProperty("--color-primary", tokens.primary);
  root.style.setProperty("--color-secondary", tokens.secondary);
  root.style.setProperty("--color-success", tokens.success);
  root.style.setProperty("--color-error", tokens.error);
  root.style.setProperty("--color-background", tokens.background);
  root.style.setProperty("--color-surface", tokens.surface);
  root.style.setProperty("--color-text", tokens.text);
  root.style.setProperty("--gradient", tokens.gradient);
}
