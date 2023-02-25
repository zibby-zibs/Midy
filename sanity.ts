import { createClient } from "next-sanity"
import ImageUrlBuilder from "@sanity/image-url";
import { config } from "./config";

export const sanityClient = createClient(config);

export const urlFor = (source: any) => ImageUrlBuilder(sanityClient).image(source);