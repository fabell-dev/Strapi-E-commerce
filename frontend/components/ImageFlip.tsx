"use client";
import { useState } from "react";

type Props = {
  imageUrl: string;
  imageAlt: string;
  backText: string;
};

export default function ImageFlip({ imageUrl, imageAlt, backText }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-[35dvh] rounded-4xl cursor-pointer perspective relative"
      style={{
        perspective: "1000px",
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Front - Imagen */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
          }}
        >
          <img
            className="w-full h-full rounded-4xl object-cover "
            src={imageUrl}
            alt={imageAlt}
          />
        </div>

        {/* Back - Texto */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
          className="w-full h-full rounded-4xl  bg-amber-50 flex items-center justify-center p-6"
        >
          <p className="text-black text-center text-lg font-semibold leading-relaxed ">
            {backText}
          </p>
        </div>
      </div>
    </div>
  );
}
