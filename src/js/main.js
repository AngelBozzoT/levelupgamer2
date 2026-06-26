
// ==========================================================================
// CONTROL DE ARRANQUE DE PESTAÑA (Persistencia en navegación activa)
// ==========================================================================
// sessionStorage se borra AUTOMÁTICAMENTE al cerrar la pestaña/navegador.
// Si no existe "pestana_inicializada", significa que el usuario abrió el sitio desde cero.
if (!sessionStorage.getItem("pestana_inicializada")) {
    // Solo limpiamos si es una pestaña completamente nueva (evita arrastrar basura del escritorio)
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("usuarioActivo");
    
    // Marcamos esta pestaña como inicializada para que NO borre nada al navegar entre páginas o ir al Home
    sessionStorage.setItem("pestana_inicializada", "true");
}
// ==========================================================================
// INICIALIZACIÓN GENERAL DEL SITIO
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    renderizarProductosDestacados();
    gestionarMenuActivo();
    inicializarMenuHamburguesa();
    
    // Controlar de forma unificada el estado de la barra de navegación
    verificarEstadoSesionNav();
});

/**
 * Renderiza dinámicamente en la grilla principal solo los productos marcados como destacados.
 */
function renderizarProductosDestacados() {
    const contenedorGrid = document.getElementById("productos-destacados");
    const productos = window.catalogoHardware;

    if (!contenedorGrid || !productos) return;
    contenedorGrid.innerHTML = "";

    const productosDestacados = productos.filter(p => p.destacado);

    if (productosDestacados.length === 0) {
        contenedorGrid.innerHTML = `<p class="loading-text">No hay productos destacados disponibles en este momento.</p>`;
        return;
    }

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
 * Gestiona el estado activo de iluminación neón en los enlaces del menú.
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
 * Inicializa y gestiona la interactividad del menú de hamburguesa en móviles.
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
 * MOTOR UNIFICADO DE INTERFAZ: Inyecta visuales idénticas para sesiones activas.
 */
function verificarEstadoSesionNav() {
    const navMenu = document.getElementById("nav-menu");
    const container = document.getElementById("user-profile-container");
    
    const btnSignup = document.querySelector(".btn-nav.signup");
    const btnLogin = document.querySelector(".btn-nav[href*='login.html']");

    if (!navMenu || !container) return;

    // Leer estados desde el localStorage
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioActivo"));

    // --- CASO A: ADMINISTRADOR LOGUEADO ---
// --- CASO A: ADMINISTRADOR LOGUEADO ---
     if (isAdmin) {
        if (btnSignup) btnSignup.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";

        container.style.display = "inline-block";
        container.style.position = "relative";
        
        // CORRECCIÓN: Limpiar el contenedor antes de reescribir para eliminar textos planos anteriores
        container.innerHTML = ""; 
        
        // Inyectamos el botón con diseño de avatar e interactividad completa
        container.innerHTML = `
            <div class="user-profile-status" id="profile-trigger" style="cursor:pointer; display: flex; align-items: center; gap: 12px; font-family: var(--fuente-titulos), sans-serif; font-size: 0.85rem; user-select: none;">
                <span class="user-welcome" style="color: #fff;">
                    👑 <span style="color: #10ff5a; font-weight: bold;">ADMINISTRADOR</span>
                </span>
                <span class="badge-duoc" style="background: #10ff5a; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; box-shadow: 0 0 8px #10ff5a;">ROOT</span>
            </div>
            
            <div class="dropdown-menu-card" id="dropdown-menu-card" style="display: none; position: absolute; right: 0; top: 40px; background: #0b0b0e; border: 1px solid #1e90ff; padding: 15px; border-radius: 6px; z-index: 9999; min-width: 220px; box-shadow: 0 4px 20px rgba(0,191,255,0.4); text-align: left;">
                <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 10px;">
                    <strong style="color: #fff; display: block; font-size: 0.9rem;">Soporte Técnico</strong>
                    <span style="color: #888; font-size: 0.75rem;">admin@inacap.cl</span>
                </div>
                <a href="${obtenerPrefijoRuta()}admin/panel.html" style="display: block; color: #fff; text-decoration: none; padding: 8px 0; font-size: 0.85rem; transition: 0.2s;" onmouseover="this.style.color='#00bfff'" onmouseout="this.style.color='#fff'">
                    📊 Ir al Dashboard
                </a>
                <a href="#" id="btn-logout-dropdown" style="display: block; color: #ff3333; text-decoration: none; padding: 8px 0; margin-top: 5px; font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    ↪️ Cerrar Sesión
                </a>
            </div>
        `;
        // ... (el resto del código de listeners del dropdown de abajo queda exactamente igual)

        // LISTENER SEGURO MEDIANTE DELEGACIÓN DINÁMICA
        const trigger = document.getElementById("profile-trigger");
        const card = document.getElementById("dropdown-menu-card");

        if (trigger && card) {
            trigger.onclick = function (e) {
                e.stopPropagation();
                card.style.display = card.style.display === "none" ? "block" : "none";
            };
            
            document.addEventListener("click", () => {
                if (card) card.style.display = "none";
            });
        }

        const logoutBtn = document.getElementById("btn-logout-dropdown");
        if (logoutBtn) {
            logoutBtn.onclick = function (e) {
                e.preventDefault();
                localStorage.removeItem("isAdmin");
                localStorage.setItem("logout_manual", "true");
                alert("Sesión de administrador finalizada.");
                redirigirAHome();
            };
        }
    } 
    // --- CASO B: USUARIO NORMAL LOGUEADO (Ej: Cliente / Alumno) ---
    else if (usuarioLogueado) {
        if (btnSignup) btnSignup.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";

        container.style.display = "inline-block";
        container.innerHTML = `
            <div class="user-profile-status" style="display: flex; align-items: center; gap: 12px; font-family: var(--fuente-titulos), sans-serif; font-size: 0.85rem;">
                <span class="user-welcome" style="color: #fff;">
                    👾 <span style="color: #00bfff; font-weight: bold;">${usuarioLogueado.nombre.toUpperCase()}</span>
                </span>
                ${usuarioLogueado.aplicaDescuentoEspecial ? '<span class="badge-duoc" style="background: #39FF14; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; box-shadow: 0 0 8px #39FF14;">DUOC 20%</span>' : ''}
                <button id="btn-cerrar-cesion" onclick="cerrarSesionPlataforma()" class="btn-nav" style="border-color: #ff3333; color: #ff3333; cursor: pointer; padding: 4px 10px; font-size:0.75rem;">
                    Salir
                </button>
            </div>
        `;
    } 
    // --- CASO C: VISITANTE GENERAL ---
    else {
        if (btnSignup) btnSignup.style.display = "inline-block";
        if (btnLogin) btnLogin.style.display = "inline-block";
        container.innerHTML = "";
    }
}

/**
 * Calcula dinámicamente cuántas carpetas debe subir para encontrar la raíz de administración.
 */
function obtenerPrefijoRuta() {
    const pathname = window.location.pathname;
    if (pathname.includes("/components/") || pathname.includes("/admin/")) {
        return "../";
    }
    return "src/";
}

/**
 * Ejecuta una redirección controlada al index principal.
 */
function redirigirAHome() {
    const pathname = window.location.pathname;
    if (pathname.includes("/components/") || pathname.includes("/admin/")) {
        window.location.href = "../index.html";
    } else {
        window.location.href = "index.html";
    }
}

/**
 * Cierra la sesión activa del usuario regular.
 */
function cerrarSesionPlataforma() {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("logout_manual");
    alert("Sesión cerrada correctamente. ¡Vuelve pronto!");
    redirigirAHome();
}