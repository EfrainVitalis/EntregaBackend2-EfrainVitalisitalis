 import { io } from "socket.io-client"; // Asegúrate de que la librería está instalada

const socket = io();

// Traemos el array de productos
socket.on("productos", (data) => {
    console.log('Productos recibidos:', data); 
    renderProductos(data);
});

// Función para renderizar productos
const renderProductos = (productos) => {
    const containerProducts = document.getElementById("contenedorProductos");
    containerProducts.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = ` 
            <p> ID: ${item.id} </p>
            <p> Título: ${item.title} </p>
            <p> Descripción: ${item.description} </p>
            <p> Precio: $${item.price} </p>
            <p> Imagen: ${item.img} </p>
            <p> Código: ${item.code} </p>
            <p> Stock: ${item.stock} </p>
            <button> Eliminar </button>                         
        `;

        containerProducts.appendChild(card);

        // Hacemos andar el botón de eliminar
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
};

// Función para eliminar producto
const eliminarProducto = (id) => {
    console.log(`Eliminar producto con ID: ${id}`);
    socket.emit("eliminarProducto", id);
};

// Formulario para agregar productos
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const img = document.getElementById('img').value;
    const code = document.getElementById('code').value;
    const stock = parseInt(document.getElementById('stock').value);

    const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock
    };

    console.log('Enviando producto al servidor:', newProduct); 
    socket.emit('agregarProducto', newProduct);

    productForm.reset();
});
