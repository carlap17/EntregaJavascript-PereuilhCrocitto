let productos = []

fetch('productos.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`No se puede cargar archivo JSON`)
        }
        return response.json()
    })
    .then(data => {
        productos = data
        renderizarProductos(productos, carrito)
    })
    .catch(error => {
        console.error('Error al cargar productos:', error)
    })

let carritoRecuperado = localStorage.getItem("carrito")
let carrito = carritoRecuperado ? JSON.parse(carritoRecuperado) : []

// Renderizar productos
function renderizarProductos(productos, carrito) {
    let contenedor = document.getElementById("contenedorProd")
    contenedor.innerHTML = ""

    productos.forEach(producto => {
        let tarjeta = document.createElement("div")
        tarjeta.className = "tarjeta"
        tarjeta.innerHTML = `<img src=./images/${producto.rutaImagen}>
        <h4>${producto.nombre}</h4>
        <p>$${producto.precio}</p>
        <h5>Stock:${producto.stock}</h5>
        <button id=${producto.id}>Agregar al carrito</button>
        `
        contenedor.appendChild(tarjeta)

        let botonAgregarAlCarrito = document.getElementById(producto.id)
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(producto, carrito))

        if (carrito.find(item => item.id === producto.id)) {
            botonAgregarAlCarrito.disabled = true
        }
    })
}

// Agregar prod al carrito
function agregarProductoAlCarrito(producto, carrito) {
    let productoEnCarrito = carrito.find(item => item.id === producto.id)

    if (producto.stock > 0) {
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                rutaImagen: producto.rutaImagen
            })
        }
        producto.stock--
        localStorage.setItem("carrito", JSON.stringify(carrito))
        tostada()
    } else {
        Swal.fire({
            title: '¡Lo sentimos!',
            text: 'No hay más stock del producto',
            icon: 'error'
        })
    }

    renderizarCarrito(carrito)
}

// Renderizar carrito
function renderizarCarrito(carrito) {
    let divCarrito = document.getElementById("carrito")
    divCarrito.innerHTML = ""

    let precioTotal = 0

    carrito.forEach(item => {
        let tarjetaCarrito = document.createElement("div");
        tarjetaCarrito.className = "tarjCarrito"
        tarjetaCarrito.innerHTML = `
            <div class="info-producto">
                <p>${item.nombre}</p>
                <p>Precio: $${item.precio}</p>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Subtotal: $${item.precio * item.cantidad}</p>
            </div>
            <div class="imgcarrito">
            <img src="./images/${item.rutaImagen}" alt="${item.nombre}">
            </div>
        `
        divCarrito.appendChild(tarjetaCarrito)

        precioTotal += item.precio * item.cantidad
    })

    if (precioTotal != 0) {
        let totalLine = document.createElement("div")
        totalLine.className = "precioPagar"
        totalLine.innerHTML = `<p>Total a pagar: $${precioTotal}</p>`
        divCarrito.appendChild(totalLine)

        let boton = document.createElement("button")
        boton.innerHTML = "Finalizar compra"
        boton.addEventListener("click", finalizarCompra)
        divCarrito.appendChild(boton)
    }
}

// Finalizar compra
function finalizarCompra() {
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)

    Swal.fire({
        title: '¡Compra exitosa!',
        text: 'Gracias, vuelva prontos!',
        icon: 'success'
    })
    verOcultarCarrito()
    renderizarProductos(productos, carrito)
}

// Filtrar y renderizar productos
function filtrarYRenderizar() {
    let buscador = document.getElementById("buscador").value.toLowerCase()
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador))
    renderizarProductos(productosFiltrados, carrito)
}

// Boton Buscar
let buscar = document.getElementById("buscar")
buscar.addEventListener("click", filtrarYRenderizar)

let buscador = document.getElementById("buscador")
buscador.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        filtrarYRenderizar()
    }
})

let botonVerOcultar = document.getElementById("verOcultar")
botonVerOcultar.addEventListener("click", verOcultarCarrito)

function verOcultarCarrito() {
    let carrito = document.getElementById("carrito")
    let contenedorProd = document.getElementById("contenedorProd")
    carrito.classList.toggle("oculta")
    contenedorProd.classList.toggle("oculta")
    let filtro = document.getElementById("filtroCategoria")
    filtro.classList.toggle("oculta")
}

// Resetear barra de busqueda
let resetearBusqueda = document.getElementById("resetearBusqueda")
resetearBusqueda.addEventListener("click", reiniciarListaProductos)

// Filtrar por categoría
let filtroCategoria = document.getElementById("filtroCategoria")

filtroCategoria.addEventListener("change", filtrarPorCategoria)

function filtrarPorCategoria() {
    let categoriaSeleccionada = filtroCategoria.value

    let productosFiltrados = productos

    if (categoriaSeleccionada !== "") {
        productosFiltrados = productos.filter(producto => producto.tipo === categoriaSeleccionada)
    }

    renderizarProductos(productosFiltrados, carrito)
}

// Reiniciar lista despues de buscar
function reiniciarListaProductos() {
    renderizarProductos(productosOriginales, carrito)
    document.getElementById("buscador").value = ""
}

function tostada() {
    Toastify({
        text: "Se agregó un producto al carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #563d7c, #9988BD)",
        },
        onClick: function () { }
    }).showToast()
}

renderizarCarrito(carrito)