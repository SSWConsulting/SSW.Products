type YouTubeEmbedProps = {
    src: string;
  };
  
  export const YouTubeEmbed = ({ src }: YouTubeEmbedProps) => {
    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}> 
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  