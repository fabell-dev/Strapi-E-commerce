import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";

import Hero from "@/components/layout/(2)Hero";
import MainSection from "@/components/layout/MainSection/MainSection";

export default async function Home({ searchParams }: { searchParams: any }) {
  const pageInfo = await getHomePageInfo();

  return (
    <>
      <main className="mt-40 md:mt-30">
        <Hero pageInfo={pageInfo}></Hero>
        <MainSection searchParams={searchParams}></MainSection>
      </main>
    </>
  );
}
