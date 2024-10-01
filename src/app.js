
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from 'express-handlebars'; 
import productsRouter from "./routes/products-router.js";
import cartsRouter from "./routes/carts-router.js";
import viewsRouter from "./routes/views-router.js";
import ProductManager from "./dao/db/product-manager-db.js";
import './database.js'; 
import viewsUserRouter from "./routes/viewsuser.router.js";
import userRouter from "./routes/user.router.js";
import initializePassport from "./config/passport.config.js";

// Inicialización de la aplicación
const app = express();
const PUERTO = 8080;

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.static("./src/public"));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/", viewsUserRouter);
app.use("/api/sessions", userRouter);


// Inicialización del servidor HTTP
const httpServer = createServer(app);
httpServer.listen(PUERTO, () => {
    console.log(`Conectado al puerto de Efrain Vitalis: ${PUERTO}`);
});

// Inicialización de ProductManager
const manager = new ProductManager();

// Socket.io
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    // Envío el array de productos al realtimeProducts
    socket.emit("productos", await manager.getProducts());

    // Recibo el evento eliminarProducto
    socket.on("eliminarProducto", async (id) => {
        await manager.deleteProduct(id);
        // Luego actualizamos los productos
        io.emit("productos", await manager.getProducts());
    });

    // Manejar el evento para agregar un producto
    socket.on("agregarProducto", async (newProduct) => {
        try {
            await manager.addProduct(newProduct);
            io.emit("productos", await manager.getProducts());
        } catch (error) {
            console.error('Error agregando producto:', error);
        }
    });
});
