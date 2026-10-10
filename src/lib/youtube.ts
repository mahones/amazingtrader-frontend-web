/** Extracts the video id from watch / youtu.be / embed / shorts / live YouTube URLs. */
export function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www|m)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = u.pathname.split("/")[1] ?? null;
    } else if (host === "youtube.com") {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v");
      } else {
        const [, kind, vid] = u.pathname.split("/");
        if (["embed", "shorts", "live"].includes(kind)) id = vid ?? null;
      }
    }
    return id && /^[\w-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function youtubeThumbnail(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
