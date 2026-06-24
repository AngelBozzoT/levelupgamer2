/* ==========================================================================
   Lógica de Validaciones del Lado del Cliente - Panel de Administración
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
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

            if (isValid) {
                alert("¡Producto validado y guardado correctamente en la simulación!");
                formProducto.reset();
                const container = document.getElementById("form-producto-container");
                if (container) container.style.display = "none";
            }
        });
    }

    // ==========================================
    // MANTENEDOR DE USUARIOS
    // ==========================================
    const formUsuario = document.getElementById("form-admin-usuario");
    if (formUsuario) {
        
        // Manejo dinámico de Región y Comuna simulada
        const regionSelect = document.getElementById("user-region");
        const comunaSelect = document.getElementById("user-comuna");
        
        const comunasPorRegion = {
            "RM": ["Santiago", "Providencia", "Las Condes", "Maipú", "La Granja"],
            "Valparaiso": ["Valparaíso", "Viña del Mar", "Quilpué"]
        };

        if (regionSelect && comunaSelect) {
            regionSelect.addEventListener("change", function () {
                const reg = regionSelect.value;
                comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
                
                if (reg && comunasPorRegion[reg]) {
                    comunaSelect.disabled = false;
                    comunasPorRegion[reg].forEach(c => {
                        const opt = document.createElement("option");
                        opt.value = c.toLowerCase();
                        opt.innerText = c;
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
            const runReg = /^[0-9]{7,8}[0-9Kk]{1}$/;
            if (!run.value.trim()) {
                errRun.innerText = "El RUN es requerido.";
                isValid = false;
            } else if (!runReg.test(run.value.trim())) {
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
                alert("¡Usuario guardado con éxito dentro de los roles autorizados!");
                formUsuario.reset();
                if (comunaSelect) comunaSelect.disabled = true;
                const container = document.getElementById("form-usuario-container");
                if (container) container.style.display = "none";
            }
        });
    }
});