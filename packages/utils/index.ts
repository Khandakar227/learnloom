import db from "./db/config";
import {
  addStudent,
  getCategories,
  getInstructor,
  addInstructor,
  addCourse,
  getCourseByUser,
  getInstructorId,
  User,
} from "./db/queries";
import { cn } from "../ui/src/cn";


export {
  db,
  addStudent,
  getCategories,
  cn,
  getInstructor,
  addInstructor,
  addCourse,
  getInstructorId,
  getCourseByUser,
};
export type { User };
