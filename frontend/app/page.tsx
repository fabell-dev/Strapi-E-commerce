import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default async function Home() {
  const { title, description, imageURL } = await getHomePageInfo();

  return (
    <>
      <div className="min-h-screen bg-foreground text-white">
        <p>Titulo:{title}</p>
        <BlocksRenderer content={description} />
        {/* <p className="text-white">Descripcion:{description}</p> */}
        <img className="w-48 h-48 object-contain" src={imageURL}></img>
      </div>
    </>
  );
}
