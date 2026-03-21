import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";
import Hero from "@/components/HeroSection";
import MainSection from "@/components/MainSection/MainSection";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const pageInfo = await getHomePageInfo();

  return (
    <>
      <main className="mt-40 md:mt-30 ">
        <Hero pageInfo={pageInfo}></Hero>
        <MainSection searchParams={searchParams}></MainSection>
      </main>
    </>
  );
}
