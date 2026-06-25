/* ==========================================================================
   src/js/productos.js
   Catálogo Oficial de Productos - Level-Up Gamer
   Fuente única de verdad para Home, Productos, Detalle de Producto y Carrito.
   El campo "precioNumerico" se usa para todos los cálculos (cart.js);
   "precio" es solo el string ya formateado para mostrar en pantalla.
   ========================================================================== */

window.catalogoHardware = [
    {
        codigo: "JM001",
        titulo: "Catan",
        categoria: "Juegos de Mesa",
        precio: "$29.990",
        precioNumerico: 29990,
        imagen: "https://i5.walmartimages.com/asr/a1863816-7553-441d-ad37-734a716ed55a.00a63b9153c188bd583dbfd05b191f90.jpeg",
        descripcion: "El célebre juego de estrategia, negociación y colonización. Reúne materias primas, construye pueblos y expande tus dominios para convertirte en el soberano de la isla.",
        destacado: true
    },
    {
        codigo: "JM002",
        titulo: "Carcassonne",
        categoria: "Juegos de Mesa",
        precio: "$24.990",
        precioNumerico: 24990,
        imagen: "https://i5.walmartimages.cl/asr/5e0f858c-e687-4f05-8726-ac9a2d46296c.7c1b8264366f4112b169ce70a23e8531.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        descripcion: "Un juego clásico de tablero moderno. Crea tu propio mapa medieval loseta a loseta, desplegando a tus seguidores como caballeros, bandidos, monjes o campesinos para sumar puntos de victoria.",
        destacado: false
    },
    {
        codigo: "AC001",
        titulo: "Controlador Inalámbrico Xbox Series X",
        categoria: "Accesorios",
        precio: "$59.990",
        precioNumerico: 59990,
        imagen: "https://i5.walmartimages.cl/asr/e53427b4-1133-4a53-93c8-9774f0385073.ad9f942fce2f82f3b36e538ba0c8dd5b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        descripcion: "Experimenta el diseño modernizado del mando inalámbrico de Xbox, con superficies esculpidas y geometría refinada para una mayor comodidad. Totalmente compatible con consolas Xbox, PC y dispositivos móviles.",
        destacado: true
    },
    {
        codigo: "AC002",
        titulo: "Auriculares Gamer HyperX Cloud II",
        categoria: "Accesorios",
        precio: "$79.990",
        precioNumerico: 79990,
        imagen: "https://http2.mlstatic.com/D_NQ_NP_953165-CBT112200835901_052026-O.webp",
        descripcion: "Proporcionan un sonido envolvente de alta fidelidad virtual 7.1 con un micrófono desmontable con cancelación de ruido y almohadillas de espuma viscoelástica para una comodidad insuperable.",
        destacado: false
    },
    {
        codigo: "CO001",
        titulo: "PlayStation 5",
        categoria: "Consolas",
        precio: "$549.990",
        precioNumerico: 549990,
        imagen: "https://media.solotodo.com/media/products/1979309_picture_1731571228.jpg",
        descripcion: "La potente consola de última generación de Sony, que ofrece trazado de rayos para gráficos fotorrealistas, SSD de velocidad ultra alta para tiempos de carga mínimos y audio 3D inmersivo.",
        destacado: true
    },
    {
        codigo: "CG001",
        titulo: "PC Gamer ASUS ROG Strix",
        categoria: "Computadores Gamers",
        precio: "$1.299.990",
        precioNumerico: 1299990,
        imagen: "https://media.spdigital.cl/thumbnails/products/ygse9ue7_b405ce7d_thumbnail_512.jpg",
        descripcion: "Un potente equipo de escritorio optimizado para esports y streaming, equipado con hardware de vanguardia para asegurar altos FPS estables y refrigeración térmica inteligente de nivel premium.",
        destacado: false
    },
    {
        codigo: "SG001",
        titulo: "Silla Gamer Secretlab Titan",
        categoria: "Sillas Gamers",
        precio: "$349.990",
        precioNumerico: 349990,
        imagen: "https://m.media-amazon.com/images/I/410uYasNqFL._AC_UF894,1000_QL80_.jpg",
        descripcion: "Silla ergonómica galardonada mundialmente, construida con materiales de alta calidad que entregan un soporte lumbar ajustable integrado y adaptabilidad absoluta para extensas jornadas.",
        destacado: false
    },
    {
        codigo: "MS001",
        titulo: "Mouse Gamer Logitech G502 HERO",
        categoria: "Mouse",
        precio: "$49.990",
        precioNumerico: 49990,
        imagen: "https://media.spdigital.cl/thumbnails/products/snbujg5__29f7dd61_thumbnail_4096.jpg",
        descripcion: "Equipado con el sensor óptico avanzado HERO 25K, 11 botones completamente programables, pesas ajustables individuales y tecnología de iluminación RGB LIGHTSYNC personalizable.",
        destacado: true
    },
    {
        codigo: "MP001",
        titulo: "Mousepad Razer Goliathus Extended Chroma",
        categoria: "Mousepad",
        precio: "$29.990",
        precioNumerico: 29990,
        imagen: "https://prophonechile.cl/wp-content/uploads/2023/02/goliathusex.png",
        descripcion: "Superficie de tela microtexturizada de tamaño extendido optimizada para todos los sensores de mouse. Ofrece bordes iluminados por ecosistema RGB Razer Chroma con sincronización.",
        destacado: false
    },
    {
        codigo: "PP001",
        titulo: "Polera Gamer Personalizada 'Level-Up'",
        categoria: "Poleras Personalizadas",
        precio: "$14.990",
        precioNumerico: 14990,
        imagen: "../assets/polera_levelup.png",
        descripcion: "Camiseta confeccionada en algodón premium transpirable de alta comodidad. Incluye la personalización exclusiva de tu Gamertag o logotipo en alta definición para eventos y streams.",
        destacado: false
    }
];

/**
 * Nota de rutas de imágenes: las imágenes locales (ej. PP001) están escritas
 * en formato relativo "../assets/...", pensado para ser usadas desde
 * src/components/*.html. Si el catálogo se usa desde index.html (en la raíz),
 * la imagen se reescribe automáticamente con un prefijo "src/" para que
 * siga funcionando en cualquier vista.
 */
(function corregirRutasSegunUbicacion() {
    const esRaiz = !window.location.pathname.includes("/components/") &&
                   !window.location.pathname.includes("/admin/");
    if (esRaiz) {
        window.catalogoHardware.forEach(prod => {
            if (prod.imagen.startsWith("../assets/")) {
                prod.imagen = "src/assets/" + prod.imagen.replace("../assets/", "");
            }
        });
    }
})();
