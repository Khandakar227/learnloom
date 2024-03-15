import db from "./db/config";
import {addStudent, Student} from "./db/queries";
import {cn} from '../ui/src/cn'

export {
    db,
    addStudent,
    cn,
}
export type {
    Student,
}