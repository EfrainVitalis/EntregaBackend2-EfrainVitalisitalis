import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCarts();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    let cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        res.status(500).send("Error getting products from cart");
    }
});

// Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.AddProductsToCart(cartId, productId, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Product error");
    }
});

// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).send({ error: 'Cart or product not found' });
        }
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Error deleting product from cart");
    }
});

// Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;

    try {
        const updatedCart = await cartManager.updateAllProductsInCart(cartId, products);
        if (!updatedCart) {
            return res.status(404).send({ error: 'Cart not found' });
        }
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Error updating cart products");
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        if (!updatedCart) {
            return res.status(404).send({ error: 'Cart or product not found' });
        }
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Error updating product quantity in cart");
    }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = await cartManager.deleteAllProductsFromCart(cartId);
        if (!updatedCart) {
            return res.status(404).send({ error: 'Cart not found' });
        }
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Error deleting all products from cart");
    }
});

export default router;
