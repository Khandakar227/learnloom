import { RowDataPacket } from "mysql2";
import { ModuleInputInfo } from "./types";

export type User = {
    email:string,
    name:string,
    photoUrl?:string
};


export const addInstructor = async (student:User) => {
    const conn = await db.getConnection();
    try {
        const query = `INSERT INTO instructor (id, email, name) VALUES (UUID(), ?, ?)`;
        const newUser = await conn.query(query, [student.email, student.name, student.photoUrl]);
        console.log(`User added: ${JSON.stringify(newUser)}`);
    } catch (error) {
        // console.log((error as Error).message);
        return
    } finally {
        conn.release();
    }
}

export const addStudent = async (student:User) => {
    const conn = await db.getConnection();
    try {
        const query = `INSERT INTO student (email, name) VALUES (UUID(), ?, ?)`;
        const newUser = await conn.query(query, [student.email, student.name, student.photoUrl]);
        // console.log(`Student added: ${JSON.stringify(newUser)}`);
    } catch (error) {
        // console.log(error);
        return
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
        return instructor[0]
    } catch (error) {
        console.log(error);
    } finally {
        conn.release();
    }
}

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
}

export const addCourse = async (course: {
    name: string;
    description: string;
    details?: string;
    imageUri?: string;
    price?: number;
    categoryId: string;
  }) => {
    const conn = await db.getConnection();
    try {
      const query = `INSERT INTO course (id, name, description, details, imageUri, price, categoryID) VALUES (UUID(), ?, ?, ?, ?, ?, ?)`;
      await conn.query(query, [
        course.name,
        course.description,
        course.details || "", 
        course.imageUri || "", 
        course.price || 0, 
        course.categoryId,
      ]);
      console.log(`Course "${course.name}" added`);
    } catch (error) {
      console.log(error);
    } finally {
      conn.release();
    }
  };

interface ModuleProps extends ModuleInputInfo {
  courseId: string;
}

export const addModule = async (module:ModuleProps) => {
    const conn = await db.getConnection();
    try {
      const query = `INSERT INTO module (id, name, details, videoUrl, courseId) VALUES (UUID(), ?, ?, ?, ?)`;
      await conn.query(query, [module.name, module.details, module.videoUrl, module.courseId]);
      console.log(`Module "${module.name}" added to course ${module.courseId}`);
    } catch (error) {
      console.log(error);
    } finally {
      conn.release();
    }
};
  
  export const updateModule = async (moduleId: string, module:ModuleInputInfo) => {
    const conn = await db.getConnection();
    try {
      let setClause = "",
        values: (string | number | boolean)[] = [];
      
      const keys = Object.keys(module);

      keys.forEach((key) => {
        if(key == 'courseId') return;
        setClause += `${key} = ?,`;
        values.push(module[key as keyof ModuleInputInfo]);
      });
  
      setClause.slice(0, -2); // to remove the trailing comma
      values.push(moduleId);    
      const query = `UPDATE module SET ${setClause} WHERE id = ?`;
      const updatedModule = await conn.query(query, values);
      return (updatedModule[0] as RowDataPacket)[0]
    } catch (error) {
      console.log(error);
    } finally {
      conn.release();
    }
  };
  
export const deleteCourse = async (courseId: string) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      const deleteEnrollments = `DELETE FROM enrolled WHERE courseID = ?`;
      await conn.query(deleteEnrollments, [courseId]);
  
      const deleteModules = `DELETE FROM module WHERE courseID = ?`;
      await conn.query(deleteModules, [courseId]);
  
      const deleteCourse = `DELETE FROM course WHERE id = ?`;
      await conn.query(deleteCourse, [courseId]);
  
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

export const enrollStudent = async (studentId: string, courseId: string) => {
    const conn = await db.getConnection();
    try {
      const query = `INSERT INTO enrolled (studentID, courseID) VALUES (?, ?)`;
      await conn.query(query, [studentId, courseId]);
      console.log(`Student with ID "${studentId}" enrolled in course "${courseId}"`);
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

