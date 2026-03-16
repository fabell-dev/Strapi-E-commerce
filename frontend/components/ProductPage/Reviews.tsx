import { Review } from "@/types/review-types";
import StarRating from "../StarRating";

type Props = {
  reviews?: Review[];
  numberToShow: number;
};

export default function Reviews({ reviews, numberToShow }: Props) {
  // Ordenar reviews por fecha más reciente primero
  const sortedReviews = reviews?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <>
      {sortedReviews?.map(
        (review, index) =>
          index < numberToShow && (
            <div
              className="flex border-b-2  border-gray-400/80  gap-x-5 md:w-1/2 md:mt-5"
              key={review.id}
            >
              <img
                src="https://gravatar.com/avatar/56a8d9389f8cf66b512abd676d368a58d8c40ff56780b28e2ed9293fd7a79b50?d=mp"
                className="w-10 h-10 rounded-full"
              ></img>
              <div className="flex flex-col w-full">
                <p className="font-bold relative">
                  {review.author}
                  <span className="font-light text-sm absolute right-0">
                    {formatDate(review.createdAt)}
                  </span>
                </p>
                <StarRating rating={review.rating} />

                <p className="mt-5 mb-2">{review.description}</p>
              </div>
            </div>
          ),
      )}
    </>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);
  const diffYears = Math.floor(diffMs / 31536000000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffMonths < 12)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}
