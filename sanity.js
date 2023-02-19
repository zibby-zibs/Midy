import { createClient } from "next-sanity"
// import imageUrlBuilder from "@sanity/image-url";
import { config } from "./config";

export const sanityClient = createClient(config);

// export const urlFor = (source) => createImageUrlBuilder(config).image(source);