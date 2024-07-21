//Importar módulos
import { Router } from 'express'; //Importa el router de express para manejar las rutas
import { promises as fs } from 'fs';  //Importa el módulo fs de node y lo renombra como fs usando sus promesas.
import { fileURLToPath  } from 'url'; // Importa la función fileURLToPath del módulo url para convertir URLs de archivos en rutas de archivos.
import path from 'path'; //Importa el módulo path para trabajar con rutas de archivos y directorios.

//Configuración del router y rutas de archivos
const routerStudio = Router();  //Crea una instancia del router de express
const _filename = fileURLToPath(import.meta.url); //Convierte la URL del módulo actual en una ruta de archivo.
const _dirname = path.dirname(_filename); //Obtiene el directorio del archivo actual
const studiosFilePath = path.join(_dirname, "../../data/studios.json"); //Construye la ruta completa al archivo animes.json

//Funciones para leer y escribir en el archivo JSON
const readStudiosFs = async () => {  //readAnimesFs lee el contenido animes.json y lo devuelve como un objeto javascript
    try{
        const studios = await fs.readFile(studiosFilePath);
        return JSON.parse(studios);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeStudiosFs = async (studios) => { //Escribe un objeto JavaScript en el archivo animes.json
    await fs.writeFile(studiosFilePath, JSON.stringify(studios, null, 2));
};

//Rutas del router
//POST
routerStudio.post("/postStudios", async (req, res) => {   //Añade un nuevo anime al archivo animes.json
    const studios = await readStudiosFs(); //Lee los animes del archivo
    const newStudio = {  //Crea un nuevo anime con los datos del cuerpo de la solicitud
        id: studios.length + 1,
        name: req.body.name
    };

    studios.push(newStudio); //Añade el nuevo anime a la lista y escribe la lista actualizada en el archivo
    await writeStudiosFs(studios);
    const response = {
        message:"Studio creado exitosamente",
        studio: {
            id: newStudio.id,
            name: newStudio.name
        }
    }
    res.status(201).send(`Anime created successfully ${JSON.stringify(response)}`); //Responde con un mensaje de éxito
});

//GET
routerStudio.get("/", async (req, res) => {  //Obtiene todos los ánimes
    const studios = await readStudiosFs() //Lee los animes del archivo y
    const response = {
        studios
    }
    res.json(response); //Los devuelve en la respuesta
});

//GET BY ID
routerStudio.get("/:studiosId", async (req, res) => { //Obtiene un anime por su ID
    const studios = await readStudiosFs();  //Lee los animes del archivo
    const studio = studios.find(s => s.id === parseInt(req.params.studiosId)); //Busca el anime con el id especificado
    if(!studio) return res.status(404).send("Studio not found"); //Si no lo encuentra responde con error 404
    const response = {
        studio
    }
    res.json(response); //Si se encuentra lo devuelve en la respuesta
});

//PUT BY ID 
routerStudio.put("/:id", async (req, res) => { //Actualiza un anime por su id
    const studios = await readStudiosFs(); //Lee los animes del archivo
    const indexStudio = studios.findIndex(s => s.id === parseInt(req.params.id)); //Busca el indice del animado con el id especificado
    if(indexStudio === -1) return res.status(404).send("Studio not found"); //Si no encuentra responde con un error 404
    const updateStudio = {
        ...studios[indexStudio],
        name: req.body.name,
    }

    studios[indexStudio] = updateStudio; //Si se encuentra actualiza el anime con los nuevos datos 
    await writeStudiosFs(studios); //Escribe la lista actualizada en el archivo
    res.send(`Anime update successfully ${JSON.stringify(updateStudio)}`); //Responde con un mensaje de exito
});

//DELETE BY ID
routerStudio.delete("/delete/:id", async (req, res) => { //Ruta de eliminación. El manejador de la solicitud es una función asíncrona que toma dos parámetros: request y response
    let studios = await readStudiosFs(); // Se llama la función readAnimesFs que lee y devuelve la lista de animes desde un sistema de archivos. Await se usa para esperar a que la promesa de readAnimesFs se resuelva antes de continuar
    const studio = studios.find(s => s.id === parseInt(req.params.id)); //Se busca el anime con el id que coincide con el id proporcionado en la solicitud(req.params.id). parseInt se usa para convertir el id de cadena de texto a un número entero
    if(!studio) return res.status(404).send("Studio not found"); //Si no se encuentra ningun anime con el id proporcionado, se devuelve una respuesta con estado 404 y un mensaje. return res.status(404).send("Anime not found") finaliza la ejecución de la función si no se encuentra el anime.
    studios = studios.filter(s => s.id !== studio.id); //Se crea una nueva lista de animes que excluye el anime que desea eliminar. Filter devuelve una nueva matriz que contiene todos los elementos que no coinciden con el id del anime a eliminar.

    await writeStudiosFs(studios); //Se llama a esta función para ecsribir la lista actualizada de animes en el sistema de archivos. Await se usa para esperar que la promesa de writeAnimesFs se resuelva antes de continuar
    let response = {
        message: "Estudio eliminado exitosamente"
    }
    res.send(response); //Envío de respuesta de éxito

});









export default routerStudio;