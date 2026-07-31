# Guía para entregar tu proyecto

## 0. Requisitos previos en tu computadora
- Node.js instalado (https://nodejs.org)
- Git instalado (https://git-scm.com)
- GitHub CLI instalado (https://cli.github.com) — necesario para crear y
  cerrar los Pull Requests automáticamente
- Una cuenta de GitHub

## 1. Probar que la app funciona localmente
```bash
cd arte-mundial
npm install
npm start
```
Abre http://localhost:3000 y prueba crear, editar, buscar y eliminar obras.

## 2. Crear el repositorio en GitHub
1. Entra a github.com → "New repository"
2. Nómbralo, por ejemplo, `arte-mundial`
3. **Déjalo vacío** (sin README, sin .gitignore, sin licencia — el script se
   encarga de subir todo)
4. Cópiate la URL (HTTPS o SSH), por ejemplo:
   `https://github.com/tu-usuario/arte-mundial.git`

## 3. Autenticarte con GitHub CLI (una sola vez)
```bash
gh auth login
```
Sigue las instrucciones (elige GitHub.com → HTTPS o SSH → login por navegador).

## 4. Ejecutar el script de Git Flow
Desde la carpeta raíz del proyecto:
```bash
chmod +x scripts/setup-git-flow.sh
./scripts/setup-git-flow.sh https://github.com/tu-usuario/arte-mundial.git
```

Esto va a:
- Subir `main`, crear y subir `dev` y `qa`
- Crear las 5 ramas requeridas:
  - `feature/artwork-crud-api`
  - `feature/artwork-list-ui`
  - `feature/validate-user-input`
  - `feature/search-and-filter`
  - `hotfix/fix-price-format`
- Por cada una, abrir y cerrar (merge) 3 Pull Requests: → dev, → qa, → main
- Total: **15 Pull Requests cerradas**, con `main` totalmente integrado

## 5. Verificar en GitHub
- Pestaña **Pull Requests → Closed**: deberías ver 15
- Pestaña **branches**: main, dev, qa + las 5 feature/hotfix
- El código de `main` debe reflejar todos los cambios

## 6. Entrega en la plataforma
- Campo "Texto en línea": pega solo la URL de tu repositorio
  (ej. `https://github.com/tu-usuario/arte-mundial`)
- Asegúrate de que el repositorio sea **público** (o dale acceso a tu
  profesor si es privado), para que sea accesible sin restricciones
- El documento PDF que pida tu rúbrica (normalmente una evidencia con
  capturas de pantalla de las ramas y los PRs cerrados) lo adjuntas aparte
  como archivo — si quieres, te ayudo a redactarlo también.

## Notas
- Si algún `gh pr create` falla porque ya existe un PR abierto entre las
  mismas ramas, el script simplemente lo salta e intenta el merge; puedes
  volver a correrlo sin problema.
- Si prefieres SSH en vez de HTTPS, usa la URL tipo
  `git@github.com:tu-usuario/arte-mundial.git` (requiere tener tu llave SSH
  configurada en GitHub).
