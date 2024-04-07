import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import Navbar from "@/components/common/Navbar";
import Editor from "@/components/courses/Editor";
import Input from "@repo/ui/input";
import CourseImageUpload from '@/components/courses/UploadDropzone';
import { GetServerSidePropsContext } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { queries } from '@repo/utils'
import { CourseInputInfo } from '@repo/utils/types';
import { useUploadThing } from '@repo/utils/client';
import { toast } from 'react-toastify';

type Categories = {id: string, name: string}

const initialData:CourseInputInfo = {
  name: "",
  description: "",
  imageUrl: "",
  price: 0,
  isPublished: false,
  categoryId: ""
}

export default function AddCourse() {
  const [coverPhoto, setCoverPhoto] = useState({} as File);
  const [courseData, setCourseData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories []>([]);
  const {startUpload} = useUploadThing("courseImage");


  useEffect(() => {
    localStorage.setItem('courseData', JSON.stringify(courseData))
  }, [courseData])

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
      let imageUrl = "";
      setLoading(true);
      // Upload the image first
      if(coverPhoto && coverPhoto.name) {
        const fileRes = await startUpload([coverPhoto]);
        // set the link to course data
        imageUrl = fileRes ? fileRes[0].url : "";
      }
      // send the data
      await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({...courseData, imageUrl})
      })
      console.log(courseData);
      setLoading(false)
      toast.success("Course added.");
    } catch (error) {
      setLoading(false);
      toast.success("[Error]: " + (error as Error).message);
    }
  }

  function onChange(e:ChangeEvent) {
    const el = (e.target as HTMLInputElement);
    setCourseData(v => ({
      ...v,
      [el.name]: el.value,
    }));
  }

  return (
    <div>
        <Navbar/>
        <div className="py-12 px-2 max-w-4xl mx-auto">
          <h2 className="text-3xl pb-8">Add a new Course</h2>
          <form onSubmit={handleSubmit}>
            <CourseImageUpload
              file={coverPhoto}
              setFile={setCoverPhoto}
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
                <input className='w-4 h-4' type="checkbox" name="isPublished" id="isPublished" value={`${courseData.isPublished}`} onChange={onChange} />
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
    const userData = await queries.getInstructor(user.user.email)
    console.log(userData)
    return { props: {} }
}