import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import Home from "@/pages";
import Movies from "@/pages/movies";
import { MovieDetail } from "@/pages/movie/id";
import NotFound from "@/pages/not-found";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movie/:id" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
