/* ==========================================================================
   src/js/cart.js
   Motor ÚNICO del carrito de compras - Level-Up Gamer
   Todas las páginas (Home, Productos, Detalle de Producto, Carrito) usan
   este mismo archivo para que el carrito se mantenga sincronizado en
   cualquier vista, persistiendo en localStorage.
   ========================================================================== */

const CART_STORAGE_KEY = "levelup_carrito";

/**
 * Devuelve el carrito actual guardado en localStorage.
 * Estructura: [{ codigo, cantidad }, ...]
 */
function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

/**
 * Guarda el carrito en localStorage y refresca toda la interfaz relacionada
 * (contador del navbar y, si corresponde, la vista completa de la página carrito.html)
 */
function guardarCarrito(carrito) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    actualizarContadorNav();
    if (document.getElementById("cart-items-page-list")) {
        renderizarPaginaCarrito();
    }
}

/**
 * Busca la info completa (nombre, precio, imagen) de un producto dentro
 * del catálogo oficial (definido en productos.js -> window.catalogoHardware)
 */
function buscarProductoPorCodigo(codigo) {
    const catalogo = window.catalogoHardware || [];
    return catalogo.find(p => p.codigo === codigo);
}

/**
 * Añade una unidad (o "cantidad" unidades) de un producto al carrito.
 * Si ya existe, solo incrementa la cantidad.
 */
function agregarAlCarrito(codigo, cantidad = 1) {
    const producto = buscarProductoPorCodigo(codigo);
    if (!producto) {
        console.warn(`Producto con código ${codigo} no encontrado en el catálogo.`);
        return;
    }

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.codigo === codigo);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ codigo: codigo, cantidad: cantidad });
    }

    guardarCarrito(carrito);
    mostrarConfirmacionAgregado(producto.titulo);
}

/**
 * Disminuye en 1 la cantidad de un producto. Si llega a 0, lo elimina.
 */
function disminuirCantidad(codigo) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.codigo === codigo);
    if (!item) return;

    item.cantidad--;
    const carritoFiltrado = item.cantidad <= 0
        ? carrito.filter(i => i.codigo !== codigo)
        : carrito;

    guardarCarrito(carritoFiltrado);
}

/**
 * Aumenta en 1 la cantidad de un producto ya existente en el carrito.
 */
function aumentarCantidad(codigo) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.codigo === codigo);
    if (!item) return;

    item.cantidad++;
    guardarCarrito(carrito);
}

/**
 * Elimina por completo un producto del carrito, sin importar su cantidad.
 */
function eliminarDelCarrito(codigo) {
    const carrito = obtenerCarrito().filter(item => item.codigo !== codigo);
    guardarCarrito(carrito);
}

/**
 * Vacía completamente el carrito de compras.
 */
function vaciarCarrito() {
    guardarCarrito([]);
}

/**
 * Calcula la cantidad total de unidades en el carrito (para el contador del navbar).
 */
function calcularCantidadTotal() {
    return obtenerCarrito().reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

/**
 * Calcula el precio total del carrito en pesos chilenos (número).
 */
function calcularPrecioTotal() {
    return obtenerCarrito().reduce((acumulado, item) => {
        const producto = buscarProductoPorCodigo(item.codigo);
        if (!producto) return acumulado;
        return acumulado + (producto.precioNumerico * item.cantidad);
    }, 0);
}

/**
 * Formatea un número como precio chileno: $29.990
 */
function formatearPrecioCLP(numero) {
    return "$" + Math.round(numero).toLocaleString("es-CL");
}

/**
 * Actualiza el número del carrito en TODOS los íconos 🛒 del navbar,
 * sin importar en qué página estemos.
 */
function actualizarContadorNav() {
    const totalUnidades = calcularCantidadTotal();
    document.querySelectorAll("#cart-count").forEach(el => {
        el.textContent = totalUnidades;
    });
}

/**
 * Pequeña confirmación visual no intrusiva al añadir un producto.
 * Si no se desea, basta con no llamarla (el carrito seguirá funcionando igual).
 */
function mostrarConfirmacionAgregado(nombreProducto) {
    const existente = document.getElementById("toast-carrito");
    if (existente) existente.remove();

    const toast = document.createElement("div");
    toast.id = "toast-carrito";
    toast.textContent = `✅ ${nombreProducto} añadido al carrito`;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#101026";
    toast.style.color = "#39FF14";
    toast.style.border = "1px solid #39FF14";
    toast.style.borderRadius = "6px";
    toast.style.padding = "12px 18px";
    toast.style.fontFamily = "var(--fuente-cuerpo), sans-serif";
    toast.style.fontSize = "0.9rem";
    toast.style.boxShadow = "0 0 15px rgba(57,255,20,0.3)";
    toast.style.zIndex = "9999";
    toast.style.transition = "opacity 0.4s ease";
    document.body.appendChild(toast);

    setTimeout(() => { toast.style.opacity = "0"; }, 1800);
    setTimeout(() => { toast.remove(); }, 2300);
}

/**
 * Dibuja por completo la vista de la página carrito.html: listado de items,
 * subtotal, total y mensaje de carrito vacío.
 */
function renderizarPaginaCarrito() {
    const contenedorListado = document.getElementById("cart-items-page-list");
    const mensajeVacio = document.getElementById("cart-vacio");
    const txtCantidadTotal = document.getElementById("total-articulos");
    const txtSubtotal = document.getElementById("subtotal-precio");
    const txtTotal = document.getElementById("precio-total");

    if (!contenedorListado) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedorListado.innerHTML = "";
        contenedorListado.style.display = "none";
        if (mensajeVacio) mensajeVacio.style.display = "block";
        if (txtCantidadTotal) txtCantidadTotal.textContent = "0";
        if (txtSubtotal) txtSubtotal.textContent = "$0";
        if (txtTotal) txtTotal.textContent = "$0";
        return;
    }

    contenedorListado.style.display = "block";
    if (mensajeVacio) mensajeVacio.style.display = "none";
    contenedorListado.innerHTML = "";

    let cantidadAcumulada = 0;

    carrito.forEach(item => {
        const producto = buscarProductoPorCodigo(item.codigo);
        if (!producto) return;

        cantidadAcumulada += item.cantidad;
        const subtotalItem = producto.precioNumerico * item.cantidad;

        const fila = document.createElement("div");
        fila.className = "cart-page-item";
        fila.innerHTML = `
            <div class="cart-item-preview">
                <img src="${producto.imagen}" alt="${producto.titulo}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;" onerror="this.style.display='none'">
            </div>
            <div class="cart-item-details" style="flex-grow: 1; margin-left: 20px;">
                <h3 style="margin:0 0 8px 0;">
                    <a href="producto-detalle.html?codigo=${producto.codigo}" style="color:#fff; text-decoration:none;">${producto.titulo}</a>
                </h3>
                <p style="color: #00bfff; font-weight: bold; margin:0;">${formatearPrecioCLP(producto.precioNumerico)} c/u</p>
            </div>
            <div class="cart-page-controls">
                <button class="qty-btn" aria-label="Restar" onclick="disminuirCantidad('${producto.codigo}')">-</button>
                <span style="min-width:20px; text-align:center;">${item.cantidad}</span>
                <button class="qty-btn" aria-label="Sumar" onclick="aumentarCantidad('${producto.codigo}')">+</button>
                <button class="qty-btn" aria-label="Eliminar" title="Eliminar producto" onclick="eliminarDelCarrito('${producto.codigo}')" style="border-color:#ff3333; color:#ff3333;">✕</button>
            </div>
            <div style="min-width:110px; text-align:right; font-weight:bold;">
                ${formatearPrecioCLP(subtotalItem)}
            </div>
        `;
        contenedorListado.appendChild(fila);
    });

    const totalGeneral = calcularPrecioTotal();
    if (txtCantidadTotal) txtCantidadTotal.textContent = cantidadAcumulada;
    if (txtSubtotal) txtSubtotal.textContent = formatearPrecioCLP(totalGeneral);
    if (txtTotal) txtTotal.textContent = formatearPrecioCLP(totalGeneral);
}

/**
 * Simula el proceso de "pago" final y vacía el carrito.
 */
function finalizarPedido() {
    if (obtenerCarrito().length === 0) {
        alert("Tu carrito está vacío. Añade productos antes de continuar.");
        return;
    }
    alert("🚀 ¡Compra procesada con éxito! Tu pedido de Level-Up Gamer se está preparando.");
    vaciarCarrito();
}

// Al cargar cualquier página: sincronizar el contador del navbar y,
// si corresponde, dibujar la vista completa del carrito.
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorNav();
    if (document.getElementById("cart-items-page-list")) {
        renderizarPaginaCarrito();
    }
});
