import { Review } from "@/types/review-types";
import StarRating from "./StarRating";

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
              className="flex border-b-2  border-gray-400/80  gap-x-5"
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
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
