import React, { useEffect, useState } from "react";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";
import { RecipesProvider } from "./state/recipesContext";
import Navbar from "./components/Navbar";
import { injectThemeCSSVariables } from "./theme/theme";
import { getIsDemoMode } from "./api/recipes";

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application wrapper: applies theme, provides global recipes state,
   * renders top navigation and routed views.
   */
  const [theme, setTheme] = useState("light");
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Inject CSS variables based on Ocean Professional theme tokens
    injectThemeCSSVariables();
    setDemo(getIsDemoMode());
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <RecipesProvider>
      <div className="App">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        {demo && (
          <div className="demo-banner" role="note" aria-label="Demo mode enabled">
            <span className="demo-badge">🧪 Demo Mode Active — using local sample data</span>
          </div>
        )}
        <main className="app-main">
          <AppRouter />
        </main>
        <footer className="app-footer" role="contentinfo">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Recipe Explorer</p>
          </div>
        </footer>
      </div>
    </RecipesProvider>
  );
}

export default App;
