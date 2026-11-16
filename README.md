# Users & Posts

Aplicación web desarrollada con **React, TypeScript y Vite** que permite consultar usuarios y sus publicaciones utilizando la API pública de [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

El proyecto se ha desarrollado de forma incremental, utilizando Git para registrar el progreso y pruebas automatizadas para verificar las funcionalidades principales.

## Funcionalidades

- Listado de usuarios obtenidos desde JSONPlaceholder.
- Búsqueda de usuarios por nombre en tiempo real.
- Selección de un usuario para consultar sus publicaciones.
- Formulario para crear publicaciones con título y contenido obligatorios.
- Validación de campos vacíos o compuestos únicamente por espacios.
- Visualización inmediata de las publicaciones creadas.
- Conservación de publicaciones locales al cambiar de usuario.
- Estados visibles de carga y error.
- Diseño responsive para escritorio y dispositivos móviles.

**Nota:** JSONPlaceholder simula las peticiones POST, pero no guarda realmente los datos. Por este motivo, las publicaciones creadas se almacenan en el estado de React y se pierden al recargar la página.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Fetch API
- Vitest
- React Testing Library
- Testing Library User Event
- jest-dom
- Git

## Requisitos previos

Tener instalados Node.js y npm en versiones compatibles con las dependencias del proyecto.

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone  https://github.com/dvidaillet/users-posts-app.git
cd users-posts-app
```

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la dirección local que muestre Vite, normalmente `http://localhost:5173`.

## Pruebas automatizadas

Ejecutar las pruebas una sola vez:

```bash
npm run test:run
```

Ejecutarlas en modo observación:

```bash
npm test
```

Las pruebas cubren:

1. Validación de campos obligatorios.
2. Envío de un formulario válido.
3. Limpieza de campos después de crear una publicación.
4. Búsqueda de usuarios por nombre.
5. Selección de usuario y visualización de publicaciones.
6. Manejo de errores al cargar usuarios.
7. Manejo de errores al cargar publicaciones.
8. Creación y visualización de una publicación nueva.

## Compilación de producción

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist/`.

## Estructura del proyecto

```text
src/
├── api/
│   ├── users.ts
│   └── posts.ts
├── components/
│   ├── UserCard.tsx
│   ├── PostList.tsx
│   ├── PostForm.tsx
│   └── PostForm.test.tsx
├── test/
│   └── setup.ts
├── types/
│   ├── user.ts
│   └── post.ts
├── App.tsx
├── App.test.tsx
├── index.css
└── main.tsx
```

### Separación de responsabilidades

Se organizaron las funciones HTTP en `src/api`, las interfaces TypeScript en `src/types` y los componentes visuales en `src/components`.

Esto facilita la lectura, el mantenimiento y las pruebas.

### Gestión del estado

Se utilizó `useState` para gestionar usuarios, búsqueda, usuario seleccionado, publicaciones y estados de carga y error.

Se utilizó `useEffect` para consultar la API y actualizar las publicaciones cuando cambia el usuario seleccionado.

No se incorporó una librería global de estado porque la complejidad del proyecto no lo requiere.

### Búsqueda local

Los usuarios se obtienen una vez desde la API y se filtran en memoria mediante `filter()`.

Se evita realizar una petición HTTP por cada carácter introducido.

### Creación de publicaciones

El formulario realiza una petición POST a JSONPlaceholder.

Como la API no persiste los cambios, las publicaciones creadas correctamente se almacenan en un estado local independiente de las publicaciones obtenidas del servidor.

Esto permite conservarlas al cambiar entre usuarios sin modificar los datos originales.

### Validación

Los campos de título y contenido son obligatorios.

Se utiliza `trim()` para impedir que un campo compuesto únicamente por espacios se considere válido.

Los errores aparecen junto al campo correspondiente.

### Pruebas

Se eligió Vitest por su integración con Vite y React Testing Library para probar la interfaz desde la perspectiva del usuario.

Las llamadas a la API se simulan mediante mocks para evitar que las pruebas dependan de la conexión a Internet o de la disponibilidad de JSONPlaceholder.

## Qué mejoraría con más tiempo

- Añadir pruebas para cambios rápidos entre usuarios y peticiones simultáneas.
- Mejorar la cancelación de solicitudes mediante `AbortController`.
- Implementar un botón para reintentar peticiones fallidas.
- Guardar las publicaciones locales en `localStorage`.
- Añadir paginación o carga progresiva de publicaciones.
- Mejorar los indicadores visuales de carga.
- Ampliar las pruebas de accesibilidad.
- Implementar una validación más estricta de los datos recibidos de la API.


## Historial de desarrollo

El repositorio contiene commits independientes que muestran la evolución del proyecto:

- Configuración inicial de React y TypeScript.
- Limpieza de la plantilla.
- Integración de la API.
- Búsqueda de usuarios.
- Selección de usuarios y consulta de publicaciones.
- Creación y validación de publicaciones.
- Configuración y ampliación de pruebas.
- Documentación final.

El historial completo puede consultarse mediante:

```bash
git log --oneline
```

## API utilizada

[JSONPlaceholder](https://jsonplaceholder.typicode.com/)

Endpoints:

- `GET /users`
- `GET /posts?userId={id}`
- `POST /posts`
