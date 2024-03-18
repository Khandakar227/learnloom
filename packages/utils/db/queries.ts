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