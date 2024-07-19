import { fileURLToPath } from "url";
import path from "path";

//2. Crear las rutas de la API

//Importar módulos
const express = require("express"); //Framework para crear aplicaciones web y APIs en Node.js.
const fs = require("fs"); //Módulo para trabajar con el sistema de archivos.
const path = require("path"); //Módulo para trabajar con y resolver rutas de archivos

//Configuración del router
const router = express.Router(); //router: Instancia de un enrutador de Express para manejar rutas de la API.
const animesFilePath = path.join(__dirname, "../../data/animes.json"); //path.join se utiliza para construir la ruta del archivo

//Leer las animes del archivo
const readAnimes = () => {   //readAnimes: Función que lee el contenido del archivo animes.json y devuelve las tareas en formato JSON.
    const animesData = fs.readFileSync(animesFilePath); //Lee el archivo de manera síncrona
    return JSON.parse(animesData); //Retorna los datos en formato JSON.
};

//Escribir animes en el archivo
const writeAnimes = (animes) => {  //La función writeAnimes toma el parámetro animes, que se espera que sea un objeto o una lista.
    fs.writeFileSync(animesFilePath, JSON.stringify(animes,null,2));
};

//Crear un nuevo anime
router.post("/", (req,res) => {
    const animes = readAnimes();
    const newAnimes = {
        id: animes.length + 1, //Simulamos un id autoincrementable
        title: req.body.title, //Obtenemos el título del anime desde el cuerpo de la solicitud
        genre: req.body.title,
        studioId: 1
    };
    animes.push(newAnimes);
    writeAnimes(animes);
    res.status(201).json({ message: "Tarea creada exitosamente" , anime:newAnimes});
});




