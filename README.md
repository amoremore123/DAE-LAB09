# DAE LAB13 — Estructura de comercio electrónico (Tienda Aura)

Alumna: Amore Salcedo Macedo · Parte del proyecto del laboratorio 12.

## Reparto entre servidor y cliente

| Carpeta | Tecnología | Responsabilidad |
|---|---|---|
| `server/` | Django 6 + Django REST Framework + django-cors-headers | Modelos `Category` y `Product` (app `catalog`), administrador, API REST en `/api/`, imágenes en `/media/` |
| `client/` | React 19 + Vite + Axios + React Router | Catálogo, filtro por categoría, alta, edición y borrado. Todo el acceso al API pasa por `src/services/` |

### API del catálogo

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/categories/` | Listar categorías |
| GET | `/api/products/` | Listar productos con la categoría anidada |
| GET | `/api/products/?category=<id>` | Filtrar por categoría |
| GET / PATCH / DELETE | `/api/products/<id>/` | Obtener, modificar y eliminar |
| POST | `/api/products/` | Crear (multipart, admite imagen) |

## Levantar el servidor (puerto 8013)

```powershell
cd server
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_catalog      # 3 categorías y 9 productos con imagen
.\.venv\Scripts\python.exe manage.py createsuperuser   # para entrar a /admin/
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8013
```

CORS acepta `http://127.0.0.1:5173` y `http://localhost:5173`. Para cambiarlo, define `DJANGO_CORS_ORIGINS`.

## Levantar el cliente (puerto 5173)

```powershell
cd client
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

La dirección del API se configura solo en `src/services/apiClient.js`. Por defecto es `http://127.0.0.1:8013/api/`; se puede cambiar con `VITE_API_URL`.

## Estructura del cliente

- `src/services/`: `apiClient.js` (Axios), `productService.js`, `categoryService.js` y `examService.js` (lab 12).
- `src/pages/`: `CatalogPage` (`/`), `ProductFormPage` (`/products/new` y `/products/:id/edit`) y `CinemaPage` (`/cartelera`, labs 9–12).
- `src/components/`: `ProductCard`, `CategoryFilter` y los componentes de laboratorios anteriores.

## Verificación

```powershell
cd server; .\.venv\Scripts\python.exe manage.py test catalog quiz
cd client; npm run lint; npm run build
```

Las evidencias están en `evidencias/` y el entregable es `GLAB-S13-MMONTGOMERY-2026-02.docx`.
