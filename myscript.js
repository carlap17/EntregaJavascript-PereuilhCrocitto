let productos = [
    { nombre: "Esmalte Semipermanente Meliné", tipo: "Semipermanente", precio: 4900, stock: 3, id: "1", rutaImagen: "semipermanente1.jpeg" },
    { nombre: "Esmalte Semipermanente Kiki", tipo: "Semipermanente", precio: 2400, stock: 1, id: "2", rutaImagen: "semipermanente2.jpeg" },
    { nombre: "Esmalte Semipermanente Juka", tipo: "Semipermanente", precio: 3100, stock: 6, id: "3", rutaImagen: "semipermanente3.jpeg" },
    { nombre: "Esmalte Tradicional OPI", tipo: "Tradicional", precio: 4800, stock: 5, id: "4", rutaImagen: "tradicional1.jpg" },
    { nombre: "Esmalte Tradicional Essie", tipo: "Tradicional", precio: 11700, stock: 5, id: "5", rutaImagen: "tradicional2.jpg" },
    { nombre: "Esmalte Tradicional Gelize", tipo: "Tradicional", precio: 19900, stock: 9, id: "6", rutaImagen: "tradicional3.jpg" },
    { nombre: "Press On punta Coffin x600u", tipo: "Accesorios", precio: 2200, stock: 6, id: "7", rutaImagen: "press-on.jpg" },
    { nombre: "Polvo Aurora", tipo: "Accesorios", precio: 1500, stock: 4, id: "8", rutaImagen: "brillos1.jpg" },
    { nombre: "Polvo Holográfico", tipo: "Accesorios", precio: 1430, stock: 4, id: "9", rutaImagen: "brillos2.jpg" },
    { nombre: "Cabina Gadnic Led UV", tipo: "Cabina", precio: 33099, stock: 3, id: "10", rutaImagen: "cabina1.jpg" },
    { nombre: "Cabina Sun Led UV", tipo: "Cabina", precio: 13999.99, stock: 7, id: "11", rutaImagen: "cabina2.jpg" }
];

// Copia de respaldo de la lista de productos original
let productosOriginales = [...productos];

let carritoRecuperado = localStorage.getItem("carrito");
let carrito = carritoRecuperado ? JSON.parse(carritoRecuperado) : [];

// Función para renderizar productos
function renderizarProductos(productos, carrito) {
    let contenedor = document.getElementById("contenedorProd");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        tarjeta.innerHTML = `<img src=./images/${producto.rutaImagen}>
        <h4>${producto.nombre}</h4>
        <p>$${producto.precio}</p>
        <button id=${producto.id}>Agregar al carrito</button>
        `;
        contenedor.appendChild(tarjeta);

        let botonAgregarAlCarrito = document.getElementById(producto.id);
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(producto, carrito));
        
        // Verificar si el producto está en el carrito
        if (carrito.find(item => item.id === producto.id)) {
            botonAgregarAlCarrito.disabled = true;
        }
    });
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(producto, carrito) {
    let productoEnCarrito = carrito.find(item => item.id === producto.id);

    if (producto.stock > 0) {
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }
        producto.stock--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
        alert("No hay más stock del producto seleccionado");
    }

    renderizarCarrito(carrito);
}

// Función para renderizar el carrito
function renderizarCarrito(carrito) {
    let divCarrito = document.getElementById("carrito");
    divCarrito.innerHTML = "";

    let precioTotal = 0

    carrito.forEach(item => {
        let tarjetaCarrito = document.createElement("div");
        tarjetaCarrito.innerHTML = `
        <p>${item.nombre}</p>
        <p>Precio: $${item.precio}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Subtotal: $${item.precio * item.cantidad}</p>
        `;
        divCarrito.appendChild(tarjetaCarrito);
        
        precioTotal += item.precio * item.cantidad
    });

    if (precioTotal != 0) {
        let totalLine = document.createElement("div")
        totalLine.innerHTML = `<p>Total a pagar: $${precioTotal}</p>`
        divCarrito.appendChild(totalLine)
    
        let boton = document.createElement("button");
    boton.innerHTML = "Finalizar compra";
    boton.addEventListener("click", finalizarCompra);
    divCarrito.appendChild(boton);
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    localStorage.removeItem("carrito");
    carrito = [];
    renderizarCarrito(carrito);

    alert("¡Gracias por su compra!")
}

// Función para filtrar y renderizar productos
function filtrarYRenderizar() {
    let buscador = document.getElementById("buscador").value.toLowerCase();
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador));
    renderizarProductos(productosFiltrados, carrito);
}

// Evento para el botón de buscar
let buscar = document.getElementById("buscar");
buscar.addEventListener("click", filtrarYRenderizar);

let buscador = document.getElementById("buscador");
buscador.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        // Filtrar productos cuando se presiona Enter
        filtrarYRenderizar();
    }
});

// Llamada inicial para renderizar productos
renderizarProductos(productos, carrito);

let botonVerOcultar = document.getElementById("verOcultar");
botonVerOcultar.addEventListener("click", verOcultarCarrito);

function verOcultarCarrito() {
    let carrito = document.getElementById("carrito");
    let contenedorProd = document.getElementById("contenedorProd");
    carrito.classList.toggle("oculta");
    contenedorProd.classList.toggle("oculta");
}

let resetearBusqueda = document.getElementById("resetearBusqueda");
resetearBusqueda.addEventListener("click", reiniciarListaProductos);

// Obtener el elemento de selección de categoría
let filtroCategoria = document.getElementById("filtroCategoria");

// Agregar un evento que se dispare cuando cambie la selección
filtroCategoria.addEventListener("change", filtrarPorCategoria);

function filtrarPorCategoria() {
    // Obtener la categoría seleccionada
    let categoriaSeleccionada = filtroCategoria.value;

    // Filtrar los productos según la categoría
    let productosFiltrados = productos;

    if (categoriaSeleccionada !== "") {
        productosFiltrados = productos.filter(producto => producto.tipo === categoriaSeleccionada);
    }

    // Renderizar los productos filtrados
    renderizarProductos(productosFiltrados, carrito);
}

// Función para reiniciar la lista de productos
function reiniciarListaProductos() {
    // Utiliza la lista de productos original
    renderizarProductos(productosOriginales, carrito);
    document.getElementById("buscador").value = ""; // Limpia el campo de búsqueda
}
// Llamada inicial para renderizar el carrito
renderizarCarrito(carrito);