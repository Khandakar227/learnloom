import { RowDataPacket } from "mysql2";
import { CourseInputInfo, ModuleInputInfo } from "../types";

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
      course.isPublished ? 1 : 0,
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

export const getCourseByUser = async (email: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT course.*, category.name as category FROM course JOIN category on category.id = course.categoryId JOIN instructor on instructor.id = course.instructorId where instructor.email = ?`;
    const courses = await conn.query(query, [email]);
    return courses[0];
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    conn.release();
  }
};

export const getInstructor = async (email: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM instructor WHERE email = ?`;
    const instructor = await conn.query(query, [email]);
    console.log(`${JSON.stringify(instructor[0])}`);
    return instructor[0] as any;
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getStudent = async (email: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM student WHERE email = ?`;
    const student = await conn.query(query, [email]);
    console.log(`${JSON.stringify(student[0])}`);
    return student[0] as any;
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
export const getCategoriesOfCourses = async () => {
  const conn = await db.getConnection();
  try {
    const query = `select distinct c.name from course left join category c on c.id = course.categoryId`;
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
    return (instructor[0] as RowDataPacket)[0].id;
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getPublishedCourses = async ({limit=20, offset=0}) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT course.*, category.name as category FROM course JOIN category on category.id = course.categoryId JOIN instructor on instructor.id = course.instructorId where isPublished = 1 order by course.createdAt desc limit ? offset ?`;
    const courses = await conn.query(query, [limit, offset]);
    return (courses[0] as RowDataPacket);
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    conn.release();
  }
};

export const getCourse = async (id: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT course.*, category.name as category FROM course JOIN category on category.id = course.categoryId JOIN instructor on instructor.id = course.instructorId where course.id = ?`;
    const courses = await conn.query(query, [id]);
    return (courses[0] as RowDataPacket)[0];
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    conn.release();
  }
};

export const updateCourse = async (id: string, course: CourseInputInfo) => {
  const conn = await db.getConnection();
  try {
    let setClause = "",
      values: (string | number | boolean)[] = [];

    const keys = Object.keys(course) as (keyof CourseInputInfo)[];
    keys.forEach((key) => {
      if (key == 'name' || key == 'isPublished' || key == 'categoryId' || key == 'description' || key == 'imageUrl' || key == 'price') {
        setClause += `${key} = ?,`;
        values.push(course[key as keyof CourseInputInfo]);
      }
    });
    setClause = setClause.slice(0, -1); // to remove the trailing comma
    values.push(id);
    const query = `UPDATE course SET ${setClause} WHERE id = ?`;
    const updatedCourse = await conn.query(query, values);
    return (updatedCourse[0] as RowDataPacket);
  } catch (error) {
    console.log(error);
    return null
  } finally {
    conn.release();
  }
};

interface ModuleProps extends ModuleInputInfo {
  courseId: string;
}

export const getAllModules = async (courseId: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM module WHERE courseId = ? Order by orderNo ASC`;
    const modules = await conn.query(query, [courseId]);
    return (modules[0] as RowDataPacket);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getAllModulesLittleInfo = async (courseId: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT id, name, orderNo FROM module WHERE courseId = ? Order by orderNo ASC`;
    const modules = await conn.query(query, [courseId]);
    return (modules[0] as RowDataPacket);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getModule = async (id:string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM module WHERE id = ?`;
    const module = await conn.query(query, [id]);
    return (module[0] as RowDataPacket)[0];
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
}

export const addModule = async (module: ModuleProps) => {
  const conn = await db.getConnection();
  try {
    const query = `INSERT INTO module (id, name, orderNo, details, videoUrl, courseId) VALUES (UUID(), ?, ?, ?, ?, ?)`;
    await conn.query(query, [
      module.name,
      module.orderNo,
      module.details,
      module.videoUrl,
      module.courseId,
    ]);
    console.log(`Module "${module.name}" added to course ${module.courseId}`);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};


export const addModuleById = async (moduleId:string, module: ModuleProps) => {
  const conn = await db.getConnection();
  try {
    const query = `INSERT INTO module (id, name, orderNo, details, videoUrl, courseId) VALUES (?, ?, ?, ?, ?, ?)`;
    await conn.query(query, [
      moduleId,
      module.name,
      module.orderNo,
      module.details,
      module.videoUrl,
      module.courseId,
    ]);
    console.log(`Module "${module.name}" added to course ${module.courseId}`);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};
export const updateModule = async (
  moduleId: string,
  module: ModuleInputInfo
) => {
  const conn = await db.getConnection();
  try {
    let setClause = "",
      values: (string | number | boolean)[] = [];

    const keys = Object.keys(module);

    keys.forEach((key) => {
      if (key != "courseId"){
        setClause += `${key} = ?,`;
        values.push(module[key as keyof ModuleInputInfo]);
      }
    });
    setClause = setClause.slice(0, -1); // to remove the trailing comma
    values.push(moduleId);
    const query = `UPDATE module SET ${setClause} WHERE id = ?`;
    const updatedModule = await conn.query(query, values);
    return (updatedModule[0] as RowDataPacket)[0];
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};


export const deleteModule = async (moduleId: string) => {
  const conn = await db.getConnection();
  try {
    const query = `DELETE FROM module WHERE id = ?`;
    await conn.query(query, [moduleId]);
    console.log(`Module "${moduleId}" deleted`);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getModulesCountForCourse = async (courseId:string) => {
  const conn = await db.getConnection();
  try {
    const query = `Select count(*) as moduleCount from module where courseID = ?`;
    const moduleCount = await conn.query(query, [courseId]);
    return (moduleCount[0] as RowDataPacket)[0]
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
}

export const deleteCourse = async (courseId: string, instructorId: string) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const deleteEnrollments = `DELETE FROM enrolled join course c on c.id = enrolled.courseId AND c.instructorId = ? WHERE courseID = ?`;
    await conn.query(deleteEnrollments, [instructorId, courseId]);

    const deleteModules = `DELETE FROM module join course c on c.id = module.courseId AND c.instructorId = ?  WHERE courseID = ?`;
    await conn.query(deleteModules, [instructorId, courseId]);

    const deleteCourse = `DELETE FROM course WHERE id = ? AND instructorId = ?`;
    await conn.query(deleteCourse, [instructorId, courseId]);

    await conn.commit();
    console.log(`Course "${courseId}" deleted`);
  } catch (error) {
    await conn.rollback();
    console.log(error);
  } finally {
    conn.release();
  }
};

export const searchCourse = async (searchTerm: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT * FROM course WHERE name LIKE ? OR description LIKE ?`;
    const searchResults = await conn.query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
    return searchResults[0];
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};
type PaymentInfo = {
  courseId: string;
  studentId: string;
  paymentId: string;
  amount: number;
  paymentMethod: string;
  phoneNo: string;
};

export const enrollStudent = async (info:PaymentInfo) => {
  const conn = await db.getConnection();
  try {
    const query = `INSERT INTO enrolled (studentID, courseID) VALUES (?, ?)`;
    await conn.query(query, [info.studentId, info.courseId]);
    const paymentQuery = `INSERT INTO enroll_payment (studentId, courseId, paymentId, amount, paymentMethod, phoneNo) VALUES (?, ?, ?, ?, ?, ?)`;
    await conn.query(paymentQuery, [info.studentId, info.courseId, info.paymentId, info.amount, info.paymentMethod, info.phoneNo]);
    console.log(`Student with ID "${info.studentId}" enrolled in course "${info.courseId}"`);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getEnrolledCourses = async (studentId: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT c.* FROM course c JOIN enrolled e ON c.id = e.courseID WHERE e.studentID = ?`;
    const courses = await conn.query(query, [studentId]);
    return courses;
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const getEnrolledData = async (studentId: string, courseId: string) => {
  const conn = await db.getConnection();
  try {
    const query = `SELECT p.* FROM enrolled e JOIN enroll_payment p ON p.courseId = e.courseId AND p.studentId = e.studentId WHERE e.studentID = ? AND e.courseID = ?`;
    const courses = await conn.query(query, [studentId]);
    return courses;
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

export const publishCourse = async (courseId: string, isPublished: boolean) => {
  const conn = await db.getConnection();
  try {
    const query = `UPDATE course SET isPublished = ? WHERE id = ?`;
    await conn.query(query, [isPublished, courseId]);
    console.log(`Course "${courseId}" published status: ${isPublished}`);
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};
