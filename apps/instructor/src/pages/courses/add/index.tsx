import {useState} from 'react'
import Navbar from "@/components/common/Navbar";
import Editor from "@/components/courses/Editor";
import Input from "@repo/ui/input";
import CourseImageUpload from '@/components/courses/ImageUpload';

export default function AddCourse() {
  const [courseDescription, setCourseDescription] = useState("");
  
  function onEditCourseDesc(value:string) {
    setCourseDescription(value)
  }
  return (
    <div>
        <Navbar/>
        <div className="py-12 px-2 max-w-4xl mx-auto">
          <h2 className="text-3xl pb-8">Add a new Course</h2>
          <form>
            <CourseImageUpload/>
            <div className="pb-8">
              <Input id="text" label="Course title" name="name" placeholder="Title" />
            </div>
            <div className="pb-8">
              <p>Course description</p>
              <Editor onChange={(v) => onEditCourseDesc(v)} value={courseDescription}/>
            </div>
          </form>
        </div>
    </div>
  )
}
