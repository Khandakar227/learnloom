import {ChangeEvent, FormEvent, useState} from 'react'
import Navbar from "@/components/common/Navbar";
import Editor from "@/components/courses/Editor";
import Input from "@repo/ui/input";
import { categories } from '@repo/utils/categories'
import CourseImageUpload from '@/components/courses/UploadDropzone';

type CourseData = {
  name: string,
  description: string,
  imageUrl: string,
  price: number,
  isPublished: boolean,
  categoryId: string,
};
const initialData:CourseData = {
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

  function onEditCourseDesc(value:string) {
    setCourseData(v => ({
      ...v,
      description: value,
    }))
  }

  function handleSubmit(e:FormEvent) {
    e.preventDefault();
    // Upload the image first
    // set the link to course data
    // send the data
    console.log(courseData)
  }

  function onChange(e:ChangeEvent) {
    const el = (e.target as HTMLInputElement);
    setCourseData(v => ({
      ...v,
      [el.name]: el.value,
    }))
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
                <option className='text-black'>Choose a Category</option>
                {
                  categories.map(category =>
                    <option key={category} className='text-black' value={category}>{category}</option>
                    )
                }
              </select>
            </div>

            <div className='pb-8'>
              <Input value={courseData.price} onChange={onChange} id="price" type='number' label="Course price (0 if free course)" min={0} name="price" placeholder="Price" />
            </div>

            <div className='py-12'>
              <button className='bg-green-600 text-white px-4 py-2 rounded-lg shadow'>Save</button>
            </div>
          </form>
        </div>
    </div>
  )
}
