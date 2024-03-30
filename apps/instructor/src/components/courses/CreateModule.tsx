import Input from "@repo/ui/input"
import Editor from "./Editor"
import { ModuleInputInfo } from "@repo/utils/types"
import { ChangeEvent, FormEvent, useState } from "react"
import VideoDropZone, { useVideo } from "./VideoDropZone"
import { MdClose } from "react-icons/md"
import { v4 as uuid4 } from "uuid"
import { toast } from "react-toastify"

const initialData: ModuleInputInfo = {
    name: "",
    details: "",
    videoUrl: "",
}

type CreateModuleProps = {
    courseId: string;
}

enum UPLOAD_STATUS { STARTED, NOT_STARTED, DONE };

function CreateModule({ courseId }: CreateModuleProps) {
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    const [module, setModule] = useState(initialData);
    const [video, setVideo] = useVideo();
    const [uploadStatus, setUploadStatus] = useState<UPLOAD_STATUS>(UPLOAD_STATUS.NOT_STARTED);

    function onEditModuleDesc(value: string) {
        setModule(v => ({
            ...v, details: value
        }));
    }

    function clearVideo() {
        setVideo(null);
    }

    function onInputChange(e: ChangeEvent) {
        const key = (e.target as HTMLInputElement).name as keyof ModuleInputInfo;
        const value = (e.target as HTMLInputElement).value;
        setModule(m => {
            return { ...m, [key]: value }
        })
    }

    const uploadFile = (moduleId: string, file: File) => {
        setUploadStatus(UPLOAD_STATUS.STARTED);
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentCompleted = Math.round((event.loaded * 100) / event.total);
                setVideoUploadProgress(percentCompleted);
                console.log("Uploaded: ", percentCompleted);
            }
        });
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    setModule(v => ({ ...v, videoUrl: response.filePath }));
                    setUploadStatus(UPLOAD_STATUS.DONE);
                    toast.success("Module added");
                } else {
                    console.error('Error uploading file:', xhr.statusText);
                    setUploadStatus(UPLOAD_STATUS.DONE);
                    toast.error("Unexpected error occured while uploading the video");
                }
            }
        };
        xhr.open('POST', `/api/upload/video/${courseId}/${moduleId}`, true);
        xhr.send(formData);
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        const moduleId = uuid4();
        uploadFile(moduleId, video as File);
    }
    return (
        <div className="p-4 rounded shadow shadow-black bg-zinc-900 max-w-7xl mx-auto">
            <form onSubmit={onSubmit} className="relative">
                <div className="pb-4">
                    <Input id="name" type="text" label="Module Name" name="name" />
                </div>
                <div className="pb-4">
                    {
                        !video ?
                            <>
                                <Input value={module.videoUrl} onChange={onInputChange} id="videoUrl" type="text" label="Video Link" name="videoUrl" placeholder="Youtube video link..." />
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
                                <div className="py-4 flex justify-between items-center gap-4 rounded shadow border p-2 w-full bg-zinc-800">
                                    <span>{video.name}</span>
                                    <button type="button" onClick={clearVideo}><MdClose /></button>
                                </div>
                                <p>Video to be uploaded</p>
                            </>
                    }
                </div>
                <div className="pb-8">
                    <p>Course description</p>
                    <Editor value={module.details} onChange={onEditModuleDesc} />
                </div>
                <div className="py-4">
                    <button type="submit" className="px-4 py-1 bg-green-800 rounded">ADD</button>
                </div>
                {
                    uploadStatus == UPLOAD_STATUS.STARTED && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 grid place-items-center">
                            <div className="text-center">
                                <p className="text-2xl">{videoUploadProgress}%</p>
                                <p>Please wait while uploading</p>
                            </div>
                        </div>
                    )
                }

            </form>
        </div>
    )
}

export default CreateModule