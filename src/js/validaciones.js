/* ==========================================================================
   Control de Formularios y Validaciones - Level-Up Gamer
   (Vista Tienda: Login, Registro, Contacto)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Inicialización de Ubicaciones Dinámicas (Registro) ---
    const selectRegion = document.getElementById("region");
    const selectComuna = document.getElementById("comuna");

    if (selectRegion && selectComuna) {
        inicializarUbicaciones(selectRegion, selectComuna);
    }

    // --- 2. Inicialización de Formularios ---
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");
    const formContacto = document.getElementById("form-contacto");

    if (formLogin) {
        formLogin.addEventListener("submit", validarFormularioLogin);
    }

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
   SECCIÓN A: Lógica de Ubicaciones (Carga dinámica de Chile)
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
   SECCIÓN AUX: Validadores reutilizables (correo institucional / RUN)
   ========================================================================== */

/**
 * Valida que un correo tenga formato válido Y que su dominio esté dentro
 * de la lista de dominios permitidos para ese formulario en particular.
 */
function validarCorreoConDominio(correo, dominiosPermitidos) {
    const regexFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexFormato.test(correo)) return false;

    const dominio = correo.split("@")[1].toLowerCase();
    return dominiosPermitidos.some(permitido => dominio === permitido.toLowerCase());
}

/**
 * Valida el formato de un RUN chileno SIN puntos ni guion (Ej: 19011022K).
 */
function validarFormatoRUN(valor) {
    const limpio = valor.trim();
    if (!/^[0-9]+[0-9kK]$/.test(limpio)) return false;
    return limpio.length >= 7 && limpio.length <= 9;
}

/* ==========================================================================
   SECCIÓN B: Validaciones del Formulario de Inicio de Sesión (Login)
   ========================================================================== */
function validarFormularioLogin(e) {
    e.preventDefault();

    limpiarErrores(["login-correo", "login-password"]);
    let esValido = true;

    const correoElement = document.getElementById("login-correo");
    if (correoElement) {
        const correo = correoElement.value.trim();
        if (correo === "") {
            mostrarError("login-correo", "El correo electrónico es obligatorio.");
            esValido = false;
        } else if (correo.length > 100) {
            mostrarError("login-correo", "El correo no puede superar los 100 caracteres.");
            esValido = false;
        } else if (!validarCorreoConDominio(correo, ["inacap.cl", "inacapmail.cl", "gmail.com", "duocuc.cl", "alumnos.duoc.cl"])) {
            mostrarError("login-correo", "Solo se aceptan correos institucionales o gmail.");
            esValido = false;
        }
    }

    const passwordElement = document.getElementById("login-password");
    if (passwordElement) {
        const password = passwordElement.value;
        if (password === "") {
            mostrarError("login-password", "La contraseña es obligatoria.");
            esValido = false;
        } else if (password.length < 4 || password.length > 10) {
            mostrarError("login-password", "La contraseña debe tener entre 4 y 10 caracteres.");
            esValido = false;
        }
    }

    if (esValido) {
        const correoIngresado = correoElement.value.trim().toLowerCase();
        
        // ==========================================================================
        // 1. CONTROL DE ADMINISTRADOR (admin@inacap.cl)
        // ==========================================================================
        if (correoIngresado === "admin@inacap.cl") {
            localStorage.removeItem("usuarioActivo"); // Limpiar residuos de usuarios comunes
            localStorage.removeItem("logout_manual");
            localStorage.setItem("isAdmin", "true");  // Bandera que main.js necesita para activar el menú e interactividad root
            
            alert("¡Inicio de sesión como Administrador correcto!");
            document.getElementById("form-login").reset();
            window.location.href = "../../index.html";
            return; // Detiene la ejecución aquí para que no cree el datosUsuario común de abajo
        }

        // ==========================================================================
        // 2. FLUJO PARA USUARIOS COMUNES / ALUMNOS
        // ==========================================================================
        // Evaluar si es de la comunidad Duoc para mantener activo su descuento
        let esComunidadDuoc = false;
        if (correoIngresado.endsWith("@duocuc.cl") || correoIngresado.endsWith("@alumnos.duoc.cl")) {
            esComunidadDuoc = true;
        }

        // Crear la estructura de sesión activa en localStorage
        const datosUsuario = {
            run: "12345678K", // RUN simulado para inicio rápido
            nombre: correoIngresado.split("@")[0], // Extrae el alias antes del @ como nombre visible
            email: correoIngresado,
            aplicaDescuentoEspecial: esComunidadDuoc,
            puntosLevelUp: 150 // Puntos base otorgados por la plataforma
        };

        // Guardar el estado del usuario activo
        localStorage.removeItem("isAdmin"); // Asegurar que no arrastre sesiones de admin antiguas
        localStorage.setItem("usuarioActivo", JSON.stringify(datosUsuario));

        alert(`¡Bienvenido de nuevo, ${datosUsuario.nombre}! Sesión iniciada correctamente.`);
        document.getElementById("form-login").reset();

        // Redireccionar a la raíz
        window.location.href = "../../index.html";
    }
}

/* ==========================================================================
   SECCIÓN C: Validaciones del Formulario de Registro
   ========================================================================== */
function validarFormularioRegistro(e) {
    e.preventDefault();

    limpiarErrores(["run", "nombre", "apellidos", "email", "password", "fecha", "region", "comuna", "direccion"]);
    let esValido = true;
    let esComunidadDuoc = false;

    // 1. Validar RUN
    const runElement = document.getElementById("run");
    if (runElement) {
        const run = runElement.value.trim();
        if (run === "") {
            mostrarError("run", "El RUN es obligatorio.");
            esValido = false;
        } else if (!validarFormatoRUN(run)) {
            mostrarError("run", "Formato inválido. Sin puntos ni guion (Ej: 19011022K).");
            esValido = false;
        }
    }

    // 2. Validar Nombre
    const nombreElement = document.getElementById("nombre");
    if (nombreElement) {
        const nombre = nombreElement.value.trim();
        if (nombre === "") {
            mostrarError("nombre", "El nombre es obligatorio.");
            esValido = false;
        } else if (nombre.length > 50) {
            mostrarError("nombre", "El nombre no puede superar los 50 caracteres.");
            esValido = false;
        }
    }

    // 3. Validar Apellidos
    const apellidosElement = document.getElementById("apellidos");
    if (apellidosElement) {
        const apellidos = apellidosElement.value.trim();
        if (apellidos === "") {
            mostrarError("apellidos", "Los apellidos son obligatorios.");
            esValido = false;
        } else if (apellidos.length > 100) {
            mostrarError("apellidos", "Los apellidos no pueden superar los 100 caracteres.");
            esValido = false;
        }
    }

    // 4. Validar Correo Electrónico
    const emailElement = document.getElementById("email");
    if (emailElement) {
        const email = emailElement.value.trim().toLowerCase();
        if (email === "") {
            mostrarError("email", "El correo electrónico es obligatorio.");
            esValido = false;
        } else if (email.length > 100) {
            mostrarError("email", "El correo no puede superar los 100 caracteres.");
            esValido = false;
        } else if (!validarCorreoConDominio(email, ["inacap.cl", "profesor.inacap.cl", "gmail.com", "duocuc.cl", "alumnos.duoc.cl"])) {
            mostrarError("email", "Correo no permitido. Dominios válidos: @inacap.cl, @duocuc.cl, @alumnos.duoc.cl o @gmail.com.");
            esValido = false;
        } else {
            // Evaluar si califica para el descuento del 20%
            if (email.endsWith("@duocuc.cl") || email.endsWith("@alumnos.duoc.cl")) {
                esComunidadDuoc = true;
            }
        }
    }

    // 5. Validar Contraseña
    const passwordElement = document.getElementById("password");
    if (passwordElement) {
        const password = passwordElement.value;
        if (password === "") {
            mostrarError("password", "La contraseña es obligatoria.");
            esValido = false;
        } else if (password.length < 4 || password.length > 10) {
            mostrarError("password", "La contraseña debe tener entre 4 y 10 caracteres.");
            esValido = false;
        }
    }

    // 6. Validar Fecha de Nacimiento (Mayoría de edad +18)
    const fechaInput = document.getElementById("fecha-nacimiento");
    if (fechaInput) {
        const fechaNacimientoInput = fechaInput.value;
        if (fechaNacimientoInput === "") {
            mostrarError("fecha", "La fecha de nacimiento es obligatoria.");
            esValido = false;
        } else {
            const partes = fechaNacimientoInput.split('-');
            const anioNac = parseInt(partes[0], 10);
            const mesNac = parseInt(partes[1], 10) - 1;
            const diaNac = parseInt(partes[2], 10);

            const hoy = new Date();
            let edad = hoy.getFullYear() - anioNac;
            const mesDiferencia = hoy.getMonth() - mesNac;

            if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < diaNac)) {
                edad--;
            }

            if (edad < 18) {
                mostrarError("fecha", `Debes ser mayor de 18 años para registrarte. Tu edad actual es ${edad} años.`);
                esValido = false;
            }
        }
    }

    // 7. Validar Región y Comuna
    const regionElement = document.getElementById("region");
    const comunaElement = document.getElementById("comuna");
    if (regionElement && comunaElement) {
        const region = regionElement.value;
        const comuna = comunaElement.value;

        if (region === "") {
            mostrarError("region", "Debes seleccionar una región.");
            esValido = false;
        }
        if (comuna === "" && region !== "") {
            mostrarError("comuna", "Debes seleccionar una comuna.");
            esValido = false;
        }
    }

    // 8. Validar Dirección
    const direccionElement = document.getElementById("direccion");
    if (direccionElement) {
        const direccion = direccionElement.value.trim();
        if (direccion === "") {
            mostrarError("direccion", "La dirección de despacho es obligatoria.");
            esValido = false;
        } else if (direccion.length > 300) {
            mostrarError("direccion", "La dirección no puede superar los 300 caracteres.");
            esValido = false;
        }
    }

    // Guardado y procesamiento al completar con éxito
    if (esValido) {
        const datosUsuario = {
            run: runElement.value.trim(),
            nombre: nombreElement.value.trim(),
            email: emailElement.value.trim().toLowerCase(),
            aplicaDescuentoEspecial: esComunidadDuoc,
            puntosLevelUp: 0
        };

        localStorage.setItem("usuarioActivo", JSON.stringify(datosUsuario));

        if (esComunidadDuoc) {
            alert("¡Registro exitoso! Se ha detectado tu correo institucional de Duoc. Tu beneficio del 20% de descuento vitalicio ha sido configurado.");
        } else {
            alert("¡Registro exitoso! Bienvenido a Level-Up Gamer. Ahora puedes iniciar sesión.");
        }

        document.getElementById("form-registro").reset();
        if (comunaElement) comunaElement.disabled = true;
        window.location.href = "login.html";
    }
}

/* ==========================================================================
   SECCIÓN D: Validaciones del Formulario de Contacto
   ========================================================================== */
function actualizarContadorCaracteres(e) {
    const longitud = e.target.value.length;
    const currentCharsElement = document.getElementById("current-chars");
    if (currentCharsElement) {
        currentCharsElement.textContent = longitud;
    }
}

function validarFormularioContacto(e) {
    e.preventDefault();

    limpiarErrores(["contacto-nombre", "contacto-correo", "contacto-comentario"]);
    let esValido = true;

    const nombreElement = document.getElementById("contacto-nombre");
    if (nombreElement) {
        const nombre = nombreElement.value.trim();
        if (nombre === "") {
            mostrarError("contacto-nombre", "El nombre completo es requerido.");
            esValido = false;
        } else if (nombre.length > 100) {
            mostrarError("contacto-nombre", "El nombre no puede superar los 100 caracteres.");
            esValido = false;
        }
    }

    const correoElement = document.getElementById("contacto-correo");
    if (correoElement) {
        const correo = correoElement.value.trim();
        if (correo === "") {
            mostrarError("contacto-correo", "El correo electrónico es requerido.");
            esValido = false;
        } else if (!validarCorreoConDominio(correo, ["inacap.cl", "profesor.inacap.cl", "gmail.com", "duocuc.cl", "alumnos.duoc.cl"])) {
            mostrarError("contacto-correo", "Solo se aceptan correos válidos de la comunidad o gmail.");
            esValido = false;
        }
    }

    const comentarioElement = document.getElementById("contacto-comentario");
    if (comentarioElement) {
        const comentario = comentarioElement.value.trim();
        if (comentario === "") {
            mostrarError("contacto-comentario", "El comentario o mensaje es requerido.");
            esValido = false;
        } else if (comentario.length > 500) {
            mostrarError("contacto-comentario", "El mensaje no puede exceder los 500 caracteres.");
            esValido = false;
        }
    }

    if (esValido) {
        alert("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
        document.getElementById("form-contacto").reset();
        const currentCharsElement = document.getElementById("current-chars");
        if (currentCharsElement) currentCharsElement.textContent = "0";
    }
}

/* ==========================================================================
   SECCIÓN E: Funciones Auxiliares de Interfaz (Renderizado Seguro)
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