/* ==========================================================================
   Lógica de Validaciones del Lado del Cliente - Panel de Administración
   Al validar correctamente, los datos se guardan de verdad (vía
   datos_admin.js) y las tablas del panel se refrescan en pantalla.
   ========================================================================== */

/**
 * Valida el formato de un RUN chileno sin puntos ni guion (Ej: 19011022K).
 * Largo total permitido: 7 a 9 caracteres.
 */
function validarFormatoRUNAdmin(valor) {
    const limpio = valor.trim();
    if (!/^[0-9]+[0-9kK]$/.test(limpio)) return false;
    return limpio.length >= 7 && limpio.length <= 9;
}

/**
 * CONTROL DE ACCESO ABSOLUTO (LOGIN ADMINISTRADOR)
 * Esta función es invocada directamente por el 'onsubmit' del formulario en login.html
 * Intercepta de manera segura el flujo para evitar que el navegador recargue al Home.
 */
function procesarLoginOperacional(e) {
    // 1. Frenar inmediatamente el comportamiento nativo de recarga
    e.preventDefault(); 
    
    const userInput = document.getElementById("login-correo"); // Sincronizado con el ID del HTML
    const passInput = document.getElementById("login-password");
    const errLogin = document.getElementById("error-login-global");

    if (!userInput || !passInput) {
        console.error("Error: No se encontraron los elementos input en el DOM.");
        return false;
    }

    const usuario = userInput.value.trim();
    const password = passInput.value.trim();

// 2. Validación de credenciales estáticas estipuladas
// 2. Validación de credenciales estáticas estipuladas
    if (usuario === "admin" && password === "admin123") {
        localStorage.setItem("isAdmin", "true");
        
        // ¡AGREGA ESTA LÍNEA AQUÍ! Limpia el bloqueo manual para reactivar el flujo dinámico
        localStorage.removeItem("logout_manual");
        
        alert("¡Autenticación exitosa! Bienvenido al Panel de Control.");
        
        window.location.replace("../admin/panel.html");
        return true;
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // SECCIÓN RESPALDADA DE INGRESO TRADICIONAL
    // ==========================================
    const formLogin = document.getElementById("form-login"); 
    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            // Se complementa con la lógica operacional superior
            procesarLoginOperacional(e);
        });
    }

    // ==========================================
    // MANTENEDOR DE PRODUCTOS
    // ==========================================
    const formProducto = document.getElementById("form-admin-producto");
    if (formProducto) {
        formProducto.addEventListener("submit", function (e) {
            e.preventDefault();
            let isValid = true;

            // Código Producto: Requerido, Min 3
            const codigo = document.getElementById("prod-codigo");
            const errCodigo = document.getElementById("error-prod-codigo");
            if (!codigo.value.trim()) {
                errCodigo.innerText = "El código de producto es requerido.";
                isValid = false;
            } else if (codigo.value.trim().length < 3) {
                errCodigo.innerText = "Debe tener al menos 3 caracteres.";
                isValid = false;
            } else {
                errCodigo.innerText = "";
            }

            // Nombre Producto: Requerido, Max 100
            const nombre = document.getElementById("prod-nombre");
            const errNombre = document.getElementById("error-prod-nombre");
            if (!nombre.value.trim()) {
                errNombre.innerText = "El nombre es requerido.";
                isValid = false;
            } else if (nombre.value.trim().length > 100) {
                errNombre.innerText = "Máximo 100 caracteres.";
                isValid = false;
            } else {
                errNombre.innerText = "";
            }

            // Descripción: Opcional, Max 500
            const desc = document.getElementById("prod-descripcion");
            const errDesc = document.getElementById("error-prod-descripcion");
            if (desc.value.trim().length > 500) {
                errDesc.innerText = "La descripción no puede superar los 500 caracteres.";
                isValid = false;
            } else {
                errDesc.innerText = "";
            }

            // Precio: Requerido, Min 0
            const precio = document.getElementById("prod-precio");
            const errPrecio = document.getElementById("error-prod-precio");
            if (precio.value === "") {
                errPrecio.innerText = "El precio es requerido.";
                isValid = false;
            } else if (parseFloat(precio.value) < 0) {
                errPrecio.innerText = "El precio mínimo es 0 (FREE).";
                isValid = false;
            } else {
                errPrecio.innerText = "";
            }

            // Stock: Requerido, Min 0 (Solo Enteros)
            const stock = document.getElementById("prod-stock");
            const errStock = document.getElementById("error-prod-stock");
            if (stock.value === "") {
                errStock.innerText = "El stock es requerido.";
                isValid = false;
            } else if (parseInt(stock.value) < 0 || !Number.isInteger(Number(stock.value))) {
                errStock.innerText = "Debe ser un número entero mayor o igual a 0.";
                isValid = false;
            } else {
                errStock.innerText = "";
            }

            // Categoría: Requerido
            const cat = document.getElementById("prod-categoria");
            const errCat = document.getElementById("error-prod-categoria");
            if (!cat.value) {
                errCat.innerText = "Debe seleccionar una categoría.";
                isValid = false;
            } else {
                errCat.innerText = "";
            }

            // Stock Crítico: Opcional, pero si existe debe ser entero >= 0
            const stockCritico = document.getElementById("prod-stock-critico");
            const errStockCritico = document.getElementById("error-prod-stock-critico");
            if (stockCritico.value !== "" && (parseInt(stockCritico.value) < 0 || !Number.isInteger(Number(stockCritico.value)))) {
                errStockCritico.innerText = "Debe ser un número entero mayor o igual a 0.";
                isValid = false;
            } else {
                errStockCritico.innerText = "";
            }

            if (isValid) {
                const modo = (window.adminEditState && window.adminEditState.type === "producto") ? "edit" : "create";
                const codigoOriginal = modo === "edit" ? window.adminEditState.idOriginal : null;

                const datosProducto = {
                    codigo: codigo.value.trim(),
                    nombre: nombre.value.trim(),
                    descripcion: desc.value.trim(),
                    precio: parseFloat(precio.value),
                    stock: parseInt(stock.value),
                    categoria: cat.value,
                    stockCritico: stockCritico.value === "" ? 0 : parseInt(stockCritico.value),
                    imagen: document.getElementById("prod-imagen").value.trim()
                };

                guardarProducto(datosProducto, modo, codigoOriginal);

                alert(modo === "edit" ? "¡Producto actualizado correctamente!" : "¡Producto agregado correctamente al catálogo!");
                formProducto.reset();
                closeForm("producto");
            }
        });
    }

    // ==========================================
    // MANTENEDOR DE USUARIOS
    // ==========================================
    const formUsuario = document.getElementById("form-admin-usuario");
    if (formUsuario) {

        // Poblar el selector de Región usando la base de datos completa de Chile (comunas.js)
        const regionSelect = document.getElementById("user-region");
        const comunaSelect = document.getElementById("user-comuna");

        if (regionSelect && comunaSelect && window.regionesData) {
            regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
            window.regionesData.forEach(region => {
                const opt = document.createElement("option");
                opt.value = region.id;
                opt.textContent = region.nombre;
                regionSelect.appendChild(opt);
            });

            regionSelect.addEventListener("change", function () {
                const regionEncontrada = window.regionesData.find(r => r.id === regionSelect.value);
                comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

                if (regionEncontrada) {
                    comunaSelect.disabled = false;
                    regionEncontrada.comunas.forEach(c => {
                        const opt = document.createElement("option");
                        opt.value = c.toLowerCase().replace(/\s+/g, "_");
                        opt.textContent = c;
                        comunaSelect.appendChild(opt);
                    });
                } else {
                    comunaSelect.disabled = true;
                    comunaSelect.innerHTML = '<option value="">Seleccione primero una región</option>';
                }
            });
        }

        formUsuario.addEventListener("submit", function (e) {
            e.preventDefault();
            let isValid = true;

            // Validar RUN: Sin puntos ni guión, formato chileno estándar largo 7 a 9
            const run = document.getElementById("user-run");
            const errRun = document.getElementById("error-user-run");
            if (!run.value.trim()) {
                errRun.innerText = "El RUN es requerido.";
                isValid = false;
            } else if (!validarFormatoRUNAdmin(run.value.trim())) {
                errRun.innerText = "Formato inválido (Ej: 19011022K sin puntos ni guiones).";
                isValid = false;
            } else {
                errRun.innerText = "";
            }

            // Nombre: Max 50
            const nom = document.getElementById("user-nombre");
            const errNom = document.getElementById("error-user-nombre");
            if (!nom.value.trim()) {
                errNom.innerText = "El nombre es requerido.";
                isValid = false;
            } else if (nom.value.trim().length > 50) {
                errNom.innerText = "Máximo 50 caracteres.";
                isValid = false;
            } else {
                errNom.innerText = "";
            }

            // Apellidos: Max 100
            const ape = document.getElementById("user-apellidos");
            const errApe = document.getElementById("error-user-apellidos");
            if (!ape.value.trim()) {
                errApe.innerText = "El apellido es requerido.";
                isValid = false;
            } else if (ape.value.trim().length > 100) {
                errApe.innerText = "Máximo 100 caracteres.";
                isValid = false;
            } else {
                errApe.innerText = "";
            }

            // Correo Electrónico Institucional / Común
            const correo = document.getElementById("user-correo");
            const errCorreo = document.getElementById("error-user-correo");
            const emailReg = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!correo.value.trim()) {
                errCorreo.innerText = "El correo es requerido.";
                isValid = false;
            } else if (correo.value.trim().length > 100) {
                errCorreo.innerText = "Máximo 100 caracteres.";
                isValid = false;
            } else if (!emailReg.test(correo.value.trim())) {
                errCorreo.innerText = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false;
            } else {
                errCorreo.innerText = "";
            }

            // Perfil / Tipo de usuario
            const perfil = document.getElementById("user-perfil");
            const errPerfil = document.getElementById("error-user-perfil");
            if (!perfil.value) {
                errPerfil.innerText = "Debe asignar un rol operacional.";
                isValid = false;
            } else {
                errPerfil.innerText = "";
            }

            // Región y Comuna
            const errRegion = document.getElementById("error-user-region");
            const errComuna = document.getElementById("error-user-comuna");
            if (!regionSelect.value) {
                errRegion.innerText = "Debe seleccionar una región.";
                isValid = false;
            } else {
                errRegion.innerText = "";
            }
            if (!comunaSelect.value) {
                errComuna.innerText = "Debe seleccionar una comuna.";
                isValid = false;
            } else {
                errComuna.innerText = "";
            }

            // Dirección: Max 300
            const dir = document.getElementById("user-direccion");
            const errDir = document.getElementById("error-user-direccion");
            if (!dir.value.trim()) {
                errDir.innerText = "La dirección de despacho es obligatoria.";
                isValid = false;
            } else if (dir.value.trim().length > 300) {
                errDir.innerText = "Máximo 300 caracteres.";
                isValid = false;
            } else {
                errDir.innerText = "";
            }

            if (isValid) {
                const modo = (window.adminEditState && window.adminEditState.type === "usuario") ? "edit" : "create";
                const runOriginal = modo === "edit" ? window.adminEditState.idOriginal : null;

                const datosUsuario = {
                    run: run.value.trim(),
                    nombre: nom.value.trim(),
                    apellidos: ape.value.trim(),
                    correo: correo.value.trim(),
                    fechaNacimiento: document.getElementById("user-fecha-nacimiento").value,
                    perfil: perfil.value,
                    region: regionSelect.value,
                    comuna: comunaSelect.value,
                    direccion: dir.value.trim()
                };

                guardarUsuario(datosUsuario, modo, runOriginal);

                alert(modo === "edit" ? "¡Usuario actualizado correctamente!" : "¡Usuario creado con éxito dentro de los roles autorizados!");
                formUsuario.reset();
                comunaSelect.disabled = true;
                closeForm("usuario");
            }
        });
    }
});