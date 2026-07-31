# ArteMundial 🎨

Marketplace CRUD de obras de arte de todo el mundo. Proyecto desarrollado
siguiendo la metodología **Git Flow**.

## Tecnologías
- Node.js + Express (API REST)
- Almacenamiento en archivo JSON (`data/artworks.json`)
- Frontend en HTML/CSS/JavaScript puro

## Instalación

```bash
npm install
npm start
```

Luego abre http://localhost:3000

## Endpoints de la API

| Método | Ruta                | Descripción                          |
|--------|---------------------|---------------------------------------|
| GET    | /api/artworks        | Lista todas las obras (con filtros)  |
| GET    | /api/artworks/:id     | Obtiene una obra por id              |
| POST   | /api/artworks         | Crea una nueva obra                  |
| PUT    | /api/artworks/:id     | Actualiza una obra existente         |
| DELETE | /api/artworks/:id     | Elimina una obra                     |

## Flujo de ramas (Git Flow)

- `main` → versión estable / producción
- `dev` → integración de features
- `qa` → validación antes de pasar a producción
- `feature/*` y `hotfix/*` → desarrollo de funcionalidades puntuales

Ver `scripts/setup-git-flow.sh` para el detalle de las ramas y Pull Requests
generadas.
