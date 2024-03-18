import toBase64 from '@/utils/toBase64';
import { SetStateAction, Dispatch } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import Compressor from 'compressorjs';


type UploadDropzoneProps = {
    file?: File,
    setFile: Dispatch<SetStateAction<File>>
}

export default function UploadDropzone({ file, setFile }: UploadDropzoneProps) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            new Compressor(acceptedFiles[0], {
                quality: 0.8,
                maxWidth: 800,
                success(result) {
                    setFile(result as File);
                }
            });
        },
        accept: {
            'image/*': [],
        },
        maxFiles: 1,
        maxSize: 8192002
    });

    function clearPhoto() {
        setFile({} as File);
    }

    return (
        <div className="pb-8">
            <p>Course cover</p>
            <div {...getRootProps({ className: 'dropzone' })}>
                <div className='flex justify-center items-center pb-4'>
                    <FaCloudUploadAlt size={48} />
                </div>
                <input {...getInputProps()} />
                <p>Choose an image or Drag and Drop</p>
                <small>Image size 4MB (max)</small>
            </div>
            <p className='text-xs'>Aspect ratio 16:9 recommended</p>
            <div className='pt-4'>
                {
                    file && file?.name && 
                    <ul>
                        <li className='p-1 bg-gray-950 flex justify-between items-center'>
                            <span className='text-ellipsis overflow-hidden whitespace-nowrap'>{file?.name}</span>
                            <button onClick={clearPhoto} type='button'><IoIosClose size={24}/></button>    
                        </li>
                    </ul>
                }
            </div>
        </div>
    );
}