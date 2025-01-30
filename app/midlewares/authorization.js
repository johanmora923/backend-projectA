import  Jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {pool} from "../controllers/authentication.controllers.js";
import cookieParser from "cookie-parser";

dotenv.config()


async function onlyAdmin(req, res, next) {
    console.log(req.headers.cookie);
    const user =await  revisarCookie(req);
    if (user && user.logueado) {
        return next();
    }
    return res.redirect('/');
}

async function onlyPublic(req, res, next) {
    const user = await revisarCookie(req);
    if (user && user.logueado) {
        return res.redirect('/inicio'); // Redirige a una página específica si el usuario ya está logueado
    }
    return next();
}

async function revisarCookie(req){
    try {
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
            console.log("No hay cookies en la solicitud");
            return null;
        }

        const cookieJWT = cookieHeader.split("; ").find(cookie => cookie.startsWith("jwt="));
        if (!cookieJWT) {
            console.log("No se encontró la cookie JWT");
            return null;
        }

        const token = cookieJWT.slice(4);
        const decodificada = Jsonwebtoken.verify(token, process.env.JWT__SECRET);
        console.log("Token decodificado:", decodificada);

        const [users] = await pool.query('SELECT name FROM users WHERE name = ?', [decodificada.user]);
        if (users.length === 0) {
            console.log("Usuario no encontrado en la base de datos");
            return null;
        }

        return { logueado: true };
    } catch (error) {
        console.log("Error al revisar la cookie:", error);
        return null;
    }
}

export const METHODS = {
    onlyAdmin,
    onlyPublic
}
