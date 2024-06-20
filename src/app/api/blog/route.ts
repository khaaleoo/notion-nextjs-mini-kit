import { getBlogPosts } from "@lib/notion";

export async function GET(request: Request, {}) {
  try {
    const result = await getBlogPosts({
      filter: {
        and: [
          {
            property: "Status",
            status: {
              equals: "Published",
            },
          },
        ],
      },
    });
    return Response.json({ result });
  } catch (error) {
    return Response.json({ error });
  }
}
