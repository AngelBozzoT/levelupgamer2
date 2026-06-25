/* ==========================================================================
   src/js/datos_admin.js
   Capa de Datos + Renderizado del Panel Administrativo.
   Simula un backend usando arreglos en memoria persistidos en localStorage,
   de modo que crear, editar y eliminar productos/usuarios se mantenga
   incluso después de recargar la página.
   ========================================================================== */

const ADMIN_PRODUCTOS_KEY = "levelup_admin_productos";
const ADMIN_USUARIOS_KEY = "levelup_admin_usuarios";

/* Datos semilla iniciales (se usan solo la primera vez, antes de guardar nada) */
const PRODUCTOS_SEMILLA = [
    { codigo: "JM001", nombre: "Catan",                                   categoria: "Juegos de Mesa",         precio: 29990,   stock: 25, stockCritico: 5,  descripcion: "Juego de estrategia y negociación.", imagen: "https://i5.walmartimages.com/asr/a1863816-7553-441d-ad37-734a716ed55a.00a63b9153c188bd583dbfd05b191f90.jpeg" },
    { codigo: "JM002", nombre: "Carcassonne",                              categoria: "Juegos de Mesa",         precio: 24990,   stock: 18, stockCritico: 5,  descripcion: "Juego clásico de construcción de mapas.", imagen: "https://i5.walmartimages.cl/asr/5e0f858c-e687-4f05-8726-ac9a2d46296c.7c1b8264366f4112b169ce70a23e8531.jpeg" },
    { codigo: "AC001", nombre: "Controlador Inalámbrico Xbox Series X",    categoria: "Accesorios",             precio: 59990,   stock: 30, stockCritico: 8,  descripcion: "Mando inalámbrico compatible con Xbox, PC y móviles.", imagen: "https://i5.walmartimages.cl/asr/e53427b4-1133-4a53-93c8-9774f0385073.ad9f942fce2f82f3b36e538ba0c8dd5b.jpeg" },
    { codigo: "AC002", nombre: "Auriculares Gamer HyperX Cloud II",        categoria: "Accesorios",             precio: 79990,   stock: 4,  stockCritico: 5,  descripcion: "Sonido envolvente 7.1 con micrófono desmontable.", imagen: "https://http2.mlstatic.com/D_NQ_NP_953165-CBT112200835901_052026-O.webp" },
    { codigo: "CO001", nombre: "PlayStation 5",                            categoria: "Consolas",               precio: 549990,  stock: 6,  stockCritico: 3,  descripcion: "Consola de última generación con SSD ultra rápido.", imagen: "https://media.solotodo.com/media/products/1979309_picture_1731571228.jpg" },
    { codigo: "CG001", nombre: "PC Gamer ASUS ROG Strix",                  categoria: "Computadores Gamers",    precio: 1299990, stock: 3,  stockCritico: 2,  descripcion: "Equipo de escritorio de alto rendimiento para esports.", imagen: "https://media.spdigital.cl/thumbnails/products/ygse9ue7_b405ce7d_thumbnail_512.jpg" },
    { codigo: "SG001", nombre: "Silla Gamer Secretlab Titan",              categoria: "Sillas Gamers",          precio: 349990,  stock: 9,  stockCritico: 3,  descripcion: "Silla ergonómica con soporte lumbar ajustable.", imagen: "https://m.media-amazon.com/images/I/410uYasNqFL._AC_UF894,1000_QL80_.jpg" },
    { codigo: "MS001", nombre: "Mouse Gamer Logitech G502 HERO",          categoria: "Mouse",                  precio: 49990,   stock: 40, stockCritico: 10, descripcion: "Sensor óptico HERO 25K y 11 botones programables.", imagen: "https://media.spdigital.cl/thumbnails/products/snbujg5__29f7dd61_thumbnail_4096.jpg" },
    { codigo: "MP001", nombre: "Mousepad Razer Goliathus Extended Chroma", categoria: "Mousepad",               precio: 29990,   stock: 22, stockCritico: 5,  descripcion: "Mousepad extendido con iluminación RGB Chroma.", imagen: "https://prophonechile.cl/wp-content/uploads/2023/02/goliathusex.png" },
    { codigo: "PP001", nombre: "Polera Gamer Personalizada 'Level-Up'",    categoria: "Poleras Personalizadas", precio: 14990,   stock: 50, stockCritico: 10, descripcion: "Polera de algodón premium personalizable.", imagen: "" }
];

const USUARIOS_SEMILLA = [
    { run: "191102203", nombre: "Camila", apellidos: "Soto Reyes",    correo: "camila.soto@gmail.com",        fechaNacimiento: "1995-03-12", perfil: "Administrador", region: "reg_metropolitana", comuna: "santiago",     direccion: "Av. Libertador Bernardo O'Higgins 1234" },
    { run: "182334455", nombre: "Matías", apellidos: "Fernández Lira", correo: "matias.fernandez@inacap.cl",   fechaNacimiento: "1999-07-22", perfil: "Vendedor",      region: "reg_valparaiso",    comuna: "viña_del_mar", direccion: "Calle 5 Norte 456" },
    { run: "203445566", nombre: "Javiera", apellidos: "Muñoz Pardo",   correo: "javiera.munoz@gmail.com",       fechaNacimiento: "", perfil: "Cliente",       region: "reg_biobio",        comuna: "concepción",   direccion: "Pasaje Los Aromos 789" },
    { run: "175566778", nombre: "Ignacio", apellidos: "Vargas Tapia",  correo: "ignacio.vargas@profesor.inacap.cl", fechaNacimiento: "", perfil: "Cliente",   region: "reg_metropolitana", comuna: "maipú",        direccion: "Av. Pajaritos 2200" }
];

window.adminProductos = [];
window.adminUsuarios = [];

/* ------------------------- Persistencia ------------------------- */
function cargarAdminProductos() {
    try {
        const guardado = localStorage.getItem(ADMIN_PRODUCTOS_KEY);
        window.adminProductos = guardado ? JSON.parse(guardado) : JSON.parse(JSON.stringify(PRODUCTOS_SEMILLA));
    } catch (e) {
        window.adminProductos = JSON.parse(JSON.stringify(PRODUCTOS_SEMILLA));
    }
}

function cargarAdminUsuarios() {
    try {
        const guardado = localStorage.getItem(ADMIN_USUARIOS_KEY);
        window.adminUsuarios = guardado ? JSON.parse(guardado) : JSON.parse(JSON.stringify(USUARIOS_SEMILLA));
    } catch (e) {
        window.adminUsuarios = JSON.parse(JSON.stringify(USUARIOS_SEMILLA));
    }
}

function persistirAdminProductos() {
    localStorage.setItem(ADMIN_PRODUCTOS_KEY, JSON.stringify(window.adminProductos));
}

function persistirAdminUsuarios() {
    localStorage.setItem(ADMIN_USUARIOS_KEY, JSON.stringify(window.adminUsuarios));
}

/* ------------------------- Render: Tabla de Productos ------------------------- */
function renderizarTablaProductos() {
    const tbody = document.getElementById("tabla-productos-body");
    if (!tbody) return;

    if (window.adminProductos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">No hay productos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = window.adminProductos.map(p => {
        const enAlerta = Number(p.stock) <= Number(p.stockCritico || 0);
        return `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${Number(p.precio).toLocaleString("es-CL")}</td>
                <td>${p.stock}</td>
                <td><span class="badge ${enAlerta ? "badge-danger" : "badge-success"}">${enAlerta ? "Stock Crítico" : "Disponible"}</span></td>
                <td>
                    <button type="button" class="btn-action btn-edit" onclick="prepararEdicionProducto('${p.codigo}')">Editar</button>
                    <button type="button" class="btn-action btn-delete" onclick="eliminarProductoAdmin('${p.codigo}')">Eliminar</button>
                </td>
            </tr>
        `;
    }).join("");
}

/* ------------------------- Render: Tabla de Usuarios ------------------------- */
function renderizarTablaUsuarios() {
    const tbody = document.getElementById("tabla-usuarios-body");
    if (!tbody) return;

    if (window.adminUsuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">No hay usuarios registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = window.adminUsuarios.map(u => {
        const claseBadge = u.perfil === "Administrador" ? "badge-admin" : (u.perfil === "Vendedor" ? "badge-success" : "badge-danger");
        return `
            <tr>
                <td>${u.run}</td>
                <td>${u.nombre} ${u.apellidos}</td>
                <td>${u.correo}</td>
                <td><span class="badge ${claseBadge}">${u.perfil}</span></td>
                <td>${u.comuna ? u.comuna.replace(/_/g, " ") : "-"}</td>
                <td>
                    <button type="button" class="btn-action btn-edit" onclick="prepararEdicionUsuario('${u.run}')">Editar</button>
                    <button type="button" class="btn-action btn-delete" onclick="eliminarUsuarioAdmin('${u.run}')">Eliminar</button>
                </td>
            </tr>
        `;
    }).join("");
}

/* ------------------------- CRUD: Productos ------------------------- */
function guardarProducto(datos, modo, codigoOriginal) {
    if (modo === "edit" && codigoOriginal) {
        const indice = window.adminProductos.findIndex(p => p.codigo === codigoOriginal);
        if (indice !== -1) window.adminProductos[indice] = datos;
    } else {
        window.adminProductos.push(datos);
    }
    persistirAdminProductos();
    renderizarTablaProductos();
    renderizarEstadisticasDashboard();
}

function eliminarProductoAdmin(codigo) {
    if (!confirm(`¿Seguro que deseas eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) return;
    window.adminProductos = window.adminProductos.filter(p => p.codigo !== codigo);
    persistirAdminProductos();
    renderizarTablaProductos();
    renderizarEstadisticasDashboard();
}

function prepararEdicionProducto(codigo) {
    const producto = window.adminProductos.find(p => p.codigo === codigo);
    if (!producto) return;

    document.getElementById("prod-codigo").value = producto.codigo;
    document.getElementById("prod-nombre").value = producto.nombre;
    document.getElementById("prod-descripcion").value = producto.descripcion || "";
    document.getElementById("prod-precio").value = producto.precio;
    document.getElementById("prod-stock").value = producto.stock;
    document.getElementById("prod-categoria").value = producto.categoria;
    document.getElementById("prod-stock-critico").value = producto.stockCritico || 0;
    document.getElementById("prod-imagen").value = producto.imagen || "";

    openForm("producto", "edit", codigo);
}

/* ------------------------- CRUD: Usuarios ------------------------- */
function guardarUsuario(datos, modo, runOriginal) {
    if (modo === "edit" && runOriginal) {
        const indice = window.adminUsuarios.findIndex(u => u.run === runOriginal);
        if (indice !== -1) window.adminUsuarios[indice] = datos;
    } else {
        window.adminUsuarios.push(datos);
    }
    persistirAdminUsuarios();
    renderizarTablaUsuarios();
    renderizarEstadisticasDashboard();
}

function eliminarUsuarioAdmin(run) {
    if (!confirm(`¿Seguro que deseas eliminar al usuario con RUN ${run}? Esta acción no se puede deshacer.`)) return;
    window.adminUsuarios = window.adminUsuarios.filter(u => u.run !== run);
    persistirAdminUsuarios();
    renderizarTablaUsuarios();
    renderizarEstadisticasDashboard();
}

function prepararEdicionUsuario(run) {
    const usuario = window.adminUsuarios.find(u => u.run === run);
    if (!usuario) return;

    document.getElementById("user-run").value = usuario.run;
    document.getElementById("user-nombre").value = usuario.nombre;
    document.getElementById("user-apellidos").value = usuario.apellidos;
    document.getElementById("user-correo").value = usuario.correo;
    document.getElementById("user-fecha-nacimiento").value = usuario.fechaNacimiento || "";
    document.getElementById("user-perfil").value = usuario.perfil;

    const regionSelect = document.getElementById("user-region");
    const comunaSelect = document.getElementById("user-comuna");
    if (regionSelect && comunaSelect) {
        regionSelect.value = usuario.region;
        regionSelect.dispatchEvent(new Event("change"));
        comunaSelect.value = usuario.comuna;
    }

    document.getElementById("user-direccion").value = usuario.direccion;

    openForm("usuario", "edit", run);
}

/* ------------------------- Render: Estadísticas del Dashboard ------------------------- */
function renderizarEstadisticasDashboard() {
    const elTotalProductos = document.getElementById("stat-total-productos");
    const elTotalUsuarios = document.getElementById("stat-total-usuarios");
    const elAlertasStock = document.getElementById("stat-alertas-stock");

    if (elTotalProductos) elTotalProductos.textContent = window.adminProductos.length;
    if (elTotalUsuarios) elTotalUsuarios.textContent = window.adminUsuarios.length;
    if (elAlertasStock) {
        const totalAlertas = window.adminProductos.filter(p => Number(p.stock) <= Number(p.stockCritico || 0)).length;
        elAlertasStock.textContent = totalAlertas;
    }
}

/* ------------------------- Inicialización ------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    cargarAdminProductos();
    cargarAdminUsuarios();
    renderizarTablaProductos();
    renderizarTablaUsuarios();
    renderizarEstadisticasDashboard();
});
