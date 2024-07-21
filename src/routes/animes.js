//Importar módulos
import { Router } from 'express'; //Importa el router de express para manejar las rutas
import { promises as fs } from 'fs';  //Importa el módulo fs de node y lo renombra como fs usando sus promesas.
import { fileURLToPath  } from 'url'; // Importa la función fileURLToPath del módulo url para convertir URLs de archivos en rutas de archivos.
import path from 'path'; //Importa el módulo path para trabajar con rutas de archivos y directorios.

//Configuración del router y rutas de archivos
const routerAnime = Router();  //Crea una instancia del router de express
const _filename = fileURLToPath(import.meta.url); //Convierte la URL del módulo actual en una ruta de archivo.
const _dirname = path.dirname(_filename); //Obtiene el directorio del archivo actual
const animesFilePath = path.join(_dirname, "../../data/animes.json"); //Construye la ruta completa al archivo animes.json


//Funciones para leer y escribir en el archivo JSON
const readAnimesFs = async () => {  //readAnimesFs lee el contenido animes.json y lo devuelve como un objeto javascript
    try{
        const animes = await fs.readFile(animesFilePath);
        return JSON.parse(animes);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeAnimesFs = async (animes) => { //Escribe un objeto JavaScript en el archivo animes.json
    await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
};

//Rutas del router
//POST
routerAnime.post("/postAnimes", async (req, res) => {   //Añade un nuevo anime al archivo animes.json
    const animes = await readAnimesFs(); //Lee los animes del archivo
    const newAnime = {  //Crea un nuevo anime con los datos del cuerpo de la solicitud
        id: animes.length + 1,
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId
    };

    animes.push(newAnime); //Añade el nuevo anime a la lista y escribe la lista actualizada en el archivo
    await writeAnimesFs(animes);
    const response = {
        message:"Anime creado exitosamente",
        anime: {
            id: newAnime.id,
            title: newAnime.title,
            genre: newAnime.genre,
            studioId: newAnime.studioId
        }
    }
    res.status(201).send(`Anime created successfully ${JSON.stringify(response)}`); //Responde con un mensaje de éxito
});

//GET
routerAnime.get("/", async (req, res) => {  //Obtiene todos los ánimes
    const animes = await readAnimesFs() //Lee los animes del archivo y
    const response = {
        animes
    }
    res.json(response); //Los devuelve en la respuesta
});

//GET BY ID
routerAnime.get("/:animeId", async (req, res) => { //Obtiene un anime por su ID
    const animes = await readAnimesFs();  //Lee los animes del archivo
    const anime = animes.find(a => a.id === parseInt(req.params.animeId)); //Busca el anime con el id especificado
    if(!anime) return res.status(404).send("Anime not found"); //Si no lo encuentra responde con error 404
    const response = {
        anime
    }
    res.json(response); //Si se encuentra lo devuelve en la respuesta
});

//PUT BY ID 
routerAnime.put("/:id", async (req, res) => { //Actualiza un anime por su id
    const animes = await readAnimesFs(); //Lee los animes del archivo
    const indexAnime = animes.findIndex(a => a.id === parseInt(req.params.id)); //Busca el indice del animado con el id especificado
    if(indexAnime === -1) return res.status(404).send("Anime not found"); //Si no encuentra responde con un error 404
    const updateAnime = {
        ...animes[indexAnime],
        title: req.body.title,
        genre: req.body.genre
    }

    animes[indexAnime] = updateAnime; //Si se encuentra actualiza el anime con los nuevos datos 
    await writeAnimesFs(animes); //Escribe la lista actualizada en el archivo
    res.send(`Anime update successfully ${JSON.stringify(updateAnime)}`); //Responde con un mensaje de exito
});

//DELETE BY ID
routerAnime.delete("/delete/:id", async (req, res) => { //Ruta de eliminación. El manejador de la solicitud es una función asíncrona que toma dos parámetros: request y response
    let animes = await readAnimesFs(); // Se llama la función readAnimesFs que lee y devuelve la lista de animes desde un sistema de archivos. Await se usa para esperar a que la promesa de readAnimesFs se resuelva antes de continuar
    const anime = animes.find(a => a.id === parseInt(req.params.id)); //Se busca el anime con el id que coincide con el id proporcionado en la solicitud(req.params.id). parseInt se usa para convertir el id de cadena de texto a un número entero
    if(!anime) return res.status(404).send("Anime not found"); //Si no se encuentra ningun anime con el id proporcionado, se devuelve una respuesta con estado 404 y un mensaje. return res.status(404).send("Anime not found") finaliza la ejecución de la función si no se encuentra el anime.
    animes = animes.filter(a => a.id !== anime.id); //Se crea una nueva lista de animes que excluye el anime que desea eliminar. Filter devuelve una nueva matriz que contiene todos los elementos que no coinciden con el id del anime a eliminar.

    await writeAnimesFs(animes); //Se llama a esta función para ecsribir la lista actualizada de animes en el sistema de archivos. Await se usa para esperar que la promesa de writeAnimesFs se resuelva antes de continuar
    let response = {
        message: "Anime eliminado exitosamente"
    }
    res.send(response); //Envío de respuesta de éxito

});

export default routerAnime; //Exporta el router para que pueda ser usado en otros archivos del proyecto


