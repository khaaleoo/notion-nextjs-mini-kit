import { getPageBySlug } from "@lib/notion";

type TGetRequest = {
  params: { slug: string };
};

export async function GET(request: Request, { params }: TGetRequest) {
  try {
    const result = await getPageBySlug(params.slug);
    return Response.json({ result });
  } catch (error) {
    return Response.json({ error });
  }
}
