//Middleware para manejo de errores

const errorHandler = (err, req, res) => {  //Define una constante llamada errorHandler que es una función flecha. La función toma tres parámetros. err: el objeto error que contiene información sobre el error que ocurrió, req: el objeto de solicitud(request) de Express, res: "El objeto de respuesta(response) de Express."
    console.error(err.stack); //Imprime la pila de errores (stack trace) en la consola. 
    res.status(500).json({"error": err.message, "message": "Ocurrió un error en el servidor"})
};

export default errorHandler



//COMENTARIOS PARA ESTUDIAR
//res.statuts(500) establece el código de estado HTTP de la respuesta en 500, que indica un error interno del servidor.
//.json({"error": err.message, "message": "Ocurrió un error en el servidor"}): envía una respuesta en formato JSON al cliente.
//El JSON incluye:
//"error": err.message: El mensaje del error que ocurrió.
//"message": "Ocurrió un error en el servidor": Un mensaje adicional indicando que ocurrió un error en el servidor.

//export default errorHandler: Exporta la función errorHandler como la exportación por
//defecto del módulo. Esto permite que otros archivos importen esta función y la usen como 
//que es uun middleware para manejar errores en una aplicación Express.
