# Level-Up Gamer 🎮

Tienda online de productos para gamers en Chile, desarrollada como proyecto académico (Evaluación 2 - TI3V31) utilizando **HTML5, CSS3 y JavaScript Vanilla**, sin frameworks ni librerías externas.

## 📁 Estructura del proyecto

```
levelupgamer2/
├── index.html                     # Página principal (Home)
├── src/
│   ├── admin/
│   │   └── panel.html             # Panel administrativo (Mantenedores)
│   ├── assets/                    # Imágenes propias (logo, banners, merchandising)
│   ├── components/                # Vistas públicas de la tienda
│   │   ├── productos.html         # Catálogo completo de productos
│   │   ├── producto-detalle.html  # Detalle de un producto + añadir al carrito
│   │   ├── carrito.html           # Carrito de compras
│   │   ├── registro.html          # Registro de usuario
│   │   ├── login.html             # Inicio de sesión
│   │   ├── nosotros.html          # Quiénes somos / Misión / Visión
│   │   ├── blogs.html             # Listado de artículos del blog
│   │   ├── blog-detalle-*.html    # Detalle de cada artículo del blog
│   │   └── contacto.html          # Formulario de contacto
│   ├── css/
│   │   ├── variables.css          # Paleta de colores y tipografías
│   │   ├── layout.css             # Header, footer y estructura general
│   │   ├── componentes.css        # Tarjetas, formularios, modales, blog, etc.
│   │   ├── tienda.css             # Estilos específicos del carrito
│   │   └── admin.css              # Estilos del panel administrativo
│   └── js/
│       ├── productos.js           # Catálogo de productos (fuente única de datos)
│       ├── cart.js                # Motor del carrito de compras (localStorage)
│       ├── main.js                # Navegación, menú hamburguesa y render del Home
│       ├── validaciones.js        # Validaciones de Login, Registro y Contacto
│       ├── comunas.js             # Base de datos de Regiones y Comunas de Chile
│       ├── datos_admin.js         # Datos semilla y render de tablas del admin
│       └── validaciones_admin.js  # Validaciones y CRUD del panel administrativo
└── README.md
```

## 🛒 Carrito de compras

El carrito usa una única fuente de verdad (`src/js/cart.js` + localStorage), por lo que se mantiene sincronizado entre el Home, el Catálogo, el Detalle de Producto y la página de Carrito.

## 🔐 Panel administrativo

Disponible en `src/admin/panel.html`. Permite **crear, editar y eliminar** productos y usuarios. Los datos se guardan en `localStorage`, por lo que los cambios persisten entre sesiones (no requiere backend).

> Nota: este proyecto es 100% frontend. El panel administrativo no cuenta con un sistema de autenticación real conectado a roles (login ≠ panel admin); esa integración queda propuesta como mejora futura cuando se incorpore un backend.

## 🚀 Cómo ejecutar el proyecto

No requiere instalación. Basta abrir `index.html` en un navegador, o servirlo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## 🎨 Identidad visual

- **Fondo:** Negro `#000000`
- **Acentos:** Azul Eléctrico `#1E90FF` y Verde Neón `#39FF14`
- **Tipografía de títulos:** Orbitron
- **Tipografía de texto:** Roboto
