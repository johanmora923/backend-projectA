import { createPool } from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import Jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';



dotenv.config();

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

export {
    pool
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
            const loginSuccessful = await bcryptjs.compare(password, userDB.password);
            if (!loginSuccessful) {
                console.log('problema de inicio de sesion');
                return res.status(401).send('User or password are incorrect');
            }
            const token = Jsonwebtoken.sign(
                {user: userDB.name},
                process.env.JWT__SECRET,
                {expiresIn:process.env.JWT__EXPIRATION}
            )
            const cookieOption = {
                expired: new Date(Date.now() + process.env.JWT__COOKIE__PROCESS * 24 * 60 * 60 * 100),
                path: "/"
            }
            console.log('inicio de sesion exitoso');
            res.cookie('jwt',token,cookieOption);
            return res.status(200).send({status:"ok",message:`Bienvenido ${userDB.name}`});
        }
    }
    catch(error){
        return res.status(500).send('Internal server error');  
    }
}

async function handleRegister( req, res) {
    const {user,password,email} = req.body;
    if (!user || !password || !email) {
        return res.status(400).send('User, password and email are required');
    }
    try {
        const [ users ] = await pool.query('SELECT * FROM users');
        for (let userDB of users) {
            if (user === userDB.name || email === userDB.email) {
                return res.status(400).send('User or email already exists');
            }
            const salt = await bcryptjs.genSalt(5);
            const hashPassword = await bcryptjs.hash(password,salt);
            const insert = "INSERT INTO users (name,password,email) VALUES ('"+user+"','"+hashPassword+"','"+email+"')";
            await pool.query(insert);
            return res.status(201).send({status:"ok",message:`usuario agregado`});
        }
    }
    catch(error){
        return res.status(500).send('Internal server error');
    }
}   


export const METHODS = {
    handleLogin,
    handleRegister
}