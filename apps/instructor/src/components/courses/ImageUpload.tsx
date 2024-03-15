import { useState } from 'react';
import { UploadDropzone, useUploadThing } from "@repo/utils/client";
import Image from 'next/image';

export default function CourseImageUpload() {
  const [imageUrl, setImageUrl] = useState("");
  const clearImage = () => {
    setImageUrl("");
    // delete from uploadthing server
  }
  return (
    <div className="pb-8">
        <p>Course cover</p>
          {
            imageUrl ?
            <div>
              <div className='text-end'>
                <button type='button' onClick={clearImage} className='px-4 py-2 my-2 bg-green-600 rounded-lg text-white'>Clear Photo</button>
              </div>
              <Image width={500} height={320} src={imageUrl} alt={"Course cover"} className='mx-auto mt-8 max-h-80'/>
            </div>
            :
            <>
            <div className='border border-white rounded-lg p-4'>
              <UploadDropzone
                  appearance={{
                    button: { padding: '8px 0', borderRadius: '12px', margin: '10px 0', backgroundColor: 'green' },
                    label: { fontSize: '1.5rem', fontWeight: 600, margin: '10px 0' },
                    uploadIcon: {maxWidth: '50px'},
                  }}
                  content={{
                    label: "Choose File or Drag and Drop",

                  }}
                  className="course-image-dropzone"
                  endpoint="courseImage"
                  onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      setImageUrl(res[0].url);
                  }}
              />
              <p className="text-xs"> Aspect ratio 16:9 recommended </p>
            </div>
            </>
          }
    </div>
  )
}
