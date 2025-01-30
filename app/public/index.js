import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import cors from 'cors';
import { METHODS as autenticación } from '../controllers/authentication.controllers.js';
import { METHODS as autorización } from '../midlewares/authorization.js';
import cookieParser from 'cookie-parser';



const app = express();
app.set("port",4000)
app.listen(app.get("port"))
console.log("Server on port", app.get("port"));

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname + '/pages')));
console.log(__dirname)


console.log(3)
app.post('/login', autenticación.handleLogin);
console.log(2)
app.post('/register', autenticación.handleRegister);
