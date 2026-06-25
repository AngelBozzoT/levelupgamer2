/* ==========================================================================
   Base de Datos Local: Regiones y Comunas de Chile
   ========================================================================== */

const regionesDeChile = [
    {
        id: "reg_antofagasta",
        nombre: "Región de Antofagasta",
        comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal"]
    },
    {
        id: "reg_valparaiso",
        nombre: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "San Felipe", "Los Andes"]
    },
    {
        id: "reg_metropolitana",
        nombre: "Región Metropolitana de Santiago",
        comunas: ["Santiago","Las Condes","Vitacura","Providencia","La Reina","Lo Barnechea","Ñuñoa","La Florida","La Pintana",
                "Puente Alto","San Bernardo","La Granja","San Ramón","El Bosque","La Cisterna","San Joaquín",
                "San Miguel","Pedro Aguirre Cerda","Macul","Maipú","Pudahuel","Estación Central","Cerrillos","Lo Espejo",
                "Lo Prado","Recoleta","Independencia","Conchalí","Quilicura","Renca","Huechuraba","Cerro Navia","Quinta Normal"]
    },
    {
        id: "reg_biobio",
        nombre: "Región del Bío-Bío",
        comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chillán", "Los Ángeles", "Coronel", "Chiguayante"]
    },
    {
        id: "reg_araucania",
        nombre: "Región de la Araucanía",
        comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria"]
    },
    {
        id: "reg_los_lagos",
        nombre: "Región de Los Lagos",
        comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas"]
    }
];

// Hacer el arreglo accesible globalmente en el entorno del navegador
window.regionesData = regionesDeChile;