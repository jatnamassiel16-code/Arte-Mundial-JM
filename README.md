# ArteMundial 

Proyecto práctico desarrollado para la asignatura **Programación III** en el **Instituto Tecnológico de Las Américas (ITLA)**.

---

## Datos de la Estudiante
* **Nombre:** Jatna Massiel De La Cruz Mejía
* **Carrera:** Tecnólogo en Desarrollo de Software (5to Cuatrimestre)
* **Asignatura:** Programación III
* **Profesor:** Kelyn Tejada

---

##  Descripción del Proyecto
**ArteMundial** es una aplicación web CRUD funcional diseñada para la gestión de obras de arte internacionales. Permite registrar, editar, eliminar y filtrar obras de arte por título, artista y país, además de incluir un módulo completo para el registro y control de compras.

---

##  Metodología Git Flow e Implementación
Para el desarrollo y control de versiones de este proyecto se aplicó rigurosamente la metodología **Git Flow**, cumpliendo con los estándares de integración continua y control de cambios solicitados en la práctica.

###  Ramas utilizadas en el repositorio:
* **`main`**: Rama principal que contiene la versión estable y final de producción.
* **`qa`**: Rama de pruebas y aseguramiento de calidad antes de pasar a producción.
* **`dev` / `developer`**: Rama de integración para el desarrollo continuo de las funcionalidades.
* **Ramas de características (`feature/`) y correcciones (`hotfix/`):**
  * `feature/agregar-obras`
  * `feature/editar-obras`
  * `feature/eliminar-obras`
  * `feature/buscar-obras`
  * `feature/galeria-estilos-crud`
  * `hotfix/corregir-validacion`

###  Pull Requests (PRs)
El proyecto cuenta con un total de **16 Pull Requests cerrados y fusionados (Merged)**, distribuidos correctamente a través de los tres niveles del flujo de trabajo:
1. Desde las ramas `feature/` y `hotfix/` hacia **`dev`**.
2. Desde **`dev`** hacia **`qa`**.
3. Desde **`qa`** hacia **`main`**.

---

## 🛠️ Tecnologías y Herramientas Utilizadas
* **Frontend:** HTML5, CSS3 (Diseño responsivo y moderno con variables CSS y tipografías personalizadas).
* **Lógica:** JavaScript (Vanilla / Fetch API para comunicación asíncrona con el backend).
* **Control de Versiones:** Git, GitHub y Git Flow.
