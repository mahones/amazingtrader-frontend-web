import { youtubeEmbedUrl } from "@/lib/youtube";

export function YoutubePlayer({ url, title }: { url: string; title: string }) {
  const src = youtubeEmbedUrl(url);

  if (!src) {
    return <p className="text-sm text-muted-foreground">Vidéo indisponible.</p>;
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
