/* ==========================================================================
   PASO 1: Lógica de Regiones y Comunas Dinámicas (Local)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener referencias de los elementos del DOM del formulario de Registro
    const selectRegion = document.getElementById("region");
    const selectComuna = document.getElementById("comuna");

    // Verificar que los elementos existan en la página actual (evita errores en otras vistas)
    if (selectRegion && selectComuna) {
        inicializarUbicaciones(selectRegion, selectComuna);
    }
});

/**
 * Carga las regiones de la base de datos local y configura el evento de cambio.
 */
function inicializarUbicaciones(selectRegion, selectComuna) {
    // Recuperar los datos globales definidos en comunas.js
    const datosRegiones = window.regionesData;

    if (!datosRegiones) {
        console.error("Error: No se encontraron los datos de regionesData. Asegúrate de cargar src/js/comunas.js antes en el HTML.");
        return;
    }

    // Poblar el select de Regiones
    datosRegiones.forEach(region => {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.nombre;
        selectRegion.appendChild(option);
    });

    // Escuchar cuando el usuario cambia de región
    selectRegion.addEventListener("change", (e) => {
        const regionSeleccionadaId = e.target.value;

        // Limpiar el selector de comunas conservando solo la opción por defecto
        selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';

        if (regionSeleccionadaId === "") {
            // Si vuelve a la opción vacía, deshabilitar el select de comunas
            selectComuna.disabled = true;
        } else {
            // Buscar el objeto de la región seleccionada
            const regionEncontrada = datosRegiones.find(r => r.id === regionSeleccionadaId);

            if (regionEncontrada) {
                // Habilitar el selector de comunas
                selectComuna.disabled = false;

                // Poblar las comunas correspondientes
                regionEncontrada.comunas.forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna.toLowerCase().replace(/\s+/g, "_"); // Valor formateado
                    option.textContent = comuna;                             // Texto legible
                    selectComuna.appendChild(option);
                });
            }
        }
    });
}