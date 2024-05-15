function getYouTubeVideoId(link:string) {
    var regexPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    var match = link.match(regexPattern);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}
export default function YoutubeEmbed({link}:{link:string}) {

  return (
    <div className="flex justify-center items-center">
        <iframe width="660" height="415" src={`https://www.youtube.com/embed/${getYouTubeVideoId(link)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
  )
}
