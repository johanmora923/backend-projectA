import  Jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {pool} from "../controllers/authentication.controllers.js";
import cookieParser from "cookie-parser";

dotenv.config()


function onlyAdmin(req, res, next) {
    console.log(req.headers.cookie);
    const user = revisarCookie(req);
    if (user && user.logueado) {
        return next();
    }
    return res.redirect('/');
}

function onlyPublic(req, res, next) {
    const user = revisarCookie(req);
    if (user && user.logueado) {
        return res.redirect('/account'); // Redirige a una página específica si el usuario ya está logueado
    }
    return next();
}

async function revisarCookie(req){
    const [users] = await pool.query('SELECT name,password FROM users');
    try{
        const cookieJWT = req.headers.cookie.split("; ").find(cookie=> cookie.startsWith("jwt=")).slice(4);
        const decodificada = Jsonwebtoken.verify(cookieJWT,process.env.JWT__SECRET)
        console.log("cod",cookieJWT);
        for(const user of users){
            if(user.name !== decodificada.user){
                console.log(user.name)
                return false
            }return true
    }
    }   
    catch{
        console.log("no llego la cookie")
        return false;
        
    }
}

export const METHODS = {
    onlyAdmin,
    onlyPublic
}