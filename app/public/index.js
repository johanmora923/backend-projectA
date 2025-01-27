import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import cors from 'cors';


const app = express();
app.set("port",4000)
app.listen(app.get("port"))
console.log("Server on port", app.get("port"));

const corsOptions = {
    origin: 'http://localhost:5173/',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(__dirname + '/pages'));
console.log(__dirname)


app.get('/', (req, res) => { res.sendFile(__dirname + 'index.html'); });
