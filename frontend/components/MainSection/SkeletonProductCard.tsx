"use client";
import { useState, useEffect } from "react";

export function SkeletonProductCard() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative h-[43dvh] md:h-full animate-pulse">
      {/* Image skeleton */}
      <div className="overflow-hidden w-full h-[15vh] md:h-64 bg-gray-300" />

      <div className="p-4 flex flex-col items-center gap-3">
        {/* Name skeleton */}
        <div className="h-6 bg-gray-300 rounded w-3/4" />

        {/* Price skeleton */}
        <div className="h-8 bg-gray-300 rounded w-1/2" />

        {/* Stock info skeleton */}
        <div className="h-4 bg-gray-300 rounded w-1/3" />

        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 rounded w-2/3 mt-2" />

        {/* Variants skeleton */}
        <div className="flex flex-row gap-2 md:flex-wrap mt-5 w-full justify-center">
          <div className="h-8 bg-gray-300 rounded-full w-16" />
          <div className="h-8 bg-gray-300 rounded-full w-16" />
          <div className="h-8 bg-gray-300 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonProductsGridProps {
  pageSize?: number;
}

export function SkeletonProductsGrid({
  pageSize = 9,
}: SkeletonProductsGridProps) {
  const itemCount = pageSize;

  return (
    <section className="pb-10">
      <div
        className={`grid gap-6 ${
          itemCount === 1
            ? "grid-cols-1 place-items-center min-h-96"
            : "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {Array.from({ length: itemCount }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </section>
  );
}
