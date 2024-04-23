import Input from "@repo/ui/input"
import Editor from "./Editor"
import { ModuleInputInfo } from "@repo/utils/types"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import VideoDropZone, { useVideo } from "./VideoDropZone"
import { MdClose } from "react-icons/md"
import { v4 as uuid4 } from "uuid"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

interface ModuleInfo extends ModuleInputInfo {
    id: string;
}
const initialData: ModuleInfo = {
    id: "",
    orderNo: 0,
    name: "",
    details: "",
    videoUrl: "",
}

type CreateModuleProps = {
    courseId: string;
    className?: string;
    moduleInfo: ModuleInfo;
    hideForm?: () => void;
}

enum UPLOAD_STATUS { STARTED, NOT_STARTED, DONE };

function EditModule({ courseId, className, moduleInfo, hideForm }: CreateModuleProps) {
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    const [module, setModule] = useState(moduleInfo);
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useVideo();
    const [uploadStatus, setUploadStatus] = useState<UPLOAD_STATUS>(UPLOAD_STATUS.NOT_STARTED);

    useEffect(() => {
        if(uploadStatus == UPLOAD_STATUS.DONE) {
            
        }
    }, [uploadStatus])

    useEffect(() => {
        console.log(moduleInfo)
        fetch(`/api/course/count?courseId=${courseId}`)
        .then(res => res.json())
        .then(data => {
            if(data.error) console.log(data.error)
            else setModule(v => ({...v, orderNo: data.count ? data.count + 1 : 1}))
        })
        .catch(err => console.log(err))
    }, [courseId])

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

    const uploadFile = async (moduleId: string, file: File) => {
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
        return new Promise((resolve, reject) => {
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    setModule(v => ({ ...v, videoUrl: response.filePath }));
                    resolve(response.filePath);
                } else {
                    console.error('Error uploading file:', xhr.statusText);
                    toast.error("Unexpected error occured while uploading the video");
                    reject("");
                }
                setUploadStatus(UPLOAD_STATUS.DONE);
            }
        };
        xhr.open('POST', `/api/upload/video/${courseId}/${moduleId}`, true);
        xhr.send(formData);
    });
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const moduleId = moduleInfo.id;
            let videoUrl = "";
            if(video && video.name) {
                // TODO: need a function to delete video
                videoUrl = await uploadFile(moduleId, video as File) as string;
            }
            // send the data
            await fetch(`/api/module/${moduleId}`, {
                method: 'PUT',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({...module, videoUrl: videoUrl || module.videoUrl})
            })
            console.log(module);
            setLoading(false)
            toast.success("Module updated.");
            if(hideForm) hideForm();
        } catch (error) {
            setLoading(false);
            toast.success("[Error]: " + (error as Error).message);
        }
        
    }
    return (
        <div className={`p-4 rounded shadow shadow-black bg-zinc-900 max-w-7xl mx-auto ${className}`}>
            <form onSubmit={onSubmit} className="relative">
                <div className="pb-4">
                    <Input value={module.name} onChange={onInputChange} id="name" type="text" label="Module Name" name="name" />
                </div>
                <div className="pb-4">
                    <Input value={module.orderNo} onChange={onInputChange} id="orderNo" type="text" label="Module No." name="orderNo" />
                </div>
                <div className="pb-4">
                    {
                        !video ?
                            <>
                                <p className="text-xs py-1 text-yellow-200">Clear video url to upload new video</p>
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
                    <button type="submit" className="px-4 py-1 bg-green-800 rounded">UPDATE</button>
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

export default EditModule