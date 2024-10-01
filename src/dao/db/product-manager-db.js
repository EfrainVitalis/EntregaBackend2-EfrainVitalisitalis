import ProductModel from "../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, price, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return { success: false, message: "Todos los campos son obligatorios" };
            }
   
            const existeProducto = await ProductModel.findOne({ code: code });
            if (existeProducto) {
                console.log("El código no es único");
                return { success: false, message: "El código no es único" };
            }
   
            const nuevoProducto = new ProductModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });
   
            await nuevoProducto.save();
            return { success: true, message: "Producto agregado exitosamente" };
   
        } catch (error) {
            console.log("Error al agregar un producto: ", error);
            return { success: false, message: "Error al agregar el producto" };
        }
    }
   
    async getProducts() {
        try {
            const arrayProductos = await ProductModel.find();
            return arrayProductos;
        } catch (error) {
            console.log("Error al obtener el producto", error);
        }
    }

    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id); 
            if (!producto) {
                console.log("producto no encontrado"); 
                return null;
            }
            return producto; 
        } catch (error) {
            console.log("Error al buscar por id", error); 
        }
    }
   
    // Método para actualizar productos:
    async updateProduct(id, productoActualizado) {
        try {
            const upproduct = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });

            if (!upproduct) {
                console.log("No se encuentra el producto!!");
                return null;
            }

            return upproduct;
        } catch (error) {
            console.log("Tenemos un error al actualizar productos", error);
        }
    }

    async deleteProduct(id) {
        try {
            const delproduct = await ProductModel.findByIdAndDelete(id);

            if (!delproduct) {
                console.log("No se encuentra el producto, ingresa datos correctos");
                return null;
            }

            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.log("Tenemos un error al eliminar productos");
        }
    }
}

export default ProductManager;
