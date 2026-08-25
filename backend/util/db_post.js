export default async function addPosts(posts) {
    try {
        // create the connection to database
        const connection = await mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
            ssl: {
                minVersion: "TLSv1.2",
                rejectUnauthorized: true
            }
        });

        // execute will internally call prepare and query
        // const [results, fields] = await connection.execute(
        //     'SELECT * FROM users;',
        //     []
        // );

        const values = posts.map(post => {
            const userId = parseInt((Math.random() * 10) % 9 + 1);
            const groupId = parseInt((Math.random() * 10) % 28 + 1);

            return [
                post.heading,
                post.body,
                userId,
                groupId
            ]
        });

        const placeholders = values
            .map(() => "(?, ?, ?, ?)")
            .join(",");

        const query = `
INSERT INTO posts (title, content, user_id, group_id)
VALUES ${placeholders}
        `;

        await connection.execute(
            query,
            values.flat()
        );

        console.log("data addedd successfully to the database");

    } catch (err) {
        console.log(err);
        console.log("error in adding the database");
        return err;
    }
}