import { ResourceDoc } from "@/features/resource/api/schemas";

export type VideoEntry = {
  key: string;
  title: string;
  channel: string;
  thumbnail: string | null;
  source: { type: "youtube"; id: string } | { type: "file"; doc: ResourceDoc };
};

const VIDEO_ID = /^[\w-]{11}$/;
export const isVideoId = (value: string) => VIDEO_ID.test(value);
export const thumbOf = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
/** On n'affiche que des miniatures hébergées par YouTube. */
export const safeThumb = (url: string | undefined, id: string) =>
  url && /^https:\/\/i\.ytimg\.com\//.test(url) ? url : thumbOf(id);
