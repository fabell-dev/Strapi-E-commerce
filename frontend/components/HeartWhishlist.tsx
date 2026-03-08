import { UserContext } from "@/app/providers";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useState, useContext } from "react";

type Props = {
  classname?: string;
};

export default function HeartWhishlist({ classname }: Props) {
  const user = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const getHeartFill = () =>
    isLiked ? "fill-red-500 stroke-0" : "fill-white/70 stroke-2";
  return (
    <>
      {user && (
        <motion.button
          onClick={() => setIsLiked(!isLiked)}
          animate={isLiked ? { scale: 1.2 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          whileTap={{ scale: 0.9 }}
          className={`${classname}`}
        >
          <Heart className={`cursor-pointer ${getHeartFill()}`} />
        </motion.button>
      )}
    </>
  );
}
