import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));



const app = express();
app.set("port",3306)
app.listen(app.get("port"))
console.log("Server on port", app.get("port"));

app.use(express.json());
app.use(express.static(__dirname + '/pages'));


app.get('/', (req, res) => { res.sendFile(__dirname + 'index.html'); });
