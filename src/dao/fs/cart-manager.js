import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        this.loadCarts();
    }
    //metodos auxiliares para cargar y leer archivos:

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);

            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error loading carts", error);
            await this.saveCarts();
        }
    }

    async saveCarts(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCarts(){
        const newCart = {
            id: ++this.ultId,
            products:[]
        }
        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId){
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if(!cart){
                throw new Error("Cart does not exist with that id");
            }
            return cart;
        } catch (error) {
            console.log("Error getting cart");
            throw error;
        }
    }

    async AddProductsToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId); 
        const theProductExists = cart.products.find(p => p.product === productId);

        if(theProductExists) {
            theProductExists.quantity += quantity; 
        } else {
            cart.products.push({product: productId, quantity});
        }

        await this.saveCarts();
        return cart; 
    }
}


module.exports = CartManager;

