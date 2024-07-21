import { Router } from 'express'; 
import { promises as fs } from 'fs';  
import { fileURLToPath  } from 'url'; 
import path from 'path'; 

const routerCharacters = Router();  
const _filename = fileURLToPath(import.meta.url); 
const _dirname = path.dirname(_filename); 
const charactersFilePath = path.join(_dirname, "../../data/personajes.json"); 

//Funciones para leer y escribir en el archivo JSON
const readCharactersFs = async () => {  
    try{
        const characters = await fs.readFile(charactersFilePath);
        return JSON.parse(characters);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeCharactersFs = async (characters) => { 
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));
};

//Rutas del router
//POST
routerCharacters.post("/postCharacters", async (req, res) => {   
    const characters = await readCharactersFs(); 
    const newCharacter = {  
        id: characters.length + 1,
        name: req.body.name,
        animeId: req.body.animeId
    };

    characters.push(newCharacter); 
    await writeCharactersFs(characters);
    const response = {
        message:"Personaje creado exitosamente",
        character: {
            id: newCharacter.id,
            name: newCharacter.name,
            animeId: newCharacter.animeId
        }
    }
    res.status(201).send(`Character created successfully ${JSON.stringify(response)}`); 
});

//GET
routerCharacters.get("/", async (req, res) => {  
    const characters = await readCharactersFs() 
    const response = {
        characters
    }
    res.json(response); 
});

//GET BY ID
routerCharacters.get("/:charactersId", async (req, res) => { 
    const characters = await readCharactersFs();  
    const character = characters.find(c => c.id === parseInt(req.params.charactersId)); 
    if(!character) return res.status(404).send("Character not found"); 
    const response = {
        character
    }
    res.json(response); 
});

//PUT BY ID 
routerCharacters.put("/:id", async (req, res) => { 
    const characters = await readCharactersFs(); 
    const indexCharacter = characters.findIndex(c => c.id === parseInt(req.params.id)); 
    if(indexCharacter === -1) return res.status(404).send("Character not found"); 
    const updateCharacter = {
        ...characters[indexCharacter],
        name: req.body.name,
        animeId: req.body.animeId
    }

    characters[indexCharacter] = updateCharacter; 
    await writeCharactersFs(characters); 
    res.send(`Characters update successfully ${JSON.stringify(updateCharacter)}`); 
});


//DELETE BY ID
routerCharacters.delete("/delete/:id", async (req, res) => { 
    let characters = await readCharactersFs(); 
    const character = characters.find(c => c.id === parseInt(req.params.id)); 
    if(!character) return res.status(404).send("Character not found"); 
    characters = characters.filter(c => c.id !== character.id); 

    await writeCharactersFs(characters); 
    let response = {
        message: "Personaje eliminado exitosamente"
    }
    res.send(response); 

});

export default routerCharacters;