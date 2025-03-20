import { createPool } from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import Jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();

let pool;
try {
    pool = createPool({
        host: 'bpieovcz0hrb4mhmdnjz-mysql.services.clever-cloud.com',
        user: 'u1ubotl5zkze8jbg',
        password: 'P9UCmh1dsnRyAV8988ro',
        database: 'bpieovcz0hrb4mhmdnjz',
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
        const [ users ] = await pool.query('SELECT id,name,password,email FROM users WHERE name = ?', [user]);
        for (let userDB of users) {
            console.log(userDB);
            if (user !== userDB.name) {
                console.log('problema de inicio de sesion');
                return res.status(401).send('incorect credentials');
            }

            const loginSuccessful = await bcryptjs.compare(password, userDB.password);

            if (!loginSuccessful) {
                console.log('problema de inicio de sesion2');
                return res.status(401).send('incorect credentials');
            }
            console.log('aquiesta el peo')
            const token = Jsonwebtoken.sign(
                {user: userDB.name},
                process.env.JWT__SECRET,
                {expiresIn:process.env.JWT__EXPIRATION}
            )
            console.log('aquiesta el peo2')
            const cookieOption = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
                path: "/"
            }
            const id = userDB.id.toString()
            const email = userDB.email.toString()
            res.cookie("jwt",token,cookieOption);
            res.send({status:"ok", message:"inicio de seccion satisfactorio", id: id, email: email })
            console.log('login suscefull')
        }
    }
    catch(error){  
        console.log(1,error)
        return res.status(500).send('Internal server error');  
    }
}

async function handleRegister( req, res) {
    const {user,password,email} = req.body;
    if (!user || !password || !email) {
        return res.status(400).send('User, password and email are required');
    }
    try {
        console.log('aqui')
        const [ users ] = await pool.query('SELECT * FROM users');
        console.log(users)
        for (let userDB of users) {
            if (userDB.name & user === userDB.name || userDB.email & email === userDB.email) {
                return res.status(400).send('User or email already exists');
            }
            console.log('aqui2')
            const salt = await bcryptjs.genSalt(5);
            const hashPassword = await bcryptjs.hash(password,salt);
            const insert = "INSERT INTO users (name,password,email) VALUES ('"+user+"','"+hashPassword+"','"+email+"')";
            await pool.query(insert);
            return res.status(201).send({status:"ok",message:`usuario agregado`});
        }
    }
    catch(error){
        console.error(error)
        return res.status(500).send('Internal server error 2');
    }
}   


export const METHODS = {
    handleLogin,
    handleRegister
}
