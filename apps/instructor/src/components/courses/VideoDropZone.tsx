import { CSSProperties, useCallback } from "react"
import { atom, useAtom } from 'jotai';
import { useDropzone } from "react-dropzone"

export const videoFileAtom = atom<File | null>(null);
export const useVideo = () => useAtom(videoFileAtom);

function VideoDropZone() {
  const [video, setVideo] = useVideo();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length == 0) return;
    setVideo(acceptedFiles[0]);
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, accept: { "video/*": [] } })

  return (
    <div {...getRootProps()} style={dropzoneStyles as CSSProperties}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className="py-12">Drop the video here ...</p> :
          <p className="py-12">Drag 'n' drop video here, or click to select video</p>
      }
    </div>
  )
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '40px 20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default VideoDropZone