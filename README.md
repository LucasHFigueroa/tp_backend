# Backend API - Gestión de Productos con Autenticación

Este proyecto es un servidor backend desarrollado con **Node.js** y **Express** que implementa un sistema de gestión de productos. La aplicación sigue el patrón de diseño **MVC** (Modelo-Vista-Controlador), utiliza **MongoDB** para la persistencia de datos y asegura las rutas mediante **JSON Web Tokens (JWT)**.

---

## 🚀 Características
* **Autenticación segura:** Registro e inicio de sesión con hashing de contraseñas mediante `bcryptjs`.
* **Rutas Protegidas:** Los productos están asociados a un usuario específico y solo pueden ser gestionados por su dueño mediante un token JWT.
* **Validación de Datos:** Control de formatos de email y longitud de contraseñas.

---

## 📋 Requisitos Previos
* [Node.js](https://nodejs.org/) 
* [MongoDB](https://www.mongodb.com/)

---

## ⚙️ Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```consola
    git clone <url-del-repositorio>
    cd tp-backend
    npm install
    ```

2.  **Instalar dependencias:**
    ```consola
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:
    ```env
    PORT=3000
    URI_DB=tu_string_de_mongo
    JWT_SECRET=tu_secreto_para_jwt
    JWT_EXPIRES=1h
    ```

4.  **Iniciar el servidor (Modo Desarrollo):**
    ```consola
    npm run dev
    ```

---

## 🛣️ Endpoints y Ejemplos de Requests

### 1. Autenticación (Públicos)

* **POST** `/api/auth/register`
    * **Descripción:** Crea un nuevo usuario.
    * **Cuerpo (JSON):**
    ```json
    {
      "email": "lucas@ejemplo.com",
      "password": "password123"
    }
    ```

* **POST** `/api/auth/login`
    * **Descripción:** Valida credenciales y devuelve un token JWT.
    * **Cuerpo (JSON):**
    ```json
    {
      "email": "lucas@ejemplo.com",
      "password": "password123"
    }
    ```

---

### 2. Productos (Privados - Requieren Bearer Token)

* **POST** `/products`
    * **Descripción:** Crea un producto asociado al usuario logueado.
    * **Cuerpo (JSON):**
    ```json
    {
      "name": "Monitor Gamer 24\"",
      "price": 45000,
      "stock": 5,
      "category": "Electrónica",
      "description": "144Hz, 1ms de respuesta"
    }
    ```

* **GET** `/products`
    * **Descripción:** Obtiene todos los productos creados por el usuario autenticado.

* **PATCH** `/products/:id`
    * **Descripción:** Actualiza parcialmente un producto (ej. precio o stock).
    * **Cuerpo (JSON):**
    ```json
    {
      "price": 48000,
      "stock": 3
    }
    ```

* **DELETE** `/products/:id`
    * **Descripción:** Elimina un producto de la base de datos (solo si el usuario es el dueño).

---

## 🧪 Pruebas

En la carpeta collections/ se incluyen los archivos .bru para realizar pruebas de los endpoints utilizando Bruno.