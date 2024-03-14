export type Student = {
    email:string,
    name:string,
    photoUrl?:string
};

export const addStudent = async (student:Student) => {
    const conn = await db.getConnection();
    try {
        const query = `INSERT IGNORE INTO student (email, name, photoUrl) VALUES (?, ?, ?)`;
        const newUser = await conn.query(query, [student.email, student.name, student.photoUrl]);
        // console.log(`Student added: ${JSON.stringify(newUser)}`);
    } catch (error) {
        console.log(error)
    } finally {
        conn.release();
    }
}