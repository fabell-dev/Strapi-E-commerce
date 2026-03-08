import { Star } from "lucide-react";

type Props = {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
};

export default function StarRating({ rating, count, size = "md" }: Props) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {/* Estrellas completas */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} fill-yellow-400 stroke-0`}
          />
        ))}

        {/* Media estrella */}
        {hasHalfStar && (
          <div key="half" className="relative">
            <Star className={`${sizeClasses[size]} fill-gray-300 stroke-0`} />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star
                className={`${sizeClasses[size]} fill-yellow-400 stroke-0`}
              />
            </div>
          </div>
        )}

        {/* Estrellas vacías */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} fill-gray-300 stroke-0`}
          />
        ))}
      </div>
      {count && <p className="text-sm text-gray-600">({count})</p>}
    </div>
  );
}
