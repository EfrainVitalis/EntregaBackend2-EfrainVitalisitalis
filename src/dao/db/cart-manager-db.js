import CartModel from "../models/cart.model.js";

class CartManager {  

    // Crear Carrito    
    async createCarts() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;            
        } catch (error) {
            console.log("Error creating cart");
            return null;            
        }
    }

    // Que retorne un carrito por id:
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log("Cart does not exist with that id");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error getting cart");
            throw error;
        }
    }

    // Agregar productos al carrito
    async AddProductsToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId); 
            const theProductExists = cart.products.find(item => item.product.toString() === productId);

            if (theProductExists) {
                theProductExists.quantity += quantity; 
            } else {
                cart.products.push({ product: productId, quantity });
            }

            // Modificamos la propiedad product antes de guardar:
            cart.markModified("products");
            await cart.save();
            return cart; 
        } catch (error) {
            console.log("Error loading product");
            throw error;
        }
    }

    // Eliminar un producto específico del carrito
    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Cart does not exist with that id");
                return null;
            }
            
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            cart.markModified("products");
            await cart.save();
            
            return cart;
        } catch (error) {
            console.log("Error deleting product from cart");
            throw error;
        }
    }

    // Actualizar todos los productos del carrito
    async updateAllProductsInCart(cartId, products) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Cart does not exist with that id");
                return null;
            }

            cart.products = products;
            cart.markModified("products");
            await cart.save();
            
            return cart;
        } catch (error) {
            console.log("Error updating all products in cart");
            throw error;
        }
    }

    // Actualizar la cantidad de un producto específico en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Cart does not exist with that id");
                return null;
            }

            const product = cart.products.find(item => item.product.toString() === productId);
            if (product) {
                product.quantity = quantity;
                cart.markModified("products");
                await cart.save();
            }

            return cart;
        } catch (error) {
            console.log("Error updating product quantity in cart");
            throw error;
        }
    }

    // Eliminar todos los productos del carrito
    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Cart does not exist with that id");
                return null;
            }

            cart.products = [];
            cart.markModified("products");
            await cart.save();
            
            return cart;
        } catch (error) {
            console.log("Error deleting all products from cart");
            throw error;
        }
    }
}

export default CartManager;
