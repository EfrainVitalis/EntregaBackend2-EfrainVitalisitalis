import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const manager = new ProductManager();
const router = express.Router();

let products = [];

// Listar todos los productos y agregamos el sort para que ordene por precio:
router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const sort = req.query.sort; 

    try {
        let arrayProductos = await manager.getProducts();

        // Si se especifica el parámetro `sort`, ordenamos los productos
        if (sort === 'asc') {
            arrayProductos.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            arrayProductos.sort((a, b) => b.price - a.price);
        }

        // Aplicamos el límite si está definido
        if (limit) {
            arrayProductos = arrayProductos.slice(0, limit);
        }

        res.send(arrayProductos);
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Buscar productos por Id:
router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.send("Producto no encontrado");
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.send("Error de producto, no está ese id");
    }
});

// Agregar nuevo producto: 
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Inicializar productos
const initializeProducts = async () => {
    try {
        products = await manager.getProducts();
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
};

initializeProducts();

// Actualizar producto por ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).send({ status: "error", message: "Faltan parámetros en el cuerpo de la solicitud" });
    }

    try {
        const productoActualizado = {
            title,
            description
        };

        await manager.updateProduct(parseInt(pid), productoActualizado);
        res.send({ status: "success", message: "Producto actualizado" });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send({ status: "error", message: "Error al actualizar el producto" });
    }
});

// Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const productoEliminado = await manager.deleteProduct(parseInt(id));
        if (!productoEliminado) {
            res.status(404).send({ status: "error", message: "Producto no encontrado" });
        } else {
            res.send({ status: "success", message: "Producto eliminado" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});

// Agregar un nuevo producto (repetido en el original, removido duplicado)
router.post("/", async (req, res) => {
    const resultado = await manager.addProduct(req.body);

    if (resultado.success) {
        res.status(201).send(resultado.message);
    } else {
        res.status(400).send(resultado.message);
    }
});

export default router;
