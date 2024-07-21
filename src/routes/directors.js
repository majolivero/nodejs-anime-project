import { Router } from 'express'; 
import { promises as fs } from 'fs';  
import { fileURLToPath  } from 'url'; 
import path from 'path'; 

//Configuración del router y rutas de archivos
const routerDirectors = Router();  
const _filename = fileURLToPath(import.meta.url); 
const _dirname = path.dirname(_filename); 
const directorsFilePath = path.join(_dirname, "../../data/directores.json"); 

//Funciones para leer y escribir en el archivo JSON
const readDirectorsFs = async () => {  
    try{
        const directors = await fs.readFile(directorsFilePath);
        return JSON.parse(directors);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeDirectorsFs = async (directors) => { 
    await fs.writeFile(directorsFilePath, JSON.stringify(directors, null, 2));
};

//Rutas del router
//POST
routerDirectors.post("/postDirectors", async (req, res) => {   
    const directors = await readDirectorsFs(); 
    const newDirector = {  
        id: directors.length + 1,
        name: req.body.name
    };

    directors.push(newDirector); 
    await writeDirectorsFs(directors);
    const response = {
        message:"Director creado exitosamente",
        director: {
            id: newDirector.id,
            name: newDirector.name
        }
    }
    res.status(201).send(`Director created successfully ${JSON.stringify(response)}`); 
});

//GET
routerDirectors.get("/", async (req, res) => {  
    const directors = await readDirectorsFs() 
    const response = {
        directors
    }
    res.json(response); 
});

//GET BY ID
routerDirectors.get("/:directorsId", async (req, res) => { 
    const directors = await readDirectorsFs();  
    const director = directors.find(d => d.id === parseInt(req.params.directorsId)); 
    if(!director) return res.status(404).send("Director not found"); 
    const response = {
        director
    }
    res.json(response); 
});

//PUT BY ID 
routerDirectors.put("/:id", async (req, res) => { 
    const directors = await readDirectorsFs(); 
    const indexDirector = directors.findIndex(d => d.id === parseInt(req.params.id)); 
    if(indexDirector === -1) return res.status(404).send("Director not found"); 
    const updateDirector = {
        ...directors[indexDirector],
        name: req.body.name
    }

    directors[indexDirector] = updateDirector; 
    await writeDirectorsFs(directors); 
    res.send(`Directors update successfully ${JSON.stringify(updateDirector)}`); 
});

//DELETE BY ID
routerDirectors.delete("/delete/:id", async (req, res) => { 
    let directors = await readDirectorsFs(); 
    const director = directors.find(d => d.id === parseInt(req.params.id)); 
    if(!director) return res.status(404).send("Director not found"); 
    directors = directors.filter(d => d.id !== director.id); 

    await writeDirectorsFs(directors); 
    let response = {
        message: "Director eliminado exitosamente"
    }
    res.send(response); 

});


export default routerDirectors;