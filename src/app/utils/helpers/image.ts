import { unstable_noStore } from "next/cache";
import { getPlaiceholder } from "plaiceholder";

async function getBlurData(src: string) {
  unstable_noStore();
  try {
    const buffer = await fetch(src).then(async (res) => {
      return Buffer.from(await res.arrayBuffer());
    });

    const data = await getPlaiceholder(buffer);
    return data;
  } catch (err) {
    console.error("Error fetching or processing image:", err);
    return { base64: "", img: "" };
  }
}

export { getBlurData };
