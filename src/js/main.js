/* ==========================================================================
   Lógica General e Interactividad Global - Level-Up Gamer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar el estado del carrito de compras local
    inicializarCarrito();

    // 2. Gestionar la clase activa del menú de navegación automáticamente
    gestionarMenuActivo();

    // 3. Inicializar el Menú Responsivo Hamburguesa (Unificado de forma segura)
    inicializarMenuHamburguesa();
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

    // Selector actualizado a ".nav-menu .btn-nav" para que coincida perfectamente con tu HTML
    const enlacesNav = document.querySelectorAll(".nav-menu .btn-nav");

    enlacesNav.forEach(enlace => {
        // Remover cualquier clase active previa para evitar duplicados indeseados
        enlace.classList.remove("active");

        // Obtener el atributo href del enlace del menú
        const hrefAtributo = enlace.getAttribute("href");

        if (hrefAtributo) {
            // Caso especial para la página de inicio (index.html o raíz "/")
            if ((nombreArchivo === "" || nombreArchivo === "index.html") && hrefAtributo.includes("index.html")) {
                enlace.classList.add("active");
            } 
            // Para las demás páginas de la carpeta de componentes
            else if (nombreArchivo !== "" && hrefAtributo.includes(nombreArchivo)) {
                enlace.classList.add("active");
            }
        }
    });
}

/**
 * Inicializa y gestiona la interactividad del menú de hamburguesa de forma segura.
 */
function inicializarMenuHamburguesa() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Blindaje: Solo opera si los elementos existen en la página actual
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            // Alterna la clase active para deslizar el menú desde la derecha
            navMenu.classList.toggle('active');
            // Alterna la clase open para transformar las barras en una 'X'
            menuToggle.classList.toggle('open');
        });

        // Cerrar el menú si se hace clic en cualquier enlace
        const navLinks = navMenu.querySelectorAll('.btn-nav');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }
}

/**
 * Función global para añadir productos al carrito usando su código oficial.
 * @param {string} codigoProducto - El código único (Ej: 'JM001', 'AC001')
 */
window.agregarAlCarritoSimulado = function(codigoProducto) {
    // 1. Obtener el estado actual del carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito_items")) || {};

    // 2. Incrementar la cantidad del producto seleccionado o inicializarlo en 1
    if (carrito[codigoProducto]) {
        carrito[codigoProducto]++;
    } else {
        carrito[codigoProducto] = 1; // CORREGIDO: Se eliminó la variable inexistente 'carritoProducto'
    }

    // 3. Guardar el objeto actualizado en localStorage
    localStorage.setItem("carrito_items", JSON.stringify(carrito));

    // 4. Calcular el total de productos acumulados para actualizar el Navbar
    let cantidadTotal = Object.values(carrito).reduce((a, b) => a + b, 0);
    localStorage.setItem("cart_quantity", cantidadTotal);

    // 5. Actualizar visualmente los contadores en la página de forma precisa
    const contadores = document.querySelectorAll("#cart-count");
    contadores.forEach(contador => {
        contador.textContent = cantidadTotal;
    });

    console.log(`Producto ${codigoProducto} añadido. Carrito actual:`, carrito);
};

/**
 * Abre la ventana modal cargando dinámicamente los detalles del producto presionado.
 */
window.abrirDetalle = function(codigo, titulo, descripcion, imagenUrl, precio) {
    // CORREGIDO: Coincidir con el ID real 'product-modal' u 'modal-overlay' usado comúnmente
    const modal = document.getElementById("product-modal") || document.querySelector(".modal-overlay");
    
    // Blindaje: Verificar que la modal exista en la página antes de rellenar sus datos
    if (modal) {
        const titleEl = document.getElementById("modal-title");
        const descEl = document.getElementById("modal-desc");
        const imgEl = document.getElementById("modal-img");
        const priceEl = document.getElementById("modal-price");
        const btnAdd = document.getElementById("modal-btn-add");

        if (titleEl) titleEl.textContent = titulo;
        if (descEl) descEl.textContent = descripcion;
        if (imgEl) {
            imgEl.src = imagenUrl;
            imgEl.alt = titulo;
        }
        if (priceEl) priceEl.textContent = precio;
        
        // Asignar el evento correcto de forma segura si el botón de añadir existe
        if (btnAdd) {
            btnAdd.onclick = () => {
                window.agregarAlCarritoSimulado(codigo);
            };
        }

        modal.style.display = "flex";
    }
};

/**
 * Cierra la ventana modal de detalles.
 */
window.cerrarDetalle = function() {
    const modal = document.getElementById("product-modal") || document.querySelector(".modal-overlay");
    if (modal) {
        modal.style.display = "none";
    }
};

// Cerrar también si el usuario hace clic afuera de la caja central (overlay translúcido)
window.addEventListener("click", (e) => {
    const modal = document.getElementById("product-modal") || document.querySelector(".modal-overlay");
    if (modal && e.target === modal) {
        modal.style.display = "none";
    }
});