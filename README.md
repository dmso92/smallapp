# Forma

Mini aplicación SPA para eliminar el fondo de imágenes directamente en el navegador. Forma permite cargar una imagen, comparar el original con el resultado transparente y descargarlo como PNG.

## Características

- Carga imágenes PNG, JPG/JPEG y WebP mediante selector de archivos, arrastrar y soltar, o pegar desde el portapapeles con `Ctrl+V` / `Cmd+V`.
- Procesa las imágenes en el cliente con [`@imgly/background-removal`](https://www.npmjs.com/package/@imgly/background-removal); no requiere backend ni sube la imagen.
- Muestra estados de procesamiento y errores, y presenta una comparación interactiva antes/después.
- Descarga el resultado como PNG transparente, conservando las dimensiones de la imagen original.
- Permite copiar el PNG al portapapeles en navegadores compatibles.

## Requisitos

- Node.js `^22.12.0`, `^24.0.0` o `>=26.0.0`.
- npm.
- Un navegador moderno y conexión a Internet para la descarga inicial de los recursos del modelo y WebAssembly.

## Instalación y desarrollo

Desde la raíz del proyecto:

```bash
npm ci
npm run dev
```

Abre en el navegador la URL que muestra Vite (normalmente `http://localhost:5173`).

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run test` | Ejecuta las pruebas unitarias con Vitest. |
| `npm run build` | Comprueba TypeScript y genera la compilación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. Ejecuta primero `npm run build`. |

Para probar la versión de producción:

```bash
npm run build
npm run preview
```

## Uso

1. Selecciona, arrastra o pega una imagen PNG, JPG/JPEG o WebP.
2. Espera a que el navegador descargue los recursos necesarios y procese la imagen.
3. Mueve el control de comparación: el lado **Original** muestra la imagen inicial y **Sin fondo** muestra el PNG procesado sobre un patrón que representa la transparencia.
4. Descarga el PNG o cópialo al portapapeles.

La primera ejecución puede tardar más porque el modelo y los recursos de WebAssembly se descargan bajo demanda. Si falla la descarga del modelo, recarga la página y selecciona la imagen de nuevo.

## Privacidad y despliegue

La imagen seleccionada y el resultado se procesan localmente en el navegador. La aplicación puede descargar recursos del modelo y WebAssembly desde el origen público configurado por la biblioteca; esos recursos no contienen la imagen del usuario. Al desplegar en otro dominio, verifica que el origen de los recursos permita las solicitudes CORS necesarias.

## Tecnología

- React y TypeScript
- Vite
- Tailwind CSS 4
- `@imgly/background-removal` y `onnxruntime-web`
- Vitest

Consulta la [guía de validación detallada](specs/001-background-removal/quickstart.md) para escenarios manuales y resultados de pruebas.
