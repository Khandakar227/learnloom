import db from "./db/config";
import {addStudent, getCategories, getInstructor, addInstructor, User} from "./db/queries";
import {cn} from '../ui/src/cn'

export {
    db,
    addStudent,
    getCategories,
    cn,
    getInstructor,
    addInstructor,
}
export type {
    User,
}