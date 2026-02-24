# NOCTIS — API REST Backend

API REST para la gestión de productos de un bar, desarrollada con **TypeScript** y **Express**, siguiendo el patrón **MVC**. Incluye autenticación con JWT, validación con Zod y filtrado mediante query params.

---

## 📱 Diseño responsivo

El proyecto está pensado con dos vistas diferenciadas según el dispositivo:

- **Menú (cliente):** optimizado para **mobile** — los clientes acceden desde su celular para explorar la carta, usar el modo TinderMode y armar su pedido.
- **Admin (gestión):** optimizado para **desktop** — el personal del bar gestiona productos, asigna mood tags y administra el catálogo desde una computadora.

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| TypeScript | Lenguaje principal |
| Express | Framework HTTP |
| MongoDB + Mongoose | Base de datos y ODM |
| Zod | Validación de datos |
| bcryptjs | Hash de contraseñas |
| JWT | Autenticación |
| dotenv | Variables de entorno |
| cors | Solicitudes externas |

---

## 📁 Arquitectura del proyecto

```
src/
├── controllers/     # Lógica de negocio (MVC - Controlador)
│   ├── products.controller.ts
│   └── auth.controller.ts
├── models/          # Esquemas Mongoose (MVC - Modelo)
│   ├── product.model.ts
│   └── user.model.ts
├── routers/         # Definición de rutas
│   ├── products.router.ts
│   └── auth.router.ts
├── middleware/      # Autenticación JWT
│   └── auth.middleware.ts
├── validators/      # Esquemas Zod
│   ├── productValidator.ts
│   └── authValidator.ts
└── index.ts         # Entry point
```

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd TP-Backend
```

### 2. Instalar dependencias del backend
```bash
npm install
```

### 3. Instalar dependencias del frontend (opcional)
```bash
cd client
npm install
```

### 4. Configurar variables de entorno
Crear un archivo `.env` en la raíz basándose en `.env.example`:
```env
PORT=3000
URI_DB=tu_string_de_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES=1h
```

### 5. Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

---

## 🛣️ Endpoints

### Autenticación — Públicos

#### `POST /auth/register`
Crea un nuevo usuario administrador.
```json
{
  "email": "admin@noctis.com",
  "password": "password123"
}
```

#### `POST /auth/login`
Devuelve un token JWT al validar credenciales.
```json
{
  "email": "admin@noctis.com",
  "password": "password123"
}
```
**Respuesta:**
```json
{
  "success": true,
  "data": "<jwt_token>"
}
```

---

### Productos — Lectura pública / Escritura protegida

#### `GET /products`
Obtiene todos los productos. Soporta filtrado por **query params**:

| Param | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `category` | string | Filtra por categoría (regex, case-insensitive) | `?category=Cocktails` |
| `tags` | string | Filtra por mood tag del TinderMode | `?tags=party` |

```bash
# Todos los productos
GET http://localhost:3000/products

# Por categoría
GET http://localhost:3000/products?category=Cervezas

# Por mood tag
GET http://localhost:3000/products?tags=party
```

#### `POST /products` 🔒
Crea un producto. Requiere Bearer Token.
```json
{
  "name": "Margarita Clásica",
  "price": 7800,
  "stock": 30,
  "category": "Cocktails",
  "description": "Un equilibrio perfecto entre fuerza y frescura. Tequila reposado, jugo de lima y triple sec. Servido en copa coupe con borde de sal fina y una rodaja de lima fresca.",
  "image": "https://i.imgur.com/23aWjoi.png",
  "tags": ["refrescante", "classy", "picante"]
}
```

#### `PATCH /products/:id` 🔒
Actualiza parcialmente un producto. Requiere Bearer Token y ser el dueño.
```json
{
  "price": 3800,
  "tags": ["classy", "romantico"]
}
```

#### `DELETE /products/:id` 🔒
Elimina un producto. Requiere Bearer Token y ser el dueño.

---

## 🧪 Colección Bruno

En la carpeta `/collections` se encuentran los archivos `.bru` para probar todos los endpoints con [Bruno](https://www.usebruno.com/).

Para usarlos: abrir Bruno → Open Collection → seleccionar la carpeta `/collections`.

---

## 🔐 Seguridad

- Las contraseñas se hashean con **bcryptjs** antes de guardarse
- Las rutas de escritura requieren un JWT válido en el header `Authorization: Bearer <token>`
- Cada producto está asociado a un `user` — solo el dueño puede editarlo o eliminarlo
- El token expira según `JWT_EXPIRES` (por defecto `1h`)

---

## 🤖 Herramientas de IA utilizadas

Este proyecto fue desarrollado con asistencia de inteligencia artificial en dos frentes:

### 💬 Claude (Anthropic) — Generación de código
Se utilizó **Claude** como asistente de desarrollo para la generación y revisión de código tanto del frontend (React + CSS) como del backend (TypeScript + Express). Esto incluyó componentes, lógica de negocio, estilos, validaciones y estructura general del proyecto.

---

### 🎨 Gemini (Google) — Generación de imágenes
Se utilizó **Gemini** para generar las imágenes de los productos de la carta. Cada imagen fue creada a partir de un prompt descriptivo con estilo fotográfico profesional de bar nocturno.

#### Ejemplo de prompt utilizado

```
🍸 MARGARITA CLÁSICA
Ultra-realistic photographic image of a professionally crafted cocktail in a high-end cocktail bar at night. Dark, moody nightlife atmosphere, black stone bar counter, low warm lighting with subtle neon reflections, cinematic contrast, soft shadows, shallow depth of field. The cocktail is perfectly served in a chilled glass with natural condensation, realistic liquid texture and reflections. Fresh ingredients placed naturally on the bar surface. Professional food and beverage photography, macro details, studio-quality lighting, ultra-high realism, no text, no logos, no people, no hands, no bartender, centered composition, square format, premium cocktail menu style.
The cocktail is a classic Margarita: crystal-clear to pale lime-colored cocktail made with tequila, fresh lime juice and triple sec, served in a chilled coupe glass with a lightly salted rim and garnished with a fresh lime wheel.
```
