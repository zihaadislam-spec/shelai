export function VideoPlayer({ src, title }: { src: string; title: string }) {
  const isEmbed = src.includes("youtube.com") || src.includes("vimeo.com");
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-dashed border-[#2F3E46]/15 bg-black">
      {isEmbed ? (
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={src} controls className="h-full w-full" title={title} />
      )}
    </div>
  );
}
