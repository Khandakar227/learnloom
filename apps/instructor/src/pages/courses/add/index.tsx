import {FormEvent, useState} from 'react'
import Navbar from "@/components/common/Navbar";
import Editor from "@/components/courses/Editor";
import Input from "@repo/ui/input";
import { categories } from '@repo/utils/categories'
import CourseImageUpload from '@/components/courses/UploadDropzone';


export default function AddCourse() {
  const [courseDescription, setCourseDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState({} as File);

  function onEditCourseDesc(value:string) {
    setCourseDescription(value)
  }

  function handleSubmit(e:FormEvent) {
      e.preventDefault();
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
              <Input id="text" label="Course title" name="name" placeholder="Title" />
            </div>
            <div className="pb-8">
              <p>Course description</p>
              <Editor onChange={(v) => onEditCourseDesc(v)} value={courseDescription}/>
            </div>
            <div className='pb-8'>
              <label htmlFor="isPublished" className='text-lg text-center'>
                <input className='w-4 h-4' type="checkbox" name="isPublished" id="isPublished" />
                Publish
              </label>
            </div>
            <div className='pb-8'>
              <label htmlFor="category" className="block mb-2 font-medium text-white">Select an option</label>
              <select id="category" className="max-h-96 overflow-y-auto bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5">
                <option className='text-black' selected>Choose a Category</option>
                {
                  categories.map(category =>
                    <option key={category} className='text-black' value={category}>{category}</option>
                    )
                }
              </select>
            </div>
            <div className='py-12'>
              <button className='bg-green-600 text-white px-4 py-2 rounded-lg shadow'>Save</button>
            </div>
          </form>
        </div>
    </div>
  )
}
