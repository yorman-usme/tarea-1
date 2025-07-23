// Variables globales
const d = document;
let idPro = d.querySelector("#idPro");
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let imagenPro = d.querySelector("#imagenPro");
let descripcionPro = d.querySelector("#descripcionPro");
let btnGuardar = d.querySelector(".btnGuardar");
let tabla = d.querySelector(".table > tbody");

let buscarID = d.querySelector("#buscarID");
let btnBuscar = d.querySelector("#btnBuscar");
let resultadoBusqueda = d.querySelector("#resultadoBusqueda");
let btnExportarPDF = d.querySelector("#btnExportarPDF");

let editando = false;
let idEditando = null;
let productoBuscado = null; // Guardamos el producto encontrado

// Evento guardar o actualizar
btnGuardar.addEventListener("click", () => {
    validarDatos();
    mostrarDatos();
});

// Evento al cargar la página
d.addEventListener("DOMContentLoaded", () => {
    mostrarDatos();
});

// Evento para buscar por ID
btnBuscar.addEventListener("click", () => {
    buscarProductoPorID(buscarID.value.trim());
});

// Evento exportar a PDF
btnExportarPDF.addEventListener("click", () => {
    if (!productoBuscado) {
        alert("Primero busca un producto.");
        return;
    }

    const elemento = document.createElement("div");
    elemento.innerHTML = `
        <h2>Información del Producto</h2>
        <p><strong>ID:</strong> ${productoBuscado.id}</p>
        <p><strong>Nombre:</strong> ${productoBuscado.nombre}</p>
        <p><strong>Precio:</strong> ${productoBuscado.precio}</p>
        <p><strong>Descripción:</strong> ${productoBuscado.descripcion}</p>
        <img src="${productoBuscado.imagen}" width="150">
    `;

    html2pdf().from(elemento).save(`producto_${productoBuscado.id}.pdf`);
});

// Validar y guardar/actualizar
function validarDatos() {
    if (
        idPro.value.trim() &&
        nombrePro.value.trim() &&
        precioPro.value.trim() &&
        imagenPro.value.trim() &&
        descripcionPro.value.trim()
    ) {
        let producto = {
            id: idPro.value.trim(),
            nombre: nombrePro.value.trim(),
            precio: precioPro.value.trim(),
            imagen: imagenPro.value.trim(),
            descripcion: descripcionPro.value.trim()
        };

        let productos = JSON.parse(localStorage.getItem("productos")) || [];

        if (editando) {
            let index = productos.findIndex(p => p.id === idEditando);
            if (index !== -1) {
                productos[index] = producto;
                localStorage.setItem("productos", JSON.stringify(productos));
                alert("Producto actualizado con éxito");
            }
            editando = false;
            idEditando = null;
            btnGuardar.textContent = "Guardar";
        } else {
            if (productos.some(p => p.id === producto.id)) {
                alert("Ya existe un producto con este ID. Usa otro.");
                return;
            }

            productos.push(producto);
            localStorage.setItem("productos", JSON.stringify(productos));
            alert("Producto guardado con éxito");
        }

        limpiarFormulario();
    } else {
        alert("Todos los campos son obligatorios");
    }
}

// Mostrar todos los productos
function mostrarDatos() {
    tabla.innerHTML = "";
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" width="50"></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProducto('${producto.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${producto.id}')">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Eliminar producto
function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter(producto => producto.id !== id);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarDatos();
}

// Editar producto
function editarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id === id);

    if (producto) {
        idPro.value = producto.id;
        nombrePro.value = producto.nombre;
        precioPro.value = producto.precio;
        imagenPro.value = producto.imagen;
        descripcionPro.value = producto.descripcion;

        editando = true;
        idEditando = id;
        btnGuardar.textContent = "Actualizar";
        idPro.disabled = true;
    }
}

// Buscar producto por ID
function buscarProductoPorID(idBuscado) {
    if (!idBuscado) {
        resultadoBusqueda.classList.remove("alert-info", "alert-danger");
        resultadoBusqueda.classList.add("alert-warning");
        resultadoBusqueda.textContent = "Por favor ingresa un ID para buscar.";
        resultadoBusqueda.classList.remove("d-none");
        btnExportarPDF.classList.add("d-none");
        return;
    }

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id === idBuscado);

    if (producto) {
        productoBuscado = producto;
        resultadoBusqueda.innerHTML = `
            <strong>Producto encontrado:</strong><br>
            <b>ID:</b> ${producto.id}<br>
            <b>Nombre:</b> ${producto.nombre}<br>
            <b>Precio:</b> ${producto.precio}<br>
            <b>Descripción:</b> ${producto.descripcion}<br>
            <img src="${producto.imagen}" width="100">
        `;
        resultadoBusqueda.classList.remove("alert-danger", "d-none");
        resultadoBusqueda.classList.add("alert-info");
        btnExportarPDF.classList.remove("d-none");
    } else {
        resultadoBusqueda.classList.remove("alert-info", "d-none");
        resultadoBusqueda.classList.add("alert-danger");
        resultadoBusqueda.textContent = "No se encontró ningún producto con ese ID.";
        btnExportarPDF.classList.add("d-none");
        productoBuscado = null;
    }
}

// Limpiar campos
function limpiarFormulario() {
    idPro.value = "";
    nombrePro.value = "";
    precioPro.value = "";
    imagenPro.value = "";
    descripcionPro.value = "";
    idPro.disabled = false;
}
