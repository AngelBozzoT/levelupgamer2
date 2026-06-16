/* ==========================================================================
   Control de Formularios y Validaciones - Level-Up Gamer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Inicialización de Ubicaciones Dinámicas (Paso Anterior) ---
    const selectRegion = document.getElementById("region");
    const selectComuna = document.getElementById("comuna");

    if (selectRegion && selectComuna) {
        inicializarUbicaciones(selectRegion, selectComuna);
    }

    // --- 2. Inicialización de Formularios ---
    const formRegistro = document.getElementById("form-registro");
    const formContacto = document.getElementById("form-contacto");

    if (formRegistro) {
        formRegistro.addEventListener("submit", validarFormularioRegistro);
    }

    if (formContacto) {
        // Inicializar contador de caracteres en tiempo real
        const txtComentario = document.getElementById("contacto-comentario");
        if (txtComentario) {
            txtComentario.addEventListener("input", actualizarContadorCaracteres);
        }
        formContacto.addEventListener("submit", validarFormularioContacto);
    }
});

/* ==========================================================================
   SECCIÓN A: Lógica de Ubicaciones (Local)
   ========================================================================== */
function inicializarUbicaciones(selectRegion, selectComuna) {
    const datosRegiones = window.regionesData;
    if (!datosRegiones) return;

    datosRegiones.forEach(region => {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.nombre;
        selectRegion.appendChild(option);
    });

    selectRegion.addEventListener("change", (e) => {
        const regionSeleccionadaId = e.target.value;
        selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

        if (regionSeleccionadaId === "") {
            selectComuna.disabled = true;
        } else {
            const regionEncontrada = datosRegiones.find(r => r.id === regionSeleccionadaId);
            if (regionEncontrada) {
                selectComuna.disabled = false;
                regionEncontrada.comunas.forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna.toLowerCase().replace(/\s+/g, "_");
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
            }
        }
    });
}

/* ==========================================================================
   SECCIÓN B: Validaciones del Formulario de Registro
   ========================================================================== */
function validarFormularioRegistro(e) {
    e.preventDefault(); // Detener el envío por defecto

    // Limpiar todos los errores previos
    limpiarErrores(["username", "email", "password", "fecha", "region", "comuna", "direccion"]);

    let esValido = true;

    // 1. Validar Nombre de Usuario
    const username = document.getElementById("username").value.trim();
    if (username === "") {
        mostrarError("username", "El nombre de usuario es obligatorio.");
        esValido = false;
    }

    // 2. Validar Correo Electrónico General
    const email = document.getElementById("email").value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        mostrarError("email", "El correo electrónico es obligatorio.");
        esValido = false;
    } else if (!regexEmail.test(email)) {
        mostrarError("email", "Por favor, introduce un formato de correo válido.");
        esValido = false;
    }

    // 3. Validar Contraseña
    const password = document.getElementById("password").value;
    if (password === "") {
        mostrarError("password", "La contraseña es obligatoria.");
        esValido = false;
    } else if (password.length < 6) {
        mostrarError("password", "La contraseña debe tener al menos 6 caracteres.");
        esValido = false;
    }

    // 4. Validar Fecha de Nacimiento (Mayoría de edad: Estricto +18 años)
    const fechaNacimientoInput = document.getElementById("fecha-nacimiento").value;
    if (fechaNacimientoInput === "") {
        mostrarError("fecha", "La fecha de nacimiento es obligatoria.");
        esValido = false;
    } else {
        const fechaNacimiento = new Date(fechaNacimientoInput);
        const hoy = new Date();
        
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        
        // Ajustar si el cumpleaños no ha pasado este año todavía
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        if (edad < 18) {
            mostrarError("fecha", `Debes ser mayor de 18 años para registrarte. Tu edad actual calculada es ${edad} años.`);
            esValido = false;
        }
    }

    // 5. Validar Región y Comuna
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;

    if (region === "") {
        mostrarError("region", "Debes seleccionar una región.");
        esValido = false;
    }
    if (comuna === "" && region !== "") {
        mostrarError("comuna", "Debes seleccionar una comuna.");
        esValido = false;
    }

    // 6. Validar Dirección
    const direccion = document.getElementById("direccion").value.trim();
    if (direccion === "") {
        mostrarError("direccion", "La dirección de despacho es obligatoria.");
        esValido = false;
    }

    // Si todo pasa con éxito
    if (esValido) {
        alert("¡Registro exitoso localmente! Bienvenido a Level-Up Gamer.");
        document.getElementById("form-registro").reset();
        document.getElementById("comuna").disabled = true;
    }
}

/* ==========================================================================
   SECCIÓN C: Validaciones del Formulario de Contacto
   ========================================================================== */
function actualizarContadorCaracteres(e) {
    const longitud = e.target.value.length;
    document.getElementById("current-chars").textContent = longitud;
}

function validarFormularioContacto(e) {
    e.preventDefault();

    limpiarErrores(["contacto-nombre", "contacto-correo", "contacto-comentario"]);

    let esValido = true;

    // 1. Validar Nombre Completo (Max 100 caracteres)
    const nombre = document.getElementById("contacto-nombre").value.trim();
    if (nombre === "") {
        mostrarError("contacto-nombre", "El nombre completo es requerido.");
        esValido = false;
    } else if (nombre.length > 100) {
        mostrarError("contacto-nombre", "El nombre no puede superar los 100 caracteres.");
        esValido = false;
    }

    // 2. Validar Correo Institucional / Gmail con dominios específicos (Max 100)
    const correo = document.getElementById("contacto-correo").value.trim();
    if (correo === "") {
        mostrarError("contacto-correo", "El correo electrónico es requerido.");
        esValido = false;
    } else if (correo.length > 100) {
        mostrarError("contacto-correo", "El correo no puede superar los 100 caracteres.");
        esValido = false;
   } else {
        // Expresión regular estándar y genérica para validar el formato de un correo electrónico
        const regexCorreoGenerico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexCorreoGenerico.test(correo)) {
            mostrarError("contacto-correo", "Por favor, introduce una dirección de correo electrónico válida (Ej: usuario@dominio.com).");
            esValido = false;
        }
    }

    // 3. Validar Comentario o Mensaje (Max 500 caracteres)
    const comentario = document.getElementById("contacto-comentario").value.trim();
    if (comentario === "") {
        mostrarError("contacto-comentario", "El comentario o mensaje es requerido.");
        esValido = false;
    } else if (comentario.length > 500) {
        mostrarError("contacto-comentario", "El mensaje no puede exceder los 500 caracteres.");
        esValido = false;
    }

    // Si todo es correcto
    if (esValido) {
        alert("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
        document.getElementById("form-contacto").reset();
        document.getElementById("current-chars").textContent = "0";
    }
}

/* ==========================================================================
   SECCIÓN D: Funciones Auxiliares de Interfaz
   ========================================================================== */
function mostrarError(idPrefijo, mensaje) {
    const contenedorError = document.getElementById(`error-${idPrefijo}`);
    if (contenedorError) {
        contenedorError.textContent = mensaje;
    }
}

function limpiarErrores(listaPrefijos) {
    listaPrefijos.forEach(idPrefijo => {
        const contenedorError = document.getElementById(`error-${idPrefijo}`);
        if (contenedorError) {
            contenedorError.textContent = "";
        }
    });
}