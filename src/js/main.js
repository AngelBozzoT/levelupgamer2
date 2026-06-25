/* ==========================================================================
   src/js/main.js
   Lógica general del sitio: render de destacados en Home, menú activo
   y menú hamburguesa responsivo.
   La lógica de carrito vive exclusivamente en cart.js (única fuente de
   verdad para evitar inconsistencias entre páginas).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar el catálogo dinámico de productos destacados (solo Home)
    renderizarProductosDestacados();

    // 2. Gestionar la clase activa del menú de navegación automáticamente
    gestionarMenuActivo();

    // 3. Inicializar el Menú Responsivo Hamburguesa
    inicializarMenuHamburguesa();
});

/**
 * Renderiza dinámicamente en la grilla principal solo los productos marcados como destacados.
 * El clic en "Ver Detalles" navega a la página de detalle del producto (no usa modal),
 * y "Añadir" usa el motor único de carrito (cart.js).
 */
function renderizarProductosDestacados() {
    const contenedorGrid = document.getElementById("productos-destacados");
    const productos = window.catalogoHardware;

    // Blindaje: Validar que el contenedor exista en la página (Index) y que los datos estén cargados
    if (!contenedorGrid || !productos) return;

    // Limpiar el mensaje de "Cargando catálogo..."
    contenedorGrid.innerHTML = "";

    // Filtrar los productos para mostrar solo los que tengan destacado: true
    const productosDestacados = productos.filter(p => p.destacado);

    if (productosDestacados.length === 0) {
        contenedorGrid.innerHTML = `<p class="loading-text">No hay productos destacados disponibles en este momento.</p>`;
        return;
    }

    // Construir e inyectar dinámicamente las tarjetas de hardware
    productosDestacados.forEach(prod => {
        const tarjetaHTML = `
            <div class="product-card" data-codigo="${prod.codigo}">
                <div class="product-img-container" style="cursor:pointer;" onclick="window.location.href='src/components/producto-detalle.html?codigo=${prod.codigo}'">
                    <img src="${prod.imagen}" alt="${prod.titulo}" class="product-img" onerror="this.src='https://via.placeholder.com/250x200?text=Hardware+Image'">
                </div>
                <div class="product-info">
                    <span class="product-tag">${prod.categoria.toUpperCase()}</span>
                    <h4 style="cursor:pointer;" onclick="window.location.href='src/components/producto-detalle.html?codigo=${prod.codigo}'">${prod.titulo}</h4>
                    <p class="product-price">${prod.precio}</p>
                    <div class="product-actions">
                        <button class="btn-secondary" onclick="window.location.href='src/components/producto-detalle.html?codigo=${prod.codigo}'">
                            Ver Detalles
                        </button>
                        <button class="btn-primary" onclick="agregarAlCarrito('${prod.codigo}')">
                            🛒 Añadir
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorGrid.innerHTML += tarjetaHTML;
    });
}

/**
 * Valida la URL actual de forma genérica para asegurar que el enlace del menú
 * correspondiente tenga la propiedad visual activa de iluminación neón.
 */
function gestionarMenuActivo() {
    // Obtener el nombre del archivo actual desde la URL (Ej: "productos.html" o "" para index)
    const rutaActual = window.location.pathname;
    let nombreArchivo = rutaActual.substring(rutaActual.lastIndexOf('/') + 1);

    // Las páginas de detalle (producto o blog) deben resaltar la pestaña "padre" del menú
    if (nombreArchivo.startsWith("producto-detalle")) {
        nombreArchivo = "productos.html";
    } else if (nombreArchivo.startsWith("blog-detalle")) {
        nombreArchivo = "blogs.html";
    }

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
