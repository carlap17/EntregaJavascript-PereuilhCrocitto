let productos = [
    { nombre: "Esmalte Semipermanente Meliné", tipo: "Semipermanente", precio: 4900, stock: 3, id: "1" },
    { nombre: "Esmalte Semipermanente Kiki", tipo: "Semipermanente", precio: 2400, stock: 1, id: "2" },
    { nombre: "Esmalte Semipermanente Juka", tipo: "Semipermanente", precio: 3100, stock: 6, id: "3" },
    { nombre: "Esmalte Tradicional OPI", tipo: "Tradicional", precio: 4800, stock: 5, id: "4" },
    { nombre: "Esmalte Tradicional Essie", tipo: "Tradicional", precio: 11700, stock: 5, id: "5" },
    { nombre: "Esmalte Tradicional Gelize", tipo: "Tradicional", precio: 19900, stock: 9, id: "6" },
    { nombre: "Press On punta Coffin x600u", tipo: "Accesorios", precio: 2200, stock: 6, id: "7" },
    { nombre: "Polvo Aurora", tipo: "Accesorios", precio: 1500, stock: 4, id: "8" },
    { nombre: "Polvo Holográfico", tipo: "Accesorios", precio: 1430, stock: 4, id: "9" },
    { nombre: "Cabina Gadnic Led UV", tipo: "Cabina", precio: 33099, stock: 3, id: "10" },
    { nombre: "Cabina Sun Led UV", tipo: "Cabina", precio: 13999.99, stock: 7, id: "11" }
];


let carrito = [];

function principal(productos) {

    while (true) {
        let valor = Number(prompt(`Bienvenida/o a la tienda de Nail Art!\n\nIngrese la opción que desea aplicar:\n1- Ver lista de productos\n2- Agregar productos al carrito\n3- Finalizar compra\n4- Filtrar productos por categoría\n5- Ordenar productos de forma ascendente\n6- Ordenar productos de forma descendente\n7- Ordenar productos por precio ascendente\n8- Ordenar productos por precio descendente\n0- Salir`));

        if (valor === 0) {
            break
        }

        switch (valor) {
            case 1:
                alert(listar(productos))
                break
            case 2:
                while (true) {
                    const idCompra = prompt(`Ingrese el ID del producto que desea agregar al carrito:\n${listar(productos)}`);
                    
                    if (idCompra === "0") {
                        break;
                    }
                    
                    agregarAlCarrito(idCompra);

                    let continuarComprando = Number(prompt("¿Qué desea hacer?\n1- Seguir comprando\n2- Finalizar compra\n0- Volver al menú principal"));
                    
                    if (continuarComprando === 2) {
                        finalizarCompra(carrito);
                        return;
                    } else if (continuarComprando === 0) {
                        break;
                    }
                }
                break;            
            case 3:
                finalizarCompra(carrito)
                break
            case 4:
                const tipo = prompt(`Ingrese número de la categoría que desea filtrar:\n1- Semipermanente\n2- Tradicional\n3- Accesorios\n4- Cabinas`);
    
                if (tipo === "1" || tipo === "2" || tipo === "3" || tipo === "4") {
                    const tipoFiltrado = obtenerNombreCategoria(Number(tipo));
                    const productosFiltrados = filtrarPorTipo(productos, tipoFiltrado);

                    if (productosFiltrados.length === 0) {
                        alert("No se encontraron productos en esta categoría.");
                    } else {
                        alert(listar(productosFiltrados));
                    }
                } else {
                    alert("Número de categoría no válido.");
                }
                break;
            case 5:
                ordenarProductos(true)
                alert("Productos ordenados por precio ascendente a continuación:\n\n" + listar(productos))
                break
            case 6:
                ordenarProductos(false)
                alert("Productos ordenados por precio descendente a continuación:\n\n" + listar(productos))
                break
            case 7:
                ordenarAlfabetico(true)
                alert("Productos ordenados alfabeticamente de forma ascendente a continuación:\n\n" + listar(productos))
                break
            case 8:
                ordenarAlfabetico(false)
                alert("Productos ordenados alfabeticamente de forma descendente a continuación:\n\n" + listar(productos))
                break
            default:
                alert("Opción no válida.")
                break
        }
    }
}

function agregarAlCarrito(id) {
    let producto = productos.find(producto => producto.id === id);
    if (producto && producto.stock > 0) {
        let cantidad = Number(prompt(`Ingrese la cantidad de "${producto.nombre}" que desea agregar al carrito:\n(Stock: "${producto.stock}")`));

        if (cantidad > 0 && cantidad <= producto.stock) {
            let productoEnCarrito = carrito.find(item => item.id === id);

            if (productoEnCarrito) {
                productoEnCarrito.cantidad += cantidad;
            } else {
                carrito.push({ ...producto, cantidad });
            }

            producto.stock -= cantidad;
            alert(`Se agregaron ${cantidad} "${producto.nombre}" al carrito.`);
        } else {
            alert("Cantidad no válida o no hay suficiente stock.");
        }
    } else {
        alert("Producto no disponible o sin stock.");
    }
}

function finalizarCompra(carrito) {
    if (carrito.length === 0) {
        alert("El carrito está vacío. No se puede finalizar la compra.");
    } else {
        let total = 0;
        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad;
        });
        alert(`Total de la compra: $${total}`);
        alert(`Gracias por su compra. ¡Vuelva pronto!`);
        carrito.length = 0; 
    }
}

function listar(productos) {
    return productos.map(producto => `ID: ${producto.id} - ${producto.nombre}: $${producto.precio}`).join("\n")
}

function listarCarrito(carrito) {
    let lista = "Carrito de compras:\n\n"
    carrito.forEach(producto => {
        lista += `${producto.nombre} x${producto.cantidad}: $${(producto.precio * producto.cantidad).toFixed(2)}\n`;
    })
    return lista
}

function ordenarProductos(ascendente) {
    productos.sort((a, b) => (ascendente ? a.precio - b.precio : b.precio - a.precio))
}

function ordenarAlfabetico(ascendente) {
    productos.sort((a, b) => (ascendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)))
}

function filtrarPorTipo(productos, tipo) {
    return productos.filter(producto => producto.tipo === tipo);
}

function obtenerNombreCategoria(numero) {
    switch (numero) {
        case 1:
            return "Semipermanente";
        case 2:
            return "Tradicional";
        case 3:
            return "Accesorios";
        case 4:
            return "Cabina";
        default:
            return null;
    }
}


principal(productos);
