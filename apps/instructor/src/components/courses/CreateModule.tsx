import Input from "@repo/ui/input"
import Editor from "./Editor"
import { ModuleInputInfo } from "@repo/utils/types"
import { ChangeEvent, useState } from "react"
import VideoDropZone, { useVideo } from "./VideoDropZone"
import { MdClose } from "react-icons/md"

const initialData:ModuleInputInfo = {
    name: "",
    details: "",
    videoUrl: "",
  }
  

function CreateModule() {
    const [module, setModule] = useState(initialData);
    const [video, setVideo] = useVideo();

    function onEditModuleDesc(value: string) {
        setModule( v => ({
            ...v, details: value
        }));
    }

    function clearVideo() {
        setVideo(null);
    }

    function onInputChange(e:ChangeEvent) {
        const key = (e.target as HTMLInputElement).name as keyof ModuleInputInfo;
        const value = (e.target as HTMLInputElement).value;
        setModule(m => {
            return {...m, [key]:value}
        })
    }
    return (
    <div className="p-4 rounded shadow shadow-black bg-zinc-900 max-w-7xl mx-auto">
        <form>
            <div className="pb-4">
                <Input id="name" type="text" label="Module Name" name="name"/>
            </div>
            <div className="pb-4">
                {
                    !video ?
                    <>
                        <Input value={module.videoUrl} onChange={onInputChange} id="videoUrl" type="text" label="Video Link" name="videoUrl" placeholder="Youtube video link..."/>
                        {
                            !module.videoUrl && (
                                <>
                                    <p className="py-6 text-center"> Or </p>
                                    <VideoDropZone />
                                </>
                            )
                        }
                    </>
                    :
                    <>
                        <div className="pt-4 flex justify-between items-center gap-4 rounded shadow border p-2 w-full bg-zinc-800">
                            <span>{video.name}</span>
                            <button type="button" onClick={clearVideo}><MdClose /></button>
                        </div>
                        <p>Uploaded 1 video</p>
                    </>
                }
            </div>
            <div className="pb-8">
              <p>Course description</p>
              <Editor value={module.details} onChange={onEditModuleDesc} />
            </div>
        </form>
    </div>
  )
}

export default CreateModule