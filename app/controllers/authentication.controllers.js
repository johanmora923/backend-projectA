import createPool from 'mysql2/promise';

const pool = createPool.createPool({
    host: 'bwvxcku5txdwk7meiayz-mysql.services.clever-cloud.com',
    user: 'u1xrecofby3ual5y',
    password: 'ZgoqH9tZgXX1XfZroUUj',
    database: 'bwvxcku5txdwk7meiayz',
    connectionLimit: 5,
    port: 3306
});


async function handleLogin(req, res) {
    try{
        const { user, password } = req.body;
        const { users } = await pool.query('SELECT * FROM users');
        for (let userDB of users) {
            console.log(userDB);
            if (!user || !password) {
                return res.status(400).send('User and password are required');
            }
            else if (user !== userDB.name  || password !== userDB.password) {
                console.log('problema de inicio de sesion');
                return res.status(401).send('User or password are incorrect');
            }
            console.log('inicio de sesion exitoso');
            return res.status(200).send('Login successful');
        }
    }
    catch(error){
        return res.status(500).send('Internal server error');  
    }
}

export const METHODS = {
    handleLogin
}