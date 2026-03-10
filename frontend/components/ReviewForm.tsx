import { useActionState } from "react";
import { sendReviewAction } from "@/lib/actions/review";
import { type ReviewFormState } from "@/lib/validations/validationsReview";
import { useContext } from "react";
import { UserContext } from "@/app/providers";

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
  const [formState, formAction] = useActionState(
    sendReviewAction,
    INITIAL_STATE,
  );
  return (
    <>
      {user ? (
        <>
          <form action={formAction}>
            <input type="hidden" name="productId" value={productID} />
            <input type="text" name="title" placeholder="Title"></input>
            <input
              type="text"
              name="description"
              placeholder="Description"
            ></input>

            <input
              type="number"
              name="rating"
              placeholder="Rating"
              min="1"
              max="5"
            ></input>
            <button type="submit">Enviar Review</button>
          </form>
        </>
      ) : (
        <>
          <button>Create Review</button>
        </>
      )}
    </>
  );
}
