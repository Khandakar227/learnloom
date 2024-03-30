import { RowDataPacket } from "mysql2";
import { CourseInputInfo } from "../types";

export type User = {
  email: string;
  name: string;
  photoUrl?: string;
};

interface Course extends CourseInputInfo {
  instructorId: string;
}

export const addInstructor = async (student: User) => {
  const conn = await db.getConnection();
  try {
    const query = `INSERT INTO instructor (id, email, name) VALUES (UUID(), ?, ?)`;
    const newUser = await conn.query(query, [
      student.email,
      student.name,
      student.photoUrl,
    ]);
    console.log(`User added: ${JSON.stringify(newUser)}`);
  } catch (error) {
    // console.log((error as Error).message);
    return;
  } finally {
    conn.release();
  }
};

export const addStudent = async (student: User) => {
  const conn = await db.getConnection();
  try {
    const query = `INSERT INTO student (email, name) VALUES (UUID(), ?, ?)`;
    const newUser = await conn.query(query, [
      student.email,
      student.name,
      student.photoUrl,
    ]);
    // console.log(`Student added: ${JSON.stringify(newUser)}`);
  } catch (error) {
    // console.log(error);
    return;
  } finally {
    conn.release();
  }
};

export const addCourse = async (course: Course) => {
  const conn = await db.getConnection();
  try {
    const query = `INSERT INTO course (id, name, description, imageUrl, price, isPublished, categoryId, instructorId) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`;
    const newCourse = await conn.query(query, [
      course.name,
      course.description,
      course.imageUrl,
      course.price,
      course.isPublished,
      course.categoryId,
      course.instructorId,
    ]);
    console.log(`Course added: ${JSON.stringify(newCourse)}`);
  } catch (error) {
    console.log(error);
    return;
  } finally {
    conn.release();
  }
};

export const getCourseByUser = async (email:string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT course.*, category.name as category FROM course JOIN category on category.id = course.categoryId JOIN instructor on instructor.id = course.instructorId where instructor.email = ?`;
    const courses = await conn.query(query, [email]);
    return courses[0];
  } catch (error) {
    console.log(error);
    return []
  } finally {
    conn.release();
  }
}

export const getInstructor = async (email: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM instructor WHERE email = ?`;
    const instructor = await conn.query(query, [email]);
    console.log(`${JSON.stringify(instructor[0])}`);
    return instructor[0];
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getCategories = async () => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM category`;
    const categories = await conn.query(query);
    return categories[0];
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getInstructorId = async (email: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT id FROM instructor WHERE email = ?`;
    const instructor = await conn.query(query, [email]);
    return (instructor[0] as RowDataPacket)[0].id;;
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};
