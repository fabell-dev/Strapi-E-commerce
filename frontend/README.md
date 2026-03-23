# 🛍️ Strapi E-Commerce Frontend

Una aplicación de e-commerce moderna y completa construida con **Next.js 16**, **React 19**, **TypeScript** y **Strapi CMS**. Incluye funcionalidades avanzadas como carrito de compras, pagos con Stripe, sistema de órdenes, reseñas de productos y más.

## 🌐 Demo en Vivo

📱 **Prueba la aplicación:** [https://strapi-e-commerce-vert.vercel.app](https://strapi-e-commerce-vert.vercel.app)

---

## ✨ Características Principales

### 🛒 Gestión del Carrito

- **Carrito persistente** con localStorage
- Manejo de **variantes de productos** (colores, tallas, etc.)
- Control de **stock en tiempo real**
- Prevención de compras que excedan el inventario
- Interfaz intuitiva para actualizar cantidades

### 📦 Catálogo de Productos

- **Navegación por categorías** dinámicas
- **Paginación** eficiente de productos
- **Sistema de búsqueda** global con filtros
- Carrusel de imágenes para cada producto
- Información detallada de variantes y disponibilidad
- Visualización de precios y stock

### 💳 Pagos y Checkout

- Integración con **Stripe** para pagos seguros
- **Checkout embebido** con experiencia integrada
- Validación de datos de facturación
- Proceso de compra en múltiples pasos (billing → payment → confirmación)
- Manejo seguro de transacciones

### 👤 Autenticación y Órdenes

- Sistema de **login/registro** con JWT
- Gestión de **cuenta de usuario** con Strapi
- **Historial de órdenes** completo
- Visualización detallada de cada orden con estado
- Estados de orden: pending, processing, shipped, delivered, completed, cancelled
- Seguimiento de envíos con información de envío

### ❤️ Wishlist

- Guardar productos favoritos
- Gestión con localStorage para usuarios no autenticados
- Paginación de productos en wishlist

### ⭐ Sistema de Reseñas

- Crear reseñas y calificaciones de productos
- Validación de reseñas (solo usuarios autenticados)
- Visualización de calificaciones con estrellas
- Listado de reseñas de otros usuarios

### 📱 Diseño Responsive

- Interfaz totalmente adaptable a dispositivos móviles, tablets y desktop
- Animaciones suaves con Motion library
- Componentes de UI consistentes

## 🏗️ Stack Tecnológico

### Frontend

- **Next.js 16.1.6** - Framework React con SSR/SSG
- **React 19.2.3** - Librería UI moderna
- **TypeScript** - Type-safety y mejor DX
- **Tailwind CSS 4** - Utilidades CSS para estilos
- **Radix UI** - Componentes accesibles
- **Motion** - Animaciones fluidas
- **Embla Carousel** - Carrusel responsivo

### Backend & CMS

- **Strapi CMS** - Gestión de contenido headless
- **PostgreSQL** - Base de datos (Strapi)

### Pagos

- **Stripe** - Procesamiento de pagos seguro
- **@stripe/react-stripe-js** - Componentes Stripe para React

### Herramientas de Desarrollo

- **ESLint** - Linting de código
- **pnpm** - Gestor de paquetes eficiente
- **TypeScript** - Tipado estático

## 📁 Estructura del Proyecto

```
frontend/
├── app/                           # App Router de Next.js
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/                # Página de login
│   │   └── register/             # Página de registro
│   ├── api/                      # Rutas API
│   │   ├── search/               # Endpoint de búsqueda
│   │   └── revalidate/           # Revalidación de caché
│   ├── category/[categoryId]/    # Página de categorías dinámicas
│   ├── product/[slug]/           # Página de producto detallado
│   ├── checkout/                 # Página de checkout
│   ├── orders/                   # Historial de órdenes
│   ├── whishlist/                # Página de wishlist
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # Proveedores de contexto
│
├── components/                    # Componentes React
│   ├── auth/                     # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── Checkout/                 # Componentes de checkout
│   │   ├── CheckoutForm.tsx
│   │   ├── EmbeddedCheckoutWrapper.tsx
│   │   └── StripeProvider.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── Navbar.tsx
│   │   ├── NavbarServer.tsx
│   │   ├── Footer.tsx
│   │   └── LayoutWrapper.tsx
│   ├── MainSection/              # Sección principal de productos
│   │   ├── MainSection.tsx
│   │   ├── MainSectionClient.tsx
│   │   ├── ProductsGrid.tsx
│   │   ├── PaginationGrid.tsx
│   │   └── SortSelector.tsx
│   ├── ProductPage/              # Componentes de página de producto
│   │   ├── ProductLayout.tsx
│   │   ├── Carrousel.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── Reviews.tsx
│   │   ├── StarRating.tsx
│   │   └── HeartWhishlist.tsx
│   ├── ShopingCart/              # Componentes del carrito
│   │   ├── CartContext.tsx       # Contexto global del carrito
│   │   ├── ShoppingCart.tsx
│   │   ├── CartPanel.tsx
│   │   └── AddToCartButton.tsx
│   ├── ui/                       # Componentes UI base (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── pagination.tsx
│   │   └── ...
│   ├── HeroSection.tsx           # Sección hero del home
│   ├── AvatarDropdown.tsx        # Dropdown de usuario
│   └── SuccessPayment.tsx        # Componente de confirmación
│
├── lib/                          # Lógica y utilidades
│   ├── actions/                  # Server actions
│   │   ├── auth-actions.ts       # Login/Register
│   │   ├── product-actions.ts    # Acciones de productos
│   │   ├── orders-actions.ts     # Acciones de órdenes
│   │   ├── review-actions.ts     # Acciones de reseñas
│   │   └── get-auth-token.ts
│   ├── Strapi/                   # Integración con Strapi
│   │   ├── strapi.ts             # Cliente Strapi
│   │   └── Data/
│   │       ├── product-data.ts   # Fetching de productos
│   │       ├── orders-data.ts    # Fetching de órdenes
│   │       ├── home-page.ts      # Datos del home
│   │       └── page-metadata.ts  # Metadatos de páginas
│   ├── utils/
│   │   ├── image-url.ts          # Construcción de URLs de imágenes
│   │   └── utils.ts              # Utilidades generales
│   └── validations/              # Esquemas Zod
│       ├── validationsAuth.ts    # Validación de auth
│       └── validationsReview.ts  # Validación de reseñas
│
├── types/                        # Definiciones de tipos TypeScript
│   ├── product.types.ts          # Tipos de productos
│   ├── orders.types.ts           # Tipos de órdenes
│   └── review-types.ts           # Tipos de reseñas
│
├── next.config.ts                # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
├── package.json                  # Dependencias del proyecto
└── README.md                     # Este archivo
```

## 🚀 Guía de Inicio Rápido

### Requisitos Previos

- Node.js 18+
- pnpm (recomendado) o npm
- Instancia de Strapi ejecutándose
- Cuenta de Stripe (para pagos)

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd frontend
```

2. **Instalar dependencias**

```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Strapi
STRAPI_HOST=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_READ_TOKEN=your_read_token_here
STRAPI_FULLACCESS_TOKEN=your_full_access_token_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Node environment
NODE_ENV=development
```

4. **Ejecutar en modo desarrollo**

```bash
pnpm dev
# o
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para Producción

```bash
pnpm build
pnpm start
```

## 📋 Características Implementadas

### Autenticación ✅

- [x] Registro de usuarios
- [x] Login/Logout
- [x] Validación de credenciales
- [x] Tokens JWT
- [x] Protección de rutas

### Productos ✅

- [x] Listado paginado de productos
- [x] Búsqueda global
- [x] Filtrado por categoría
- [x] Página de detalle de producto
- [x] Sistema de variantes (colores, tallas)
- [x] Gestión de stock
- [x] Carrusel de imágenes

### Carrito de Compras ✅

- [x] Agregar/eliminar productos
- [x] Actualizar cantidades
- [x] Persistencia con localStorage
- [x] Soporte de variantes
- [x] Prevención de overselling
- [x] Cálculo de totales

### Órdenes ✅

- [x] Creación de órdenes
- [x] Historial de órdenes
- [x] Detalles de orden
- [x] Estados de entrega
- [x] Información de envío
- [x] Listado de artículos

### Pagos ✅

- [x] Integración Stripe
- [x] Checkout embebido
- [x] Validación de datos
- [x] Confirmar transacciones
- [x] Manejo de errores de pago

### Reseñas ✅

- [x] Sistema de calificación por estrellas
- [x] Crear reseñas authenticadas
- [x] Visualización de reseñas
- [x] Validación de datos

### Wishlist ✅

- [x] Guardar favoritos
- [x] Listar wishlist
- [x] Persistencia con localStorage
- [x] Agregar/remover de wishlist

### Frontend ✅

- [x] Diseño responsive
- [x] Animaciones suaves
- [x] Componentes accesibles
- [x] Optimización de imágenes
- [x] Caché inteligente con ISR

## 🔑 Variables de Entorno

| Variable                             | Descripción                           | Ejemplo                   |
| ------------------------------------ | ------------------------------------- | ------------------------- |
| `STRAPI_HOST`                        | URL del servidor Strapi (server-side) | `http://localhost:1337`   |
| `NEXT_PUBLIC_STRAPI_URL`             | URL de Strapi pública (client-side)   | `https://api.example.com` |
| `STRAPI_READ_TOKEN`                  | Token de lectura en Strapi            | `abc123...`               |
| `STRAPI_FULLACCESS_TOKEN`            | Token con acceso completo en Strapi   | `xyz789...`               |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe               | `pk_test_...`             |

## 🎨 Características de Diseño

### Componentes UI

- Botones personalizados con animaciones
- Cards responsivas
- Inputs validados
- Dropdowns accesibles
- Paginación inteligente
- Badges de estado
- Separadores

### Animaciones

- Transiciones suaves con Motion
- Efectos de hover
- Animaciones de carga
- Transiciones de página

### Estilos

- **Tailwind CSS 4** para utilidades
- **Temas consistentes** con colores y espaciado
- **Tipografía** Montserrat
- **Modo claro** con fondo ámbar suave

## 🔄 Flujo de Datos

```
User Actions
    ↓
React Components (Client/Server)
    ↓
Server Actions (lib/actions)
    ↓
Strapi API Client (lib/Strapi/strapi.ts)
    ↓
Strapi CMS Backend
    ↓
PostgreSQL Database
```

## 🔐 Seguridad

- ✅ Tokens JWT almacenados en cookies HttpOnly
- ✅ Validación de datos con Zod
- ✅ Protección de rutas autenticadas
- ✅ Prevención de XSS con Content Security Policy
- ✅ CORS configurado en Strapi
- ✅ Uso de HTTPS en producción

## 📊 Rendimiento

- ✅ **ISR (Incremental Static Regeneration)** para caché inteligente
- ✅ **Lazy loading** de imágenes
- ✅ **Code splitting** automático de Next.js
- ✅ **Optimización de fuentes** con Google Fonts
- ✅ **Caché de productos** con revalidación de 2 minutos
- ✅ **Caché de categorías** con revalidación de 1 hora

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo

# Compilación
pnpm build            # Compilar para producción
pnpm start            # Iniciar servidor de producción

# Linting
pnpm lint             # Ejecutar ESLint
```

## 📝 Validaciones

### Autenticación

- Email válido y único
- Contraseña con mínimo 8 caracteres
- Username único
- Confirmación de contraseña coincide

### Reseñas

- Título: 5-100 caracteres
- Descripción: 10-1000 caracteres
- Rating: 1-5 estrellas
- Solo para usuarios autenticados

### Checkout

- Nombre completo requerido
- Email válido requerido
- Dirección válida requerida
- Validación de tarjeta Stripe

## 🐛 Gestión de Errores

- Manejo de errores de API con mensajes claros
- Fallbacks para datos no disponibles
- Validación de estado en el side-client
- Logging de errores en consola para debugging

## 🚢 Deployment

### Verificaciones previas

```bash
pnpm lint    # Verificar código
pnpm build   # Verificar compilación
```

### Plataformas recomendadas

- **Vercel** (recomendado para Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

## 📚 Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Strapi](https://docs.strapi.io)
- [Documentación Stripe](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver el archivo LICENSE para más detalles.

## 👨‍💻 Autor

Desarrollado por Fabian - [GitHub](https://github.com/fabell-dev)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
