import { queryRead } from "@/lib/Strapi/strapi";
import qs from "qs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  if (!query || query.trim().length < 2) {
    return Response.json([]);
  }

  try {
    const filters: any = {
      name: {
        $containsi: query,
      },
    };

    // Si se proporciona una categoría, filtrar solo por esa categoría
    if (category) {
      filters.subCategory = {
        category: {
          name: {
            $eqi: category,
          },
        },
      };
    }

    const queryString = qs.stringify({
      filters,
      fields: ["name", "slug", "price"],
      populate: {
        image: {
          fields: ["url", "name"],
        },
      },
      pagination: {
        limit: 8,
      },
    });

    const response = await queryRead(`products?${queryString}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return Response.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json([]);
  }
}
