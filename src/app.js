import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import __dirname from "./utlis.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

//Inicio motor de plantillas
app.engine("handlebars", handlebars.engine());

//Establezco la ruta de las vistas
app.set("views", `${__dirname}/views`);

//Establezco el motor de renderizado
app.set("view engine", "handlebars");

//Establezco el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

//Utilizo en la ruta base mi grupo de views routes
app.use("/", viewsRouter);

//Inicio mi servidor HTTP y lo almaceno en una constante
const PORT = 8080;
const BASE_URL = "http://localhost"
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en ${BASE_URL}:${PORT}`);
});

//Inicio mi servidor Socket
const io = new Server(httpServer);

const messages = [];
io.on("connection", socket => {
    console.log("Nuevo cliente conectado: ", socket.id);

    socket.on("message", data => {
        //console.log(`Mensaje: ${data.message}`);
        messages.push(data);

        io.emit("messagesLogs", messages);
    });

    socket.on("userConnect", data => {
        socket.emit("messagesLogs", messages);
        socket.broadcast.emit("newUser", data);
    });
});
