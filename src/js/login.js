/* ==========================================================================
   Lógica de Autenticación - Control de Acceso de Administrador
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("form-login"); // Asegúrate de que tu <form> de login tenga este ID

    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            e.preventDefault();

            // Capturar los campos del formulario
            const userInput = document.getElementById("login-username");
            const passInput = document.getElementById("login-password");
            const errLogin = document.getElementById("error-login-global"); // Por si tienes un span de error general

            if (!userInput || !passInput) return;

            const usuario = userInput.value.trim();
            const password = passInput.value.trim();

            // Credenciales estáticas exigidas para la entrega/evaluación
            if (usuario === "admin" && password === "admin123") {
                // 1. Guardar el estado activo en LocalStorage
                localStorage.setItem("isAdmin", "true");
                
                // 2. Alerta de éxito y redirección al index principal
                alert("¡Autenticación exitosa! Bienvenido al sistema, Administrador.");
                window.location.href = "../../index.html"; 
            } else {
                // Manejo de error si las credenciales fallan
                if (errLogin) {
                    errLogin.innerText = "Usuario o contraseña incorrectos.";
                } else {
                    alert("Credenciales incorrectas. Intenta con admin / admin123");
                }
            }
        });
    }
});