document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el formulario de forma segura
    const registroForm = document.getElementById("form-registro") || document.querySelector("form"); 

    if (!registroForm) {
        console.error("❌ ERROR: No se encontró ninguna etiqueta <form> en tu HTML. Asegúrate de envolver tus inputs en un <form>.");
        return;
    }

    console.log("✅ Script de registro vinculado correctamente al formulario.");

    registroForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que la página se recargue
        console.log("🚀 Botón presionado. Iniciando validaciones...");

        // Buscamos los inputs por sus atributos 'type' o 'id' por si acaso cambiaron
        const runInput = document.getElementById("run-input") || document.querySelector("input[type='text']");
        const nombreInput = document.getElementById("nombre-input") || document.querySelectorAll("input[type='text']")[1];
        const correoInput = document.getElementById("correo-input") || document.querySelector("input[type='email']");

        if (!correoInput) {
            alert("Error interno: No se pudo encontrar el campo de correo electrónico en el HTML.");
            return;
        }

        const run = runInput ? runInput.value.trim() : "";
        const nombre = nombreInput ? nombreInput.value.trim() : "";
        const correo = correoInput.value.trim();

        // Validación de correo institucional (admite INACAP o DUOC según corresponda)
        const regexCorreoInst = /^[a-zA-Z0-9._%+-]+@(duoc|inacap)(uc)?\.cl$/i;

        if (!regexCorreoInst.test(correo)) {
            alert("Error: Debes registrarte utilizando un correo institucional válido.");
            return;
        }

        if (correo === "") {
            alert("Por favor, ingresa tu correo electrónico.");
            return;
        }

        // Si todo está correcto:
        alert("¡Usuario registrado con éxito! Bienvenido a Level-Up Gamer.");
        registroForm.reset();
        window.location.href = "./login.html";
    });
});