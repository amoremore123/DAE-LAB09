# DAE LAB09 — Cine Aura
Alumna: Amore Salcedo Macedo.

Cartelera ficticia creada con React y Vite. Ocho películas con imagen SVG local, sinopsis, clasificación, valoración y horarios.

## Ejecutar
```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5179
```
## Verificar
```sh
npm run build
npm run lint
```
## Componentes
App compone Header, Hero, MovieList y Footer. Hero recibe movie; MovieList recibe movies y crea MovieCard mediante map y key. Cada componente tiene su propia carpeta.

Datos: src/data/movies.js. CSS: src/styles/tokens.css, base.css y components.css importados desde index.css. La guía no incluye otro esquema CSS detallado; se separaron variables, base y componentes.

## Pruebas de errores
Los ejemplos aislados en lab-examples reproducen los tres errores solicitados sin romper la aplicación principal. No forman parte de la compilación final. Ver lab-examples/README.md.

Los afiches son ilustraciones vectoriales originales y las películas y el contacto son ficticios para esta práctica.
