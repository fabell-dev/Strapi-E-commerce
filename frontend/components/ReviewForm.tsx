"use client";

import { useActionState, useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/providers";
import { sendReviewAction } from "@/lib/actions/review";
import { type ReviewFormState } from "@/lib/validations/validationsReview";
import { Star, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  productID: number;
};

const INITIAL_STATE: ReviewFormState = {
  success: false,
  message: undefined,
  data: {
    author: "",
    description: "",
    email: "",
    title: "",
    rating: 0,
  },
  Errors: null,
};

export default function ReviewForm({ productID }: Props) {
  const user = useContext(UserContext);
  const [formState, formAction, isPending] = useActionState(
    sendReviewAction,
    INITIAL_STATE,
  );

  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (formState.success) {
      setRating(0);
    }
  }, [formState.success]);

  return (
    <>
      {user ? (
        <>
          <form action={formAction} className="flex flex-col gap-y-5">
            <input type="hidden" name="productId" value={String(productID)} />
            <input type="hidden" name="rating" value={rating} />

            <div className="flex flex-col">
              <label htmlFor="title">Title </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter a Title for your review"
                min="1"
                max="50"
                required
                className="border-black border-2 rounded-sm px-3 py-2 focus:outline-black/60 focus:outline-4 transition-all duration-50 "
              />
            </div>
            <div>
              <label htmlFor="description">Review </label>
              <textarea
                placeholder="Share your thoughts and experience"
                id="description"
                name="description"
                required
                className="border-black border-2 rounded-sm px-3 py-2 focus:outline-black/60 focus:outline-4 transition-all duration-50 w-full h-32 resize-y "
              ></textarea>
            </div>

            <div>
              <p className="mb-2">Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="cursor-pointer"
                  >
                    <Star
                      size={24}
                      className={
                        rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              animate={{
                backgroundColor: formState.success ? "#22c55e" : "#000000",
                scale: formState.success ? [1, 1.1, 1] : 1,
              }}
              transition={{
                backgroundColor: { duration: 0.5 },
                scale: formState.success
                  ? { duration: 0.6, ease: "easeInOut" }
                  : { duration: 0 },
              }}
              whileHover={!formState.success ? { scale: 1.05, y: -1 } : {}}
              whileTap={!formState.success ? { scale: 0.95, y: 1 } : {}}
              type="submit"
              className={`self-center py-2 text-white w-1/2 rounded-2xl font-medium flex items-center justify-center gap-2 ${
                formState.success ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={isPending || formState.success}
            >
              <span>
                {isPending
                  ? "Sending..."
                  : formState.success
                    ? "Review sent"
                    : "Send Review"}
              </span>
              {formState.success && (
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle size={20} />
                </motion.div>
              )}
            </motion.button>
          </form>
        </>
      ) : (
        <div className="self-center w-full  flex flex-col items-center">
          <p className="text-red-500 text-center mb-2">
            You have to be autenticated to post a review
          </p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="border-2 bg-black text-white py-2 border-white/70 w-80  rounded-2xl font-bold cursor-pointer flex justify-center"
          >
            Create an Account
          </motion.a>
        </div>
      )}
    </>
  );
}
