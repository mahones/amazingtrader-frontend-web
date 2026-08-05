import type { VideoProvider } from "@/types/course";

interface VideoPlayerProps {
  provider: VideoProvider | null;
  videoId: string | null;
  embedUrl?: string | null;
}

function buildEmbedUrl(provider: VideoProvider, videoId: string): string {
  if (provider === "vimeo") {
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return `https://stream.mux.com/${videoId}.m3u8`;
}

export function VideoPlayer({ provider, videoId, embedUrl }: VideoPlayerProps) {
  if (!provider || !videoId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
        Aucune vidéo disponible pour cette leçon.
      </div>
    );
  }

  const src = embedUrl ?? buildEmbedUrl(provider, videoId);

  return (
    <div className="aspect-video overflow-hidden rounded-lg bg-black">
      <iframe
        src={src}
        title="Lecteur vidéo"
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
