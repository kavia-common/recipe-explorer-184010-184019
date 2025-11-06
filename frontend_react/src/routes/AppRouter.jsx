import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import RecipeDetail from "../pages/RecipeDetail";
import NotFound from "../pages/NotFound";

// PUBLIC_INTERFACE
export function AppRouter() {
  /** Application routes definition */
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
