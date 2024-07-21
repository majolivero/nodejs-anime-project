import { Router } from 'express'; 
import { promises as fs } from 'fs';  
import { fileURLToPath  } from 'url'; 
import path from 'path'; 

//Configuración del router y rutas de archivos
const routerStudio = Router();  
const _filename = fileURLToPath(import.meta.url); 
const _dirname = path.dirname(_filename); 
const studiosFilePath = path.join(_dirname, "../../data/studios.json"); 

//Funciones para leer y escribir en el archivo JSON
const readStudiosFs = async () => {  
    try{
        const studios = await fs.readFile(studiosFilePath);
        return JSON.parse(studios);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeStudiosFs = async (studios) => { 
    await fs.writeFile(studiosFilePath, JSON.stringify(studios, null, 2));
};

//Rutas del router
//POST
routerStudio.post("/postStudios", async (req, res) => {   
    const studios = await readStudiosFs(); 
    const newStudio = {  
        id: studios.length + 1,
        name: req.body.name
    };

    studios.push(newStudio); 
    await writeStudiosFs(studios);
    const response = {
        message:"Studio creado exitosamente",
        studio: {
            id: newStudio.id,
            name: newStudio.name
        }
    }
    res.status(201).send(`Studio created successfully ${JSON.stringify(response)}`); 
});

//GET
routerStudio.get("/", async (req, res) => {  
    const studios = await readStudiosFs() 
    const response = {
        studios
    }
    res.json(response); 
});

//GET BY ID
routerStudio.get("/:studiosId", async (req, res) => { 
    const studios = await readStudiosFs();  
    const studio = studios.find(s => s.id === parseInt(req.params.studiosId)); 
    if(!studio) return res.status(404).send("Studio not found"); 
    const response = {
        studio
    }
    res.json(response); 
});

//PUT BY ID 
routerStudio.put("/:id", async (req, res) => { 
    const studios = await readStudiosFs(); 
    const indexStudio = studios.findIndex(s => s.id === parseInt(req.params.id)); 
    if(indexStudio === -1) return res.status(404).send("Studio not found"); 
    const updateStudio = {
        ...studios[indexStudio],
        name: req.body.name,
    }

    studios[indexStudio] = updateStudio; 
    await writeStudiosFs(studios); 
    res.send(`Studios update successfully ${JSON.stringify(updateStudio)}`); 
});

//DELETE BY ID
routerStudio.delete("/delete/:id", async (req, res) => { 
    let studios = await readStudiosFs(); 
    const studio = studios.find(s => s.id === parseInt(req.params.id)); 
    if(!studio) return res.status(404).send("Studio not found"); 
    studios = studios.filter(s => s.id !== studio.id); 

    await writeStudiosFs(studios); 
    let response = {
        message: "Estudio eliminado exitosamente"
    }
    res.send(response); 

});









export default routerStudio;