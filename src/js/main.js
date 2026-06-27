/* ==========================================================================
   src/js/main.js
   Controlador Global y Central de la Plataforma - Level-Up Gamer
   ========================================================================== */

// ==========================================================================
// CONTROL DE ARRANQUE DE PESTAÑA (Persistencia en navegación activa corregida)
// ==========================================================================
try {
    if (!sessionStorage.getItem("pestana_inicializada")) {
        if (localStorage.getItem("isAdmin") !== "true") {
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("usuarioActivo");
        }
        sessionStorage.setItem("pestana_inicializada", "true");
    }
} catch (error) {
    console.error("Error en inicialización de pestaña:", error);
}

// ==========================================================================
// CONFIGURACIÓN DINÁMICA DEL ID DE RESEÑAS SEGÚN LA RUTA
// ==========================================================================
function obtenerIdentificadorReseñas() {
    try {
        const params = new URLSearchParams(window.location.search);
        const codigoProducto = params.get("codigo");
        
        if (codigoProducto) {
            return `reseñas_prod_${codigoProducto}`;
        } else if (window.location.pathname.includes("blog-detalle")) {
            return "reseñas_blog_pc_gamer";
        }
    } catch (e) {
        console.error("Error al obtener ID de reseñas:", e);
    }
    return "reseñas_general";
}

// ==========================================================================
// INICIALIZACIÓN GENERAL DEL SITIO (Aislada contra fallos)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    try { renderizarProductosDestacados(); } catch(e) { console.error("Error en destacados:", e); }
    try { gestionarMenuActivo(); } catch(e) { console.error("Error en menú activo:", e); }
    try { inicializarMenuHamburguesa(); } catch(e) { console.error("Error en menú hamburguesa:", e); }
    try { verificarEstadoSesionNav(); } catch(e) { console.error("Error en sesión nav:", e); }
    try { cargarReseñasExistentes(); } catch(e) { console.error("Error al cargar reseñas:", e); }
    try { renderizarFooterGlobal(); } catch(e) { console.error("Error en footer:", e); }
});

/**
 * RENDERIZAR PRODUCTOS DESTACADOS
 */
function renderizarProductosDestacados() {
    const contenedorGrid = document.getElementById("productos-destacados");
    const productos = window.catalogoHardware;

    if (!contenedorGrid || !productos) return;
    contenedorGrid.innerHTML = "";

    const productosDestacados = productos.filter(p => p.destacado);
    if (productosDestacados.length === 0) return;

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
                        <button class="btn-secondary" onclick="window.location.href='src/components/producto-detalle.html?codigo=${prod.codigo}'">Ver Detalles</button>
                        <button class="btn-primary" onclick="agregarAlCarrito('${prod.codigo}')">🛒 Añadir</button>
                    </div>
                </div>
            </div>
        `;
        contenedorGrid.innerHTML += tarjetaHTML;
    });
}

/**
 * GESTIONAR MENÚ ACTIVO
 */
function gestionarMenuActivo() {
    const rutaActual = window.location.pathname;
    let nombreArchivo = rutaActual.substring(rutaActual.lastIndexOf('/') + 1);

    if (nombreArchivo.startsWith("producto-detalle")) nombreArchivo = "productos.html";
    else if (nombreArchivo.startsWith("blog-detalle")) nombreArchivo = "blogs.html";

    const enlacesNav = document.querySelectorAll(".nav-menu .btn-nav");
     enlacesNav.forEach(enlace => {
        enlace.classList.remove("active");
        const hrefAtributo = enlace.getAttribute("href");
        if (hrefAtributo) {
            if ((nombreArchivo === "" || nombreArchivo === "index.html") && hrefAtributo.includes("index.html")) {
                enlace.classList.add("active");
            } else if (nombreArchivo !== "" && hrefAtributo.includes(nombreArchivo)) {
                enlace.classList.add("active");
            }
        }
    });
}

/**
 * MENÚ HAMBURGUESA
 */
function inicializarMenuHamburguesa() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });
}

/**
 * CONTROL DE SESIÓN UNIFICADO (Con soporte para Gamificación, Niveles y Puntos LevelUp)
 */
function verificarEstadoSesionNav() {
    const navMenu = document.getElementById("nav-menu");
    const container = document.getElementById("user-profile-container");
    if (!navMenu || !container) return;
    
    // Forzamos limpieza inicial para evitar duplicación de ventanas
    container.innerHTML = "";

    const btnSignup = document.querySelector(".btn-nav.signup");
    const btnLogin = document.querySelector(".btn-nav[href*='login.html']");

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    let usuarioLogueado = null;
    
    try {
        const datosUser = localStorage.getItem("usuarioActivo");
        if (datosUser) usuarioLogueado = JSON.parse(datosUser);
    } catch(e) {
        console.error("Error al parsear el usuario activo:", e);
    }

    if (isAdmin) {
        if (btnSignup) btnSignup.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";
        container.style.display = "inline-block";
        container.style.position = "relative";
        
        const prefijo = obtenerPrefijoRuta();
        const urlDashboard = window.location.pathname.includes("/components/") ? "../admin/panel.html" : `${prefijo}admin/panel.html`;

        container.innerHTML = `
            <div class="user-profile-status" id="profile-trigger" style="cursor:pointer; display: flex; align-items: center; gap: 12px; font-family: sans-serif; font-size: 0.85rem;">
                <span style="color: #fff; user-select: none;">👑 <span style="color: #10ff5a; font-weight: bold;">ADMINISTRADOR</span></span>
            </div>
            <div class="dropdown-menu-card" id="dropdown-menu-card" style="display: none; position: absolute; right: 0; top: 40px; background: #0b0b0e; border: 1px solid #1e90ff; padding: 15px; border-radius: 6px; z-index: 9999; min-width: 220px; text-align: left; box-shadow: 0 4px 15px rgba(30, 144, 255, 0.3);">
                <a href="${urlDashboard}" style="display: block; color: #1e90ff; text-decoration: none; padding: 8px 0; font-size: 0.85rem; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 5px;">📊 Panel Admin</a>
                <a href="#" id="btn-logout-dropdown" style="display: block; color: #ff3333; text-decoration: none; padding: 8px 0; font-size: 0.85rem;">↪️ Cerrar Sesión</a>
            </div>
        `;
        
        const trigger = document.getElementById("profile-trigger");
        const card = document.getElementById("dropdown-menu-card");
        if (trigger && card) {
            trigger.onclick = (e) => { 
                e.stopPropagation(); 
                card.style.display = card.style.display === "none" ? "block" : "none"; 
            };
            document.addEventListener("click", () => { card.style.display = "none"; });
        }
        
        const logoutBtn = document.getElementById("btn-logout-dropdown");
        if (logoutBtn) {
            logoutBtn.onclick = (e) => { 
                e.preventDefault(); 
                localStorage.removeItem("isAdmin"); 
                alert("Sesión finalizada."); 
                redirigirAHome(); 
            };
        }
    } 
    else if (usuarioLogueado && usuarioLogueado.nombre) {
        if (btnSignup) btnSignup.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";
        container.style.display = "inline-block";
        
        // --- CONTROL DE INSTITUCIONES ---
        let tagInstitucion = "";
        const correo = (usuarioLogueado.correo || usuarioLogueado.email || "").toLowerCase();
        if (correo.includes("duoc")) {
            tagInstitucion = ' <span style="color: #39FF14; font-size: 0.75rem; border: 1px solid #39FF14; padding: 2px 6px; border-radius: 4px; margin-left: 5px; font-weight: bold;">DUOC 20%</span>';
        } else if (correo.includes("inacap")) {
            tagInstitucion = ' <span style="color: #ff4500; font-size: 0.75rem; border: 1px solid #ff4500; padding: 2px 6px; border-radius: 4px; margin-left: 5px; font-weight: bold;">INACAP 12%</span>';
        }
        
        // --- CONTROL DE GAMIFICACIÓN ---
        const puntos = usuarioLogueado.puntosLevelUp !== undefined ? usuarioLogueado.puntosLevelUp : 150;
        const nivel = usuarioLogueado.nivelGamer || "Nivel 1 (Noob)";
        
        container.innerHTML = `
            <div class="user-profile-status" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; font-size: 0.85rem; font-family: sans-serif; padding-right: 5px;">
                <div style="display: flex; align-items: center; gap: 5px;">
                    <span style="color: #fff;">👾 <span style="color: #00bfff; font-weight: bold;">${usuarioLogueado.nombre.toUpperCase()}</span>${tagInstitucion}</span>
                    <button onclick="cerrarSesionPlataforma()" class="btn-nav" style="border-color: #ff3333; color: #ff3333; cursor: pointer; padding: 2px 8px; font-size:0.7rem; background:transparent; border-radius:4px; margin-left:5px;">Salir</button>
                </div>
                <div style="font-size: 0.75rem; color: #a4a4c1;">
                    <span>🏆 ${nivel}</span> | <span style="color: #ffff00; font-weight: bold;">⭐ ${puntos} Pts</span>
                </div>
            </div>
        `;
    }
    else {
        if (btnSignup) btnSignup.style.display = "inline-block";
        if (btnLogin) btnLogin.style.display = "inline-block";
        container.innerHTML = "";
    }
}

// ==========================================================================
// MOTOR DE RESEÑAS GLOBALIZADO
// ==========================================================================
window.guardarReseña = function (event) {
    try {
        event.preventDefault();

        const inputUser = document.getElementById("review-username");
        const inputStars = document.getElementById("review-stars");
        const inputComment = document.getElementById("review-comment");
        const contenedor = document.getElementById("reviews-container");

        if (!inputUser || !inputStars || !inputComment || !contenedor) return;

        const usuario = inputUser.value.trim();
        const estrellas = inputStars.value;
        const comentario = inputComment.value.trim();
        const fecha = "Hoy";

        if (!usuario || !comentario) return;

        const nuevaReseña = { usuario, estrellas, comentario, fecha };
        const storageId = obtenerIdentificadorReseñas();

        const reseñasActuales = JSON.parse(localStorage.getItem(storageId)) || [];
        reseñasActuales.push(nuevaReseña);
        localStorage.setItem(storageId, JSON.stringify(reseñasActuales));

        const tarjetaHTML = crearMoldeReseña(usuario, estrellas, comentario, fecha);
        contenedor.insertAdjacentHTML("beforeend", tarjetaHTML);

        document.getElementById("form-nueva-reseña").reset();
    } catch (error) {
        console.error("Error crítico al guardar la reseña:", error);
    }
};

function cargarReseñasExistentes() {
    const contenedor = document.getElementById("reviews-container");
    if (!contenedor) return;

    const storageId = obtenerIdentificadorReseñas();
    const reseñasGuardadas = JSON.parse(localStorage.getItem(storageId)) || [];
    
    contenedor.querySelectorAll(".review-card-dinamica").forEach(el => el.remove());
    
    reseñasGuardadas.forEach(review => {
        const tarjetaHTML = crearMoldeReseña(review.usuario, review.estrellas, review.comentario, review.fecha);
        contenedor.insertAdjacentHTML("beforeend", tarjetaHTML);
    });
}

function crearMoldeReseña(usuario, estrellas, comentario, fecha) {
    return `
        <div class="review-card review-card-dinamica">
            <div class="review-header">
                <div class="review-user">
                    <span class="review-avatar">👤</span>
                    <div>
                        <h4 class="review-name">${usuario}</h4>
                        <span class="review-date">${fecha}</span>
                    </div>
                </div>
                <div class="review-rating">${estrellas}</div>
            </div>
            <p class="review-text">${comentario}</p>
        </div>
    `;
}

function obtenerPrefijoRuta() {
    return window.location.pathname.includes("/components/") || window.location.pathname.includes("/admin/") ? "../../" : "src/";
}

function redirigirAHome() {
    window.location.href = window.location.pathname.includes("/components/") || window.location.pathname.includes("/admin/") ? "../../index.html" : "index.html";
}

function cerrarSesionPlataforma() {
    localStorage.removeItem("usuarioActivo");
    alert("Sesión cerrada.");
    redirigirAHome();
}
// ==========================================================================
// INTERCEPTOR LOGUEO: CONTROL DEL BANNER DE BENEFICIOS DUOC
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnBeneficio = document.getElementById("btn-reclamar-beneficio");
    if (!btnBeneficio) return;

    btnBeneficio.addEventListener("click", (e) => {
        e.preventDefault(); // Detiene cualquier redirección o comportamiento por defecto

        // Revisamos si existe un usuario activo en la plataforma
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

        if (usuarioActivo) {
            // CASO A: El usuario YA está registrado e inició sesión
            mostrarPopupBeneficioActivo(usuarioActivo.nombre);
        } else {
            // CASO B: Es un visitante anónimo, lo mandamos a registrarse de forma segura
            const prefijo = window.location.pathname.includes("/components/") ? "" : "src/components/";
            window.location.href = `${prefijo}registro.html`;
        }
    });
});

/**
 * Crea e inyecta dinámicamente un Modal Neón flotante de aviso
 */
document.addEventListener("DOMContentLoaded", () => {
    const btnBeneficio = document.getElementById("btn-reclamar-beneficio");
    if (!btnBeneficio) return;

    btnBeneficio.addEventListener("click", (e) => {
        e.preventDefault(); 

        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

        if (usuarioActivo) {
            // Si ya inició sesión, abrimos el recuadro formal de la tienda
            mostrarPopupBeneficioActivo(usuarioActivo.nombre);
        } else {
            // Si es un cliente anónimo, lo redirigimos automáticamente por código a tu ruta
            const prefijo = window.location.pathname.includes("/components/") ? "" : "src/components/";
            window.location.href = `${prefijo}signup.html`;
        }
    });
});

function mostrarPopupBeneficioActivo(nombreUsuario) {
    const modalViejo = document.getElementById("modal-beneficio-activo");
    if (modalViejo) modalViejo.remove();

    const modal = document.createElement("div");
    modal.id = "modal-beneficio-activo";
    modal.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:100000; font-family:sans-serif;";

    modal.innerHTML = `
        <div style="background: #0b0b1a; border: 2px solid #39FF14; border-radius: 8px; padding: 30px; max-width: 450px; text-align: center; box-shadow: 0 0 25px rgba(57, 255, 20, 0.4); margin: 20px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🛍️</div>
            <h3 style="color: #39FF14; margin: 0 0 10px 0; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 1px;">Beneficio Vinculado</h3>
            <p style="color: #ffffff; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
                Estimado(a) <span style="color: #00bfff; font-weight: bold;">${nombreUsuario.toUpperCase()}</span>, confirmamos que su sesión institucional se encuentra activa. Su descuento exclusivo del **20% de convenio** se aplicará de forma automática en el desglose de su carro de compras al procesar el pago.
            </p>
            <button id="close-modal-beneficio" style="background: #39FF14; color: #000000; border: none; padding: 12px 25px; font-weight: bold; border-radius: 4px; cursor: pointer; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; width: 100%;">
                CONTINUAR COMPRANDO
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById("close-modal-beneficio").onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}
// ==========================================================================
// INYECCIÓN DINÁMICA DE FOOTER GLOBALIZADO CON LOGIC DE RUTAS CORREGIDA
// ==========================================================================
// ==========================================================================
// RENDERIZAR FOOTER GLOBAL CON LUCIDE ICONS (src/js/main.js)
// ==========================================================================
function renderizarFooterGlobal() {
    const footerElement = document.getElementById("global-footer");
    if (!footerElement) return;

    const esComponente = window.location.pathname.includes("/components/") || window.location.pathname.includes("/admin/");
    const prefijoComponentes = esComponente ? "" : "src/components/";

    footerElement.innerHTML = `
        <div style="background-color: #050508; border-top: 1px solid rgba(30, 144, 255, 0.2); padding: 50px 20px 20px 20px; color: #ffffff; font-family: sans-serif;">
            <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; text-align: left;">
                
                <!-- Columna 1: Marca, Identidad y Redes Sociales con Lucide -->
                <div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin: 0 0 5px 0; font-size: 1.4rem; color: #00bfff; letter-spacing: 1px;">LEVEL-UP</h3>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin: 0 0 15px 0; font-size: 1.4rem; color: #39FF14; letter-spacing: 1px;">GAMER</h3>
                    <p style="color: #8e8ea8; font-size: 0.88rem; line-height: 1.6; margin-bottom: 20px;">
                        La tienda definitiva para entusiastas del gaming en Chile. Tu setup soñado comienza aquí.
                    </p>
                    
                    <!-- Contenedor optimizado: Nombres corregidos para compatibilidad CDN estándar -->

                </div>

                <!-- Columna 2: Enlaces Rápidos -->
                <div>
                    <h4 style="font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #ffffff; margin: 0 0 20px 0; letter-spacing: 1px; text-transform: uppercase;">Enlaces Rápidos</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}productos.html" style="color: #8e8ea8; text-decoration: none;">Productos</a></li>
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}blogs.html" style="color: #8e8ea8; text-decoration: none;">Blog Gamer</a></li>
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}nosotros.html" style="color: #8e8ea8; text-decoration: none;">Sobre Nosotros</a></li>
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}contacto.html" style="color: #8e8ea8; text-decoration: none;">Contacto</a></li>
                    </ul>
                </div>

                <!-- Columna 3: Categorías -->
                <div>
                    <h4 style="font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #ffffff; margin: 0 0 20px 0; letter-spacing: 1px; text-transform: uppercase;">Categorías</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}productos.html" style="color: #8e8ea8; text-decoration: none;">Consolas</a></li>
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}productos.html" style="color: #8e8ea8; text-decoration: none;">PC Gamer</a></li>
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}productos.html" style="color: #8e8ea8; text-decoration: none;">Accesorios</a></li>
                        <li style="margin-bottom: 12px;"><a href="${prefijoComponentes}productos.html" style="color: #8e8ea8; text-decoration: none;">Juegos de Mesa</a></li>
                    </ul>
                </div>

                <!-- Columna 4: Soporte -->
                <div>
                    <h4 style="font-family: 'Orbitron', sans-serif; font-size: 1rem; color: #ffffff; margin: 0 0 20px 0; letter-spacing: 1px; text-transform: uppercase;">Soporte</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
                        <li style="margin-bottom: 12px;"><a href="#" style="color: #8e8ea8; text-decoration: none;">Términos y Condiciones</a></li>
                        <li style="margin-bottom: 12px;"><a href="#" style="color: #8e8ea8; text-decoration: none;">Políticas de Privacidad</a></li>
                        <li style="margin-bottom: 12px;"><a href="#" style="color: #8e8ea8; text-decoration: none;">Envíos y Devoluciones</a></li>
                        <li style="margin-bottom: 12px;"><a href="#" style="color: #8e8ea8; text-decoration: none;">Preguntas Frecuentes</a></li>
                    </ul>
                </div>

            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 0.8rem; color: #5a5a75;">
                <p>&copy; 2026 Level-Up Gamer. Todos los derechos reservados. Desarrollado para Evaluación Web Académica.</p>
            </div>
        </div>
    `;

    // CORRECCIÓN DE ASINCRONÍA: Retrasamos el parseo sutilmente para asegurar que los elementos ya existan en el DOM
    setTimeout(() => {
        try {
            if (window.lucide && typeof window.lucide.createIcons === "function") {
                window.lucide.createIcons();
            }
        } catch (err) {
            console.error("Error al renderizar Lucide en el footer dinámico:", err);
        }
    }, 50);
}