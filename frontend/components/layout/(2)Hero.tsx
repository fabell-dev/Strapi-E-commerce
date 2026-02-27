import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ButtonAnimated from "../ui/(me)ButtonAnimated";

interface PageInfo {
  title: string;
  description: any;
  imageURL: string;
}

export default async function Hero({ pageInfo }: { pageInfo: PageInfo }) {
  const { title, description, imageURL } = pageInfo;
  return (
    <>
      <section
        className="h-[45vh] md:h-[calc(100vh-200px)] relative my-35 md:mt-30 overflow-hidden mx-5 md:mx-40 rounded-xl"
        id="hero"
      >
        {/* Imagen de fondo */}
        <img
          src={imageURL}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          alt={title}
        />

        {/* Contenido */}
        <div className="relative z-20 h-full flex flex-col justify-center  items-start px-4 sm:px-8 md:px-16 lg:px-20 text-center text-white">
          <h1 className="text-4xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4 md:mb-6 text-black max-w-100 text-left ">
            {title}
          </h1>
          <div className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-2xl text-gray-600 ">
            <BlocksRenderer content={description} />
          </div>
          <ButtonAnimated
            text="Start Shoping"
            classname="bg-black text-white md:mt-5 mt-3 md:h-10 md:w-50 h-8 w-43"
          />
        </div>
      </section>
    </>
  );
}
