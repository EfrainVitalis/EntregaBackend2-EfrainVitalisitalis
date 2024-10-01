

import { promises as fs } from "fs";

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.cargarArray();
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
        } catch (error) {
            console.log("Error al inicializar ProductManager:", error);
        }
    }

    async addProduct({ title, description, price, img, code, stock }) {
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }

        const nuevoProducto = {
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            title,
            description,
            price,
            img,
            code,
            stock
        };

        this.products.push(nuevoProducto);
        await this.guardarArchivo(this.products);
        console.log("Producto agregado exitosamente");
    }

    async getProducts() {
        return await this.leerArchivo();
    }

    async getProductById(id) {
        const arrayProductos = await this.leerArchivo();
        const buscado = arrayProductos.find(item => item.id === id);

        if (!buscado) {
            console.log("Producto no encontrado");
            return null;
        } else {
            console.log("Producto encontrado:", buscado);
            return buscado;
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            return JSON.parse(respuesta);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
            console.log("Archivo guardado exitosamente");
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        }
    }

    async updateProduct(id, productoActualizado) {
        const arrayProductos = await this.leerArchivo();
        const index = arrayProductos.findIndex(item => item.id === id);

        if (index !== -1) {
            arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
            await this.guardarArchivo(arrayProductos);
            console.log("Producto actualizado");
        } else {
            console.log("No se encontró el producto");
        }
    }

    async deleteProduct(id) {
        const arrayProductos = await this.leerArchivo();
        const index = arrayProductos.findIndex(item => item.id === id);

        if (index !== -1) {
            arrayProductos.splice(index, 1);
            await this.guardarArchivo(arrayProductos);
            console.log("Producto eliminado");
            return true;
        } else {
            console.log("No se encontró el producto");
            return false;
        }
    }
}

export default ProductManager;
