/* ==========================================================================
   Catálogo Oficial de Productos - Level-Up Gamer (Actualizado)
   ========================================================================== */

window.catalogoHardware = [
    {
        codigo: "JM001",
        titulo: "Catan",
        descripcion: "El célebre juego de estrategia, negociación y colonización. Reúne materias primas, construye pueblos y expande tus dominios para convertirte en el soberano de la isla.",
        precio: "$29.990",
        imagen: "https://i5.walmartimages.com/asr/a1863816-7553-441d-ad37-734a716ed55a.00a63b9153c188bd583dbfd05b191f90.jpeg",
        categoria: "Juegos de Mesa",
        destacado: true
    },
    {
        codigo: "AC001",
        titulo: "Controlador Inalámbrico Xbox Series X",
        descripcion: "Experimenta el diseño modernizado del mando inalámbrico de Xbox, con superficies esculpidas y geometría refinada para una mayor comodidad. Totalmente compatible con consolas Xbox, PC y dispositivos móviles.",
        precio: "$59.990",
        imagen: "https://i5.walmartimages.cl/asr/e53427b4-1133-4a53-93c8-9774f0385073.ad9f942fce2f82f3b36e538ba0c8dd5b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        categoria: "Accesorios",
        destacado: true
    },
    {
        codigo: "MS001",
        titulo: "Mouse Gamer Logitech G502 HERO",
        descripcion: "Equipado con el sensor óptico avanzado HERO 25K, 11 botones completamente programables, pesas ajustables individuales y tecnología de iluminación RGB LIGHTSYNC personalizable.",
        precio: "$49.990",
        imagen: "https://media.spdigital.cl/thumbnails/products/snbujg5__29f7dd61_thumbnail_4096.jpg",
        categoria: "Mouse",
        destacado: true
    },
    {
        codigo: "AC002",
        titulo: "Auriculares Gamer HyperX Cloud II",
        descripcion: "Proporcionan un sonido envolvente de alta fidelidad virtual 7.1 con un micrófono desmontable con cancelación de ruido y almohadillas de espuma viscoelástica para una comodidad insuperable.",
        precio: "$79.990",
        imagen: "https://http2.mlstatic.com/D_NQ_NP_953165-CBT112200835901_052026-O.webp",
        categoria: "Accesorios",
        destacado: false
    }
];

/* ==========================================================================
   src/js/productos.js - Lógica del Carrito (LEVEL-UP GAMER)
   ========================================================================== */

// 1. Cargar arreglo global desde LocalStorage
let carrito = JSON.parse(localStorage.getItem("levelup_cart")) || [];

/**
 * 2. Añade un producto al carrito o incrementa su cantidad si ya existe
 */
function agregarAlCarro(id, nombre, precio) {
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Guardar cambios en LocalStorage y redibujar interfaz
    guardarYActualizar();
}

/**
 * 3. Resta cantidad de un producto o lo elimina por completo si llega a 0
 */
function removerDelCarro(id) {
    const itemIndex = carrito.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return;

    carrito[itemIndex].cantidad--;

    if (carrito[itemIndex].cantidad === 0) {
        carrito.splice(itemIndex, 1);
    }

    // Guardar cambios en LocalStorage y redibujar interfaz
    guardarYActualizar();
}

function actualizarVistaCarrito() {
    const contenedorListadoPage = document.getElementById("cart-items-page-list");
    const mensajeVacio = document.getElementById("cart-vacio");
    const txtCantidadTotal = document.getElementById("total-articulos");
    const txtPrecioTotal = document.getElementById("precio-total");
    const txtSubtotalPrecio = document.getElementById("subtotal-precio");
    const navbarCount = document.getElementById("cart-count");

    // Contador del menú de navegación (siempre se actualiza en cualquier pestaña)
    if (navbarCount) {
        let itemsTotales = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        navbarCount.innerText = itemsTotales;
    }

    // Si no estamos explícitamente en la vista carrito.html, salimos para evitar errores de consola
    if (!contenedorListadoPage) return;

    if (carrito.length === 0) {
        contenedorListadoPage.style.display = "none";
        if (mensajeVacio) mensajeVacio.style.display = "block";
        if (txtCantidadTotal) txtCantidadTotal.innerText = "0";
        if (txtPrecioTotal) txtPrecioTotal.innerText = "$0";
        if (txtSubtotalPrecio) txtSubtotalPrecio.innerText = "$0";
        return;
    }

    contenedorListadoPage.style.display = "block";
    if (mensajeVacio) mensajeVacio.style.display = "none";
    contenedorListadoPage.innerHTML = ""; // Limpiar iteración previa

    let acumuladorCantidad = 0;
    let acumuladorPrecio = 0;

    carrito.forEach(item => {
        acumuladorCantidad += item.cantidad;
        acumuladorPrecio += (item.precio * item.cantidad);

        // Fabricamos la estructura horizontal idéntica a tu mockup
        const row = document.createElement("div");
        row.className = "cart-page-item";
        row.innerHTML = `
            <div class="cart-item-preview">NO IMG</div>
            <div class="cart-item-details" style="flex-grow: 1; margin-left: 20px;">
                <h3 style="margin:0 0 10px 0;">${item.nombre}</h3>
                <p style="color: #00bfff; font-weight: bold; margin:0;">$${item.precio.toLocaleString('es-CL')}</p>
            </div>
            <div class="cart-page-controls">
                <button class="qty-btn" onclick="removerDelCarro('${item.id}')">-</button>
                <span style="min-width:20px; text-align:center;">${item.cantidad}</span>
                <button class="qty-btn" onclick="agregarAlCarro('${item.id}', '${item.nombre.replace(/'/g, "\\'")}', ${item.precio})">+</button>
            </div>
        `;
        contenedorListadoPage.appendChild(row);
    });

    if (txtCantidadTotal) txtCantidadTotal.innerText = acumuladorCantidad;
    if (txtSubtotalPrecio) txtSubtotalPrecio.innerText = `$${acumuladorPrecio.toLocaleString('es-CL')}`;
    if (txtPrecioTotal) txtPrecioTotal.innerText = `$${acumuladorPrecio.toLocaleString('es-CL')}`;
}
/**
 * Función auxiliar para sincronizar el LocalStorage y refrescar la vista en un solo paso
 */
function guardarYActualizar() {
    localStorage.setItem("levelup_cart", JSON.stringify(carrito));
    actualizarVistaCarrito();
}

/**
 * 5. Vacía el carrito por completo
 */
function limpiarCarro() {
    carrito = [];
    guardarYActualizar();
}

/**
 * 6. Simulación de checkout final
 */
function finalizarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Añade productos antes de pagar.");
        return;
    }
    alert("🚀 ¡Compra procesada con éxito! Tu orden de Level-Up Gamer se está preparando.");
    carrito = [];
    guardarYActualizar();
}

/* ==========================================================================
   Lógica del Modal de Detalles
   ========================================================================== */
function abrirDetalle(id, nombre, desc, img, precio) {
    const modal = document.getElementById("product-modal");
    if(!modal) return;
    
    document.getElementById("modal-img").src = img;
    document.getElementById("modal-title").innerText = nombre;
    document.getElementById("modal-desc").innerText = desc;
    document.getElementById("modal-price").innerText = precio;
    
    const precioNumerico = parseInt(precio.replace(/[^0-9]/g, ''));
    
    const btnAdd = document.getElementById("modal-btn-add");
    btnAdd.onclick = function() {
        agregarAlCarro(id, nombre, precioNumerico);
        cerrarDetalle();
    };
    
    modal.classList.add("active"); 
}

function cerrarDetalle() {
    const modal = document.getElementById("product-modal");
    if(modal) modal.classList.remove("active");
}

/**
 * Alterna (abre o cierra) la visibilidad de la barra lateral del carrito
 */
function toggleCarrito() {
    const sidebar = document.querySelector(".carrito-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("active");
    }
}

// 7. INICIALIZACIÓN SEGURA: Espera a que cargue todo el documento del navegador antes de renderizar la primera vista
document.addEventListener("DOMContentLoaded", () => {
    actualizarVistaCarrito();
});