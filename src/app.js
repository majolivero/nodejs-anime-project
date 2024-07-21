//Importar módulos
import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.handler.js';
import routerAnime from './routes/animes.js';
import routerStudios from './routes/studios.js';
import routerDirectors from './routes/directors.js';
import routerCharacters from './routes/characters.js';

//Inicialización de la aplicación Express y configuración de dotenv
const app = express(); //Crea una instancia de la aplicación express
dotenv.config(); //Carga las variables de entorno desde el archivo .env

//Configuración del puerto
const PORT = process.env.PORT || 3010; //Establece el puerto en el que la aplicación escuchará las solicitudes. 

//Middlewares
app.use(express.json()); //Usa el middleware express.json para analizar las solicitudes con cuerpos JSON.
app.use('/animes', routerAnime); //Usa el router routerAnime para manejar todas las solicitudes a la ruta /animes.
app.use('/studios', routerStudios);
app.use('/directors',routerDirectors);
app.use('/characters',routerCharacters);
app.use(errorHandler); //Usa el middleware de manejo de errores errorHandler para manejar cualquier error que ocurra en la aplicación.


//Iniciar el servidor 
app.listen(PORT, () => {
    console.log(`El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`);
})


//Este archivo app.js configura y arranca una aplicación Express para crear una API. Utiliza dotenv 
//para manejar las variables de entorno, define middlewares para analizar JSON, manejar rutas
//específicas para animes, y manejar errores. Finalmente, arranca el servidor en el puerto especificado, 
//imprimiendo un mensaje en la consola cuando está listo para recibir solicitudes.