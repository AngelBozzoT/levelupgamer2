/* ==========================================================================
   Control de Formularios y Validaciones - Level-Up Gamer
   (Vista Tienda: Login, Registro, Contacto)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // INICIALIZACIÓN DE UBICACIONES (Chile)
    // ==========================================================================
    const selectRegion = document.getElementById("region");
    const selectComuna = document.getElementById("comuna");
    
    if (selectRegion && selectComuna) {
        inicializarUbicaciones(selectRegion, selectComuna);
    }

    // ==========================================================================
    // VINCULACIÓN DE FORMULARIOS A SUS VALIDACIONES REALES
    // ==========================================================================
    const loginForm = document.getElementById("form-login");
    if (loginForm) {
        loginForm.addEventListener("submit", validarFormularioLogin);
    }

    const registroForm = document.getElementById("form-registro"); 
    if (registroForm) {
        registroForm.addEventListener("submit", validarFormularioRegistro);
    }

    const contactoForm = document.getElementById("form-contacto");
    if (contactoForm) {
        contactoForm.addEventListener("submit", validarFormularioContacto);
        const comentarioArea = document.getElementById("mensaje");
        if (comentarioArea) {
            comentarioArea.addEventListener("input", actualizarContadorCaracteres);
        }
    }
});

/* ==========================================================================
   SECCIÓN A: Lógica de Ubicaciones (Carga dinámica de Chile)
   ========================================================================== */
function inicializarUbicaciones(selectRegion, selectComuna) {
    const datosRegiones = window.regionesData;
    if (!datosRegiones) return;

    // Limpiamos e insertamos la opción por defecto por si acaso
    selectRegion.innerHTML = '<option value="">Seleccione una región</option>';
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
function validarCorreoConDominio(correo, dominiosPermitidos) {
    const regexFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexFormato.test(correo)) return false;

    const dominio = correo.split("@")[1].toLowerCase();
    return dominiosPermitidos.some(permitido => dominio === permitido.toLowerCase());
}

function validarFormFormatRUN(valor) {
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
        } 
        else if (!validarCorreoConDominio(correo, ["inacap.cl", "inacapmail.cl", "gmail.com", "duoc.cl", "duocuc.cl", "alumnos.duoc.cl"])) {
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
        
        if (correoIngresado === "admin@inacap.cl") {
            localStorage.removeItem("usuarioActivo");
            localStorage.removeItem("logout_manual");
            localStorage.setItem("isAdmin", "true");
            
            alert("¡Inicio de sesión como Administrador correcto!");
            document.getElementById("form-login").reset();
            window.location.href = "../../index.html";
            return;
        }

        let esComunidadDuoc = false;
        if (correoIngresado.endsWith("@duoc.cl") || correoIngresado.endsWith("@duocuc.cl") || correoIngresado.endsWith("@alumnos.duoc.cl")) {
            esComunidadDuoc = true;
        }

        // INTEGRACIÓN GAMIFICACIÓN: Carga con perfil y puntos iniciales por defecto
        const datosUsuario = {
            run: "12345678K",
            nombre: correoIngresado.split("@")[0].toUpperCase(), 
            email: correoIngresado,
            aplicaDescuentoEspecial: esComunidadDuoc,
            puntosLevelUp: 150,
            nivelGamer: "Nivel 1 (Noob)"
        };

        localStorage.removeItem("isAdmin");
        localStorage.setItem("usuarioActivo", JSON.stringify(datosUsuario));

        alert(`¡Bienvenido de nuevo, ${datosUsuario.nombre}! Sesión iniciada correctamente.\nNivel: ${datosUsuario.nivelGamer} | Inventario: ${datosUsuario.puntosLevelUp} Pts.`);
        document.getElementById("form-login").reset();
        window.location.href = "../../index.html";
    }
}

/* ==========================================================================
   SECCIÓN C: Validaciones del Formulario de Registro (CON GAMIFICACIÓN)
   ========================================================================== */
function validarFormularioRegistro(e) {
    e.preventDefault();

    limpiarErrores(["run", "nombre", "apellidos", "reg-email", "password", "fecha", "region", "comuna", "direccion"]);
    let esValido = true;
    let esComunidadDuoc = false;

    // 1. Validar RUN
    const runElement = document.getElementById("run");
    if (runElement) {
        const run = runElement.value.trim();
        if (run === "") {
            mostrarError("run", "El RUN es obligatorio.");
            esValido = false;
        } else if (!validarFormFormatRUN(run)) {
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
    const emailElement = document.getElementById("reg-email");
    if (emailElement) {
        const email = emailElement.value.trim().toLowerCase();
        const regexCorreoDuoc = /^[a-zA-Z0-9._%+-]+@duoc(uc)?\.cl$/i;

        if (email === "") {
            mostrarError("reg-email", "El correo electrónico es obligatorio.");
            esValido = false;
        } else if (email.length > 100) {
            mostrarError("reg-email", "El correo no puede superar los 100 caracteres.");
            esValido = false;
        } else if (!regexCorreoDuoc.test(email)) {
            alert("Error: Debes registrarte utilizando un correo institucional válido (@duoc.cl o @duocuc.cl).");
            mostrarError("reg-email", "Debes usar un correo institucional (@duoc.cl o @duocuc.cl).");
            esValido = false;
        } else {
            esComunidadDuoc = true;
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

    // 6. Validar Fecha de Nacimiento
    const fechaInput = document.getElementById("reg-fecha-nacimiento");
    if (fechaInput) {
        const fechaNacimientoInput = fechaInput.value;
        if (fechaNacimientoInput === "") {
            mostrarError("reg-fecha", "La fecha de nacimiento es obligatoria.");
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
                mostrarError("reg-fecha", `Debes ser mayor de 18 años para registrarte. Tu edad actual es ${edad} años.`);
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

    // ==========================================================================
    // EXTENSIÓN: PROCESAMIENTO DE REFERIDOS Y GAMIFICACIÓN AL COMPLETAR REGISTRO
    // ==========================================================================
    if (esValido) {
        const codigoReferidoInput = document.getElementById("codigo-referido");
        const codigoClean = codigoReferidoInput ? codigoReferidoInput.value.trim() : "";
        
        let puntosIniciales = 0;
        let nivelInicial = "Nivel 1 (Noob)";

        if (codigoClean !== "") {
            puntosIniciales = 200; 
            nivelInicial = "Nivel 2 (Explorer)"; 
        }

        const datosUsuario = {
            run: runElement ? runElement.value.trim() : "12345678K",
            nombre: nombreElement ? nombreElement.value.trim().toUpperCase() : "NUEVO GAMER",
            apellidos: apellidosElement ? apellidosElement.value.trim().toUpperCase() : "",
            email: emailElement ? emailElement.value.trim().toLowerCase() : "",
            aplicaDescuentoEspecial: esComunidadDuoc,
            puntosLevelUp: puntosIniciales,
            nivelGamer: nivelInicial
        };

        localStorage.removeItem("isAdmin");
        localStorage.setItem("usuarioActivo", JSON.stringify(datosUsuario));

        if (puntosIniciales > 0) {
            alert(`🎉 ¡Registro exitoso, ${datosUsuario.nombre}!\n\nCódigo de referido detectado. Has desbloqueado el "${datosUsuario.nivelGamer}" y abonamos +200 Puntos LevelUp a tu inventario.`);
        } else {
            alert(`🎮 ¡Registro exitoso, ${datosUsuario.nombre}! Bienvenido a Level-Up Gamer.`);
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
    let esValido = true;

    const nombreElement = document.getElementById("nombre");
    const correoElement = document.getElementById("email");
    const asuntoElement = document.getElementById("asunto");
    const comentarioElement = document.getElementById("mensaje");

    const nombre = nombreElement ? nombreElement.value.trim() : "";
    const correo = correoElement ? correoElement.value.trim() : "";
    const asunto = asuntoElement ? asuntoElement.value.trim() : "";
    const comentario = comentarioElement ? comentarioElement.value.trim() : "";

    if (nombre === "" || correo === "" || asunto === "" || comentario === "") {
        alert("⚠️ Por favor, rellena todos los campos del formulario antes de enviar.");
        return;
    }

    if (nombre.length > 100 || comentario.length > 500) {
        alert("⚠️ El nombre (máx 100) o el mensaje (máx 500) exceden el límite permitido.");
        return;
    }

    if (!validarCorreoConDominio(correo, ["inacap.cl", "profesor.inacap.cl", "gmail.com", "duoc.cl", "duocuc.cl", "alumnos.duoc.cl"])) {
        alert("⚠️ Solo se aceptan correos válidos de la comunidad (Inacap, Duoc) o Gmail.");
        return;
    }

    alert(`🎮 ¡Mensaje Recibido, ${nombre.toUpperCase()}!\nHemos registrado tu consulta sobre "${asunto}". Nos comunicaremos contigo pronto.`);
    document.getElementById("form-contacto").reset();
    
    const currentCharsElement = document.getElementById("current-chars");
    if (currentCharsElement) currentCharsElement.textContent = "0";
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