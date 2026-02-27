import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";

import Hero from "@/components/layout/(2)Hero";
import MainSection from "@/components/layout/(3)MainSection";

export default async function Home() {
  const pageInfo = await getHomePageInfo();

  return (
    <>
      <main>
        <Hero pageInfo={pageInfo}></Hero>
        <MainSection></MainSection>
      </main>
    </>
  );
}
