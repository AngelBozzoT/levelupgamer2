document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el formulario dentro de contacto.html
    const formContacto = document.querySelector("form") || document.getElementById("form-contacto");

    if (formContacto) {
        formContacto.addEventListener("submit", (e) => {
            e.preventDefault(); // Evitamos que la página se recargue agresivamente

            // Captura de campos utilizando los placeholders o nombres estándar
            const nombre = formContacto.querySelector('input[placeholder="Tu nombre"]')?.value.trim();
            const email = formContacto.querySelector('input[placeholder="tu@email.com"]')?.value.trim();
            const asunto = formContacto.querySelector('input[placeholder*="Consulta"]')?.value.trim();
            const mensaje = formContacto.querySelector('textarea')?.value.trim();

            // 1. Validaciones básicas de campos vacíos
            if (!nombre || !email || !asunto || !mensaje) {
                alert("⚠️ Por favor, completa todos los campos del formulario antes de enviar.");
                return;
            }

            // 2. Validación de formato de correo electrónico
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) {
                alert("⚠️ La dirección de correo electrónico no es válida. Por favor, verifícala.");
                return;
            }

            // 3. Simulación de envío exitoso con feedback personalizado
            alert(`🎮 ¡Mensaje Recibido, ${nombre}!\n\nHemos registrado tu consulta sobre "${asunto}". Nuestro equipo de soporte técnico se pondrá en contacto contigo a la brevedad al correo: ${email}`);

            // 4. Limpieza automática del formulario
            formContacto.reset();
        });
    }
});