import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export type VideoResult = { id: string; title: string; channel: string; thumbnail: string };

export const searchYoutube = createServerFn({ method: 'POST' })
  .inputValidator((d: { q: string }) => z.object({ q: z.string().trim().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<{ results: VideoResult[]; error: string | null }> => {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return { results: [], error: 'missing_key' };
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&safeSearch=strict&relevanceLanguage=fr&q=${encodeURIComponent(data.q)}&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return { results: [], error: 'request_failed' };
    const json = (await res.json()) as { items?: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { medium?: { url: string } } } }[] };
    return {
      error: null,
      results: (json.items ?? []).map(i => ({ id: i.id.videoId, title: i.snippet.title, channel: i.snippet.channelTitle, thumbnail: i.snippet.thumbnails.medium?.url ?? '' })),
    };
  });
