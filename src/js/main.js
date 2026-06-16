/* ==========================================================================
   Lógica General e Interactividad Global - Level-Up Gamer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar el estado del carrito de compras local
    inicializarCarrito();

    // 2. Gestionar la clase activa del menú de navegación automáticamente
    gestionarMenuActivo();
});

/**
 * Controla el widget del carrito de compras simulando la persistencia local.
 */
function inicializarCarrito() {
    const cartCountElement = document.getElementById("cart-count");
    
    // Intentar recuperar la cantidad de productos desde el almacenamiento local (localStorage)
    // Si no existe, por defecto será 0.
    let cantidadProductos = localStorage.getItem("cart_quantity") || 0;

    // Si el elemento existe en el Navbar actual, actualizar su número
    if (cartCountElement) {
        cartCountElement.textContent = cantidadProductos;
    }
}

/**
 * Valida la URL actual de forma genérica para asegurar que el enlace del menú
 * correspondiente tenga la propiedad visual activa de iluminación neón.
 */
function gestionarMenuActivo() {
    // Obtener el nombre del archivo actual desde la URL (Ej: "productos.html" o "" para index)
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.substring(rutaActual.lastIndexOf('/') + 1);

    // Seleccionar todos los enlaces de la barra de navegación
    const enlacesNav = document.querySelectorAll(".nav-links a");

    enlacesNav.forEach(enlace => {
        // Remover cualquier clase active previa para evitar duplicados indeseados
        enlace.classList.remove("active");

        // Obtener el atributo href del enlace del menú
        const hrefAtributo = enlace.getAttribute("href");

        // Caso especial para la página de inicio (index.html o raíz "/")
        if ((nombreArchivo === "" || nombreArchivo === "index.html") && hrefAtributo.includes("index.html")) {
            enlace.classList.add("active");
        } 
        // Para las demás páginas de la carpeta de componentes
        else if (nombreArchivo !== "" && hrefAtributo.includes(nombreArchivo)) {
            enlace.classList.add("active");
        }
    });
}

/**
 * Función global y reutilizable para simular la adición de productos al carrito
 * desde el catálogo (será usada más adelante).
 */
window.agregarAlCarritoSimulado = function() {
    let cantidadActual = parseInt(localStorage.getItem("cart_quantity") || 0);
    cantidadActual++;
    
    // Guardar el nuevo estado localmente
    localStorage.setItem("cart_quantity", cantidadActual);

    // Actualizar todos los contadores visuales que se encuentren en la página actual
    const contadores = document.querySelectorAll("#cart-count, .cart-widget span:last-child");
    contadores.forEach(contador => {
        contador.textContent = cantidadActual;
    });
};