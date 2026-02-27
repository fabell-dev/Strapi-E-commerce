import { Cat } from "lucide-react";


export const Footer = () => {
  


  return (
    <nav className="w-full z-10 py-3 bg-info-content border-neutral-content/50 border-t shadow-white mt-10">
      <div className="mx-10 flex items-center justify-center">
        <div className="flex gap-5 ">
          <p className="text-xl text-neutral-content font-bold flex items-center cursor-default">
            Created by:
          </p>
          <p className="text-xl text-neutral-content font-bold flex items-center cursor-default">
            fabell-dev
          </p>
          <Cat className="w-8 h-8 stroke-neutral-content" />
        </div>
      </div>
    </nav>
  );
};
