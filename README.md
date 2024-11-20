# HiTify API

HiTify es una aplicación de música que permite a los usuarios crear y gestionar sesiones de música, así como acceder a una amplia base de datos de canciones. Esta API proporciona los endpoints necesarios para interactuar con la aplicación.

## Endpoints

### Sesiones

#### Crear una sesión

- **URL:** `/api/sessions`
- **Método:** `POST`
- **Descripción:** Crea una nueva sesión de música.
- **Parámetros:**
  - `founder_id` (int): ID del usuario que crea la sesión.
  - `category` (string): Categoría de la sesión.
  - `length` (int): Duración de la sesión en minutos.
- **Respuesta:**
  - `201 Created`: Sesión creada exitosamente.
  - `400 Bad Request`: Parámetros inválidos.

#### Obtener una sesión

- **URL:** `/api/sessions/:founder_id`
- **Método:** `GET`
- **Descripción:** Obtiene los detalles de una sesión específica.
- **Parámetros:**
  - `founder_id` (int): ID del usuario que creó la sesión.
- **Respuesta:**
  - `200 OK`: Detalles de la sesión.
  - `404 Not Found`: Sesión no encontrada.

#### Terminar una sesión

- **URL:** `/api/sessions/:founder_id`
- **Método:** `DELETE`
- **Descripción:** Termina una sesión específica.
- **Parámetros:**
  - `founder_id` (int): ID del usuario que creó la sesión.
- **Respuesta:**
  - `200 OK`: Sesión terminada exitosamente.
  - `404 Not Found`: Sesión no encontrada.

### Canciones

#### Obtener canciones por categoría

- **URL:** `/api/songs`
- **Método:** `GET`
- **Descripción:** Obtiene una lista de canciones filtradas por categoría.
- **Parámetros:**
  - `category_id` (int): ID de la categoría.
  - `limit` (int): Número máximo de canciones a devolver.
- **Respuesta:**
  - `200 OK`: Lista de canciones.
  - `400 Bad Request`: Parámetros inválidos.

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/papiricoh/HiTify.git
    ```

2. Instala las dependencias:
    ```bash
    cd HiTify
    npm install
    ```

3. Configura la base de datos en `config/database.js`.

4. Inicia el servidor:
    ```bash
    npm api
    ```