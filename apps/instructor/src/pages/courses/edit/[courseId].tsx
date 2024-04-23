import Navbar from "@/components/common/Navbar";
import Editor from "@/components/courses/Editor";
import CourseImageUpload from "@/components/courses/UploadDropzone";
import { getSession } from "@auth0/nextjs-auth0";
import Input from "@repo/ui/input";
import { queries } from "@repo/utils";
import { useUploadThing } from "@repo/utils/client";
import { CourseData } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Categories = {id: string, name: string}

type EditCourseProps = {
  course: CourseData
}

export default function EditCourse({course}:EditCourseProps) {
  const router = useRouter();
  const [coverPhoto, setCoverPhoto] = useState({} as File);
  const [courseData, setCourseData] = useState(course);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories []>([]);
  const {startUpload} = useUploadThing("courseImage");

  useEffect(() => {
    console.log(course)
  }, [])

  useEffect(() => {
    fetch("/api/categories")
    .then(res => res.json())
    .then(data => {
      if(data.error) {
        console.log(data.message)
        return;
      }
      setCategories(data.categories);
    })
    .catch(err => console.log(err));
  }, []);

  
  function onEditCourseDesc(value:string) {
    setCourseData(v => ({
      ...v,
      description: value,
    }))
  }

  
  async function handleSubmit(e:FormEvent) {
    e.preventDefault();
    try {
      let imageUrl = courseData.imageUrl;
      setLoading(true);
      // Upload the image first
      if(coverPhoto && coverPhoto.name) {
        const fileRes = await startUpload([coverPhoto]);
        // set the link to course data
        imageUrl = fileRes ? fileRes[0].url : imageUrl;
      }
      // send the data
      await fetch(`/api/course/${router.query.courseId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({...courseData, imageUrl})
      })
      
      setLoading(false)
      toast.success("Course updated.");
      router.push("/courses");
    } catch (error) {
      setLoading(false);
      toast.success("[Error]: " + (error as Error).message);
    }
  }

  function onChange(e:ChangeEvent) {
    const el = (e.target as HTMLInputElement);
    const key = el.name as keyof CourseData;
    
    setCourseData(v => {
      if(key == 'isPublished')
        return {
          ...v,
          isPublished: el.checked 
        }
      return {
        ...v,
        [el.name]: el.value,
      }
    });
  }

  function setImageUrl() {
    setCourseData(v => ({...v, imageUrl: ""}))
  }

  return (
    <div>
    <Navbar/>
    <div className="py-12 px-2 max-w-4xl mx-auto">
      <h2 className="text-3xl pb-8">Update Course</h2>
      <form onSubmit={handleSubmit}>
        <CourseImageUpload
          file={coverPhoto}
          setFile={setCoverPhoto}
          fileUrl={courseData.imageUrl}
          setFileUrl={setImageUrl}
        />
        <div className="pb-8">
          <Input id="name" label="Course title" name="name" placeholder="Title" value={courseData.name} onChange={onChange} />
        </div>
        
        <div className="pb-8">
          <p>Course description</p>
          <Editor onChange={onEditCourseDesc} value={courseData.description}/>
        </div>
        
        <div className='pb-8'>
          <label htmlFor="isPublished" className='text-lg text-center'>
            <input checked={courseData.isPublished} className='w-4 h-4' type="checkbox" name="isPublished" id="isPublished" onChange={onChange} />
            Publish
          </label>
        </div>

        <div className='pb-8'>
          <label htmlFor="categoryId" className="block mb-2 text-white">Select an option</label>
          <select name='categoryId' value={courseData.categoryId} onChange={onChange} id="categoryId" className="max-h-96 overflow-y-auto bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5">
            <option className='text-black' value="">Choose a Category</option>
            {
              categories.map(category =>
                <option key={category.id} className='text-black' value={category.id}>{category.name}</option>
                )
            }
          </select>
        </div>

        <div className='pb-8'>
          <Input value={courseData.price} onChange={onChange} id="price" type='number' label="Course price (0 if free course)" min={0} name="price" placeholder="Price" />
        </div>
        <p className='italic'>You can add course modules after you have saved the course.</p>
        <div className='py-12'>
          <button disabled={loading} className='bg-green-600 text-white px-4 py-2 rounded-lg shadow'>
            {loading ? <span className='loader block w-4'></span> : "Save"}
          </button>
        </div>
      </form>
    </div>
</div>
  )
}

export async function getServerSideProps(context:GetServerSidePropsContext) {
  const user = await getSession(context.req, context.res);
  if(!user)
  return {
    redirect: {
      permanent: false,
      destination: "/"
    }
  }
  const params = context.params;
  if(!params || !params.courseId) 
    return { props: { course: null } }
    const course = await queries.getCourse(params.courseId as string)
    // console.log(course)
    return { props: { course: JSON.parse(JSON.stringify(course)) } }
}