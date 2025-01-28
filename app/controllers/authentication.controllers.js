import { createPool } from 'mysql2/promise';

let pool;
try {
    pool = createPool({
        host: 'bwvxcku5txdwk7meiayz-mysql.services.clever-cloud.com',
        user: 'u1xrecofby3ual5y',
        password: 'ZgoqH9tZgXX1XfZroUUj',
        database: 'bwvxcku5txdwk7meiayz',
        connectionLimit: 5,
        port: 3306
    });
} catch (error) {
    console.log('Error en la conexion a la base de datos', error);
}

async function handleLogin( req, res ) {
    const { user, password } = req.body;
    if (!user || !password) {
        return res.status(400).send('User and password are required');
    }
    try{
        const [ users ] = await pool.query('SELECT name,password FROM users WHERE name = ?', [user]);
        for (let userDB of users) {
            console.log(userDB);
            if (user !== userDB.name  || password !== userDB.password) {
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