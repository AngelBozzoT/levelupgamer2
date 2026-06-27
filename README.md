# Level-Up Gamer 🎮

Tienda online de productos para gamers en Chile, desarrollada como proyecto académico utilizando **HTML5, CSS3 y JavaScript Vanilla**. Cuenta con una arquitectura modular para componentes comunes, optimización de rutas relativas y un sistema dinámico de renderizado en el cliente.

## 📁 Estructura del proyecto

levelupgamer2/
├── index.html                     # Página principal (Home + Anuncio de Lanzamientos)
├── src/
│   ├── admin/
│   │   └── panel.html             # Panel administrativo (Mantenedores)
│   ├── assets/                    # Imágenes propias (logo, banners, merchandising)
│   ├── components/                # Vistas públicas de la tienda
│   │   ├── productos.html         # Catálogo completo de productos
│   │   ├── producto-detalle.html  # Detalle de un producto + añadir al carrito
│   │   ├── carrito.html           # Carrito de compras con convenios institucionales
│   │   ├── registro.html          # Registro de usuario con sistema de referidos
│   │   ├── login.html             # Inicio de sesión
│   │   ├── nosotros.html          # Quiénes somos / Misión / Visión
│   │   ├── blogs.html             # Listado de artículos del blog
│   │   ├── blog-detalle-*.html    # Detalle de cada artículo del blog
│   │   └── contacto.html          # Formulario de contacto + Mapa de Eventos
│   ├── css/
│   │   ├── variables.css          # Paleta de colores y tipografías
│   │   ├── layout.css             # Header, estructura general de rejillas
│   │   ├── componentes.css        # Tarjetas, formularios, modales, blog, etc.
│   │   ├── tienda.css             # Estilos específicos del carrito y anuncios del Home
│   │   └── admin.css              # Estilos del panel administrativo
│   └── js/
│       ├── productos.js           # Catálogo de productos (fuente única de datos)
│       ├── cart.js                # Motor del carrito de compras (localStorage)
│       ├── main.js                # Navegación, barra de usuario, interceptores y footer dinámico
│       ├── validaciones.js        # Validaciones de Login, Registro y Contacto
│       ├── comunas.js             # Base de datos de Regiones y Comunas de Chile
│       ├── datos_admin.js         # Datos semilla y render de tablas del admin
│       └── validaciones_admin.js  # Validaciones y CRUD del panel administrativo
└── README.md


## 🛒 Carrito de compras y Convenios

El carrito usa una única fuente de verdad (`src/js/cart.js` + `localStorage`), por lo que se mantiene sincronizado en toda la plataforma. Adicionalmente, cuenta con un discriminador de correos institucionales que aplica de manera automática un **descuento del 20% para DUOC UC o 12% para INACAP** al procesar el pago.

## 🚀 Características Avanzadas e Interactividad

* **Componentes Dinámicos Basados en Rutas:** El Navbar y el Footer se inyectan mediante scripts capaces de calcular la posición del árbol de directorios (`prefijoComponentes`) para evitar enlaces rotos (Errores 404).
* **Control de Sesiones e Interceptores:** El botón promocional de convenios evalúa el estado de `localStorage`. Si el usuario ya está logueado, se intercepta la redirección y se levanta un modal corporativo de confirmación; si es anónimo, lo envía a registrarse.
* **Sistema de Gamificación:** Mapeo de nivelesgamer (ej: *Nivel 1 Noob*) y acumulación de puntos *LevelUp* visibles desde el menú de usuario.
* **Mapa de Eventos Nacionales:** Vista integrada en contactos con un mapa interactivo estilizado en modo oscuro mediante filtros CSS y un listado de próximos torneos con recompensas en puntos.
* **Próximos Lanzamientos:** Sección publicitaria en el Home que actúa como vitrina de preventa interactiva con soporte de imágenes asíncronas (`object-fit: cover`) sin alterar el core de compras.

## 🔐 Panel administrativo

Disponible en `src/admin/panel.html`. Permite **crear, editar y eliminar** productos y usuarios de forma persistente a través de `localStorage` en el cliente.

## 🛠️ Integraciones de Terceros (CDNs)

* **Lucide Icons:** Utilizado para la renderización asíncrona de íconos vectoriales SVG limpios y responsivos en el footer dinámico.

## 🚀 Cómo ejecutar el proyecto

No requiere instalación. Basta abrir `index.html` en un navegador, o servirlo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
🎨 Identidad visual
Fondo: Negro #000000

Acentos: Azul Eléctrico #1E90FF y Verde Neón #39FF14

Tipografía de títulos: Orbitron

Tipografía de texto: Roboto