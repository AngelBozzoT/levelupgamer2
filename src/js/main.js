/* ==========================================================================
   src/js/main.js
   Lógica general del sitio: render de destacados en Home, menú activo
   y menú hamburguesa responsivo.
   La lógica de carrito vive exclusivamente en cart.js (única fuente de
   verdad para evitar inconsistencias entre páginas).
   ========================================================================== */
// ==========================================================================
// MODO DESARROLLO: Bypass temporal controlado de Administrador
// ==========================================================================
// Agregamos una bandera ('logout_manual') para saber si el usuario cerró sesión a propósito
if (!localStorage.getItem("isAdmin") && !localStorage.getItem("logout_manual")) {
    localStorage.setItem("isAdmin", "true"); 
    console.log("Modo desarrollo: Bypass de administrador activado automáticamente.");
}
// ==========================================================================
// INICIALIZACIÓN GENERAL DEL SITIO
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    // 1. Ejecutar configuraciones de interfaz básicas
    renderizarProductosDestacados();
    gestionarMenuActivo();
    inicializarMenuHamburguesa();
    
    // 2. Controlar la barra de navegación dinámicamente si es administrador
    verificarEstadoAdmin();
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
                    <img src="${prod.imagen}" alt="${prod.nombre || prod.titulo}" class="product-img" onerror="this.src='https://via.placeholder.com/250x200?text=Hardware+Image'">
                </div>
                <div class="product-info">
                    <span class="product-tag">${prod.categoria.toUpperCase()}</span>
                    <h4 style="cursor:pointer;" onclick="window.location.href='src/components/producto-detalle.html?codigo=${prod.codigo}'">${prod.nombre || prod.titulo}</h4>
                    <p class="product-price">$${prod.precio.toLocaleString('es-CL')}</p>
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
    const rutaActual = window.location.pathname;
    let nombreArchivo = rutaActual.substring(rutaActual.lastIndexOf('/') + 1);

    if (nombreArchivo.startsWith("producto-detalle")) {
        nombreArchivo = "productos.html";
    } else if (nombreArchivo.startsWith("blog-detalle")) {
        nombreArchivo = "blogs.html";
    }

    const enlacesNav = document.querySelectorAll(".nav-menu .btn-nav");

    enlacesNav.forEach(enlace => {
        enlace.classList.remove("active");
        const hrefAtributo = enlace.getAttribute("href");

        if (hrefAtributo) {
            if ((nombreArchivo === "" || nombreArchivo === "index.html") && hrefAtributo.includes("index.html")) {
                enlace.classList.add("active");
            }
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

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

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
 * Gestiona el menú dinámico inyectando el Panel de Administración de forma limpia
 * y removiendo los botones estáticos sobrantes sin duplicar elementos.
 */
function verificarEstadoAdmin() {
    const loginGuardado = localStorage.getItem("isAdmin");
    const isAdmin = loginGuardado === "true";
    const navMenu = document.getElementById("nav-menu");
    const profileContainer = document.getElementById("user-profile-container");

    if (!navMenu) return;

    // 1. Limpieza total preventiva de botones dinámicos antiguos o duplicados
    const existentes = document.querySelectorAll(".admin-dinamico, #user-profile-container");
    existentes.forEach(el => {
        if (el.id !== "user-profile-container") el.remove();
    });

    if (isAdmin) {
        // 2. Remover limpiamente los accesos estáticos de Login/Registro mientras sea Admin
        const btnSignup = navMenu.querySelector(".btn-nav.signup");
        const btnLogin = navMenu.querySelector("a[href*='login.html']");
        if (btnSignup) btnSignup.remove();
        if (btnLogin) btnLogin.remove();

        // Si por alguna razón el contenedor no existe en el HTML, lo creamos dinámicamente al final
        let targetContainer = profileContainer;
        if (!targetContainer) {
            targetContainer = document.createElement("div");
            targetContainer.id = "user-profile-container";
            navMenu.appendChild(targetContainer);
        }

        // 3. CÁLCULO INTELIGENTE DE PROFUNDIDAD DE RUTAS
        const pathname = window.location.pathname;
        let prefijo = "";

        // Evaluamos en qué carpeta se encuentra el usuario actualmente
        if (pathname.includes("/components/")) {
            prefijo = "../"; // Sube un nivel para salir de components/
        } else if (pathname.includes("/admin/")) {
            prefijo = "../"; // Sube un nivel para salir de admin/
        }

        // Construcción de los enlaces estables
        const urlPanelReal = prefijo + "admin/panel.html";
        const urlHomeDestino = prefijo ? prefijo + "../index.html" : "index.html";

        // Forzar estilos de posicionamiento en el contenedor del avatar
        targetContainer.style.position = "relative";
        targetContainer.style.display = "inline-block";
        targetContainer.className = "admin-dinamico";

        // 4. Inyección del Dropdown Sutil
        targetContainer.innerHTML = `
            <div class="profile-trigger" id="profile-trigger" style="cursor:pointer; font-size: 1.4rem; padding: 5px 10px; display: flex; align-items: center; user-select: none;">
                👤
            </div>
            <div class="dropdown-menu-card" id="dropdown-menu-card" style="display: none; position: absolute; right: 0; top: 45px; background: #111; border: 1px solid #333; padding: 15px; border-radius: 4px; z-index: 9999; min-width: 220px; box-shadow: 0 4px 15px rgba(0,0,0,0.8); text-align: left;">
                <div style="border-bottom: 1px solid #222; padding-bottom: 8px; margin-bottom: 10px;">
                    <strong style="color: #fff; display: block; font-size: 0.95rem; font-family: sans-serif;">Admin Level-Up</strong>
                    <span style="color: #666; font-size: 0.8rem; font-family: sans-serif;">admin@levelupgamer.cl</span>
                </div>
                <a href="${urlPanelReal}" style="display: block; color: #fff; text-decoration: none; padding: 8px 0; font-size: 0.9rem; font-family: sans-serif; transition: 0.2s;" onmouseover="this.style.color='#10ff5a'" onmouseout="this.style.color='#fff'">
                    🛡️ Admin Dashboard
                </a>
                <a href="#" id="btn-logout-dropdown" style="display: block; color: #ff4a4a; text-decoration: none; padding: 8px 0; margin-top: 5px; font-size: 0.9rem; font-family: sans-serif; border-top: 1px solid #222;">
                    ↪️ Cerrar sesión
                </a>
            </div>
        `;

        // 5. Gestión de eventos del Dropdown (Abrir / Cerrar)
        const trigger = document.getElementById("profile-trigger");
        const card = document.getElementById("dropdown-menu-card");
        
        if (trigger && card) {
            trigger.addEventListener("click", function (e) {
                e.stopPropagation();
                card.style.display = card.style.display === "none" ? "block" : "none";
            });

            document.addEventListener("click", function () {
                card.style.display = "none";
            });
        }

        // 6. Lógica operativa del botón de Cerrar Sesión del Dropdown
        const logoutBtn = document.getElementById("btn-logout-dropdown");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.removeItem("isAdmin");
                localStorage.setItem("logout_manual", "true");
                alert("Sesión de administrador finalizada.");
                
                // Redirección controlada al Home
                if (pathname.includes("/components/") || pathname.includes("/admin/")) {
                    window.location.href = "../index.html";
                } else {
                    window.location.href = "index.html";
                }
            });
        }
    }
}