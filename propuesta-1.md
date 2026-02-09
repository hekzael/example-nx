# Propuesta de Aplicación: Plataforma de Gestión de Ciclo de Vida y Permisos

> [!WARNING]
> Este documento ha sido consolidado en [docs/propuesta-final.md](docs/propuesta-final.md). Por favor referirse a ese archivo como la fuente de verdad definitiva.

## 1. Visión y Objetivos

El objetivo es desarrollar una plataforma centralizada y escalable para gestionar el ciclo de vida de desarrollo de múltiples proyectos, orquestando permisos, equipos y operaciones críticas (despliegues, scripts, configuraciones) de manera segura y auditable.

**Principales Metas:**

- **Escalabilidad:** Separar la definición de permisos (Roles) de la asignación de personas (Equipos), permitiendo crecer en proyectos y usuarios sin reconfigurar todo el sistema.
- **Seguridad Granular:** Control de acceso basado en el contexto `Proyecto -> Módulo -> Entorno`.
- **Auditoría Total:** Trazabilidad completa de quién autorizó y ejecutó cada acción crítica.
- **Flexibilidad Operativa:** Soporte para flujos de aprobación configurables y roles temporales (suplencias).

---

## 2. Modelo de Dominio (Core)

El sistema se estructura en torno a tres pilares fundamentales alineados con el diseño guiado por el dominio (DDD):

### 2.1 Estructura Organizativa (Jerarquía de Recursos)

1.  **Proyecto (Project):**
    - Unidad de negocio o producto (ej. "E-commerce B2B", "App Mobile").
    - Define sus propios **Entornos** (ej. Dev, Staging, Prod) y reglas de negocio.
2.  **Módulo (Module):**
    - Subdivisión funcional de un proyecto (ej. "Catálogo", "Pagos", "Logística").
    - Permite segmentar la responsabilidad de los equipos.
3.  **Entorno (Environment):**
    - Etapa en el ciclo de vida del software.
    - Configurable por proyecto (ej. Un proyecto crítico puede tener `Pre-Prod` y otro no).

### 2.2 Actores y Equipos

1.  **Usuario (User):**
    - Persona física autenticada en la plataforma.
2.  **Equipo (Team):**
    - Unidad operativa asignada a uno o más **Módulos** de un **Proyecto**.
    - Es el nexo entre el Usuario y el Recurso (Proyecto/Módulo).
    - **Roles Internos del Equipo:**
      - `Líder Principal`: Responsable administrativo del equipo. Unique.
      - `Líder Temporal`: Suplente con vigencia definida (start/end date).
      - `Miembro`: Integrante operativo.

### 2.3 Definición de Entidades (Data Dictionary)

A continuación se detalla el esquema de base de datos necesario para implementar el modelo.

#### 1. Usuarios (users)

| Columna         | Tipo    | Descripción                |
| :-------------- | :------ | :------------------------- |
| `id`            | UUID    | PK.                        |
| `email`         | String  | Unique.                    |
| `display_name`  | String  | Nombre a mostrar en la UI. |
| `password_hash` | String  |                            |
| `is_active`     | Boolean | Default true.              |

#### 2. Proyectos (projects)

| Columna | Tipo   | Descripción    |
| :------ | :----- | :------------- |
| `id`    | UUID   | PK.            |
| `code`  | String | Unique (slug). |
| `name`  | String |                |

#### 3. Entornos de Proyecto (project_environments)

Define qué entornos existen para cada proyecto (Dev, Prod, etc).
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `project_id` | UUID | FK -> projects.id. |
| `code` | String | "dev", "prod", "staging". |
| `name` | String | "Development", "Production". |
| `priority` | Integer | Para ordenar en la UI (1, 2, 3..). |

#### 4. Módulos de Proyecto (project_modules)

Define las áreas funcionales.
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `project_id` | UUID | FK -> projects.id. |
| `code` | String | "sales", "catalog". |
| `name` | String | |

#### 5. Equipos (teams)

Grupos de trabajo asignados a módulos.
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `project_id` | UUID | FK -> projects.id. |
| `name` | String | "Ventas Team A". |

#### 6. Asignación Equipo-Módulo (team_modules)

Qué módulos gestiona cada equipo.
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `team_id` | UUID | FK -> teams.id. |
| `module_id` | UUID | FK -> project_modules.id. |

#### 7. Miembros de Equipo (team_members)

Quién está en el equipo y su rol interno.
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `team_id` | UUID | FK -> teams.id. |
| `user_id` | UUID | FK -> users.id. |
| `role` | Enum | `LEADER_PRIMARY`, `LEADER_TEMP`, `MEMBER`. |
| `valid_from` | Datetime | Inicio vigencia. |
| `valid_to` | Datetime | Fin vigencia (Nullable). |

---

### Tablas de Permisos (RBAC Escalable)

#### 8. Roles de Proyecto (project_roles)

Definición abstracta de un rol (ej. "Developer").
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `project_id` | UUID | FK -> projects.id. |
| `name` | String | "Developer", "QA", "Product Owner". |

#### 9. Permisos (project_permissions)

Catálogo de acciones posibles por contexto.
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `project_id` | UUID | FK -> projects.id. |
| `module_id` | UUID | FK -> project_modules.id (Nullable → permiso nivel proyecto). |
| `environment_id`| UUID | FK -> project_environments.id (Nullable → permiso cross-env). |
| `action` | String | "request", "approve", "execute", "read". |

#### 10. Permisos de Rol (project_role_permissions)

Qué puede hacer cada rol (Tabla pivot).
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `role_id` | UUID | FK -> project_roles.id. |
| `permission_id` | UUID | FK -> project_permissions.id. |

#### 11. Asignación de Roles a Usuarios (user_project_roles)

Qué rol cumple cada usuario en el proyecto.
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | PK. |
| `project_id` | UUID | FK -> projects.id. |
| `user_id` | UUID | FK -> users.id. |
| `role_id` | UUID | FK -> project_roles.id. |
| `start_at` | Datetime | |
| `end_at` | Datetime | Nullable. |

---

## 3. Modelo de Permisos Escalable

El problema de escalabilidad se resuelve desacoplando el **Rol** (Capacidades) del **Alcance** (Dónde se aplican).

### 3.1 Concepto de Scope (Alcance)

Un permiso no es solo "Poder Desplegar", es "Poder Desplegar en Producción del Módulo Ventas".
El formato interno del permiso es: `context:module:environment:action`

### 3.2 Lógica de Autorización

Para que un usuario `U` realice la acción `A` en el entorno `E` del módulo `M` del proyecto `P`:

1.  **Pertenencia (Scope):** `U` debe ser miembro activo de un **Equipo** que tenga asignado el módulo `M` del proyecto `P`.
2.  **Capacidad (Role):** `U` debe tener asignado un **Rol de Proyecto** en `P` que contenga el permiso para la acción `A` en el entorno `E`.

**Ejemplo Práctico:**

- **Usuario:** `Ana` (Developer)
- **Equipo:** `Checkout Team` (Asignado al módulo `Pagos`).
- **Rol:** `Developer` (Permite `deploy` en `Dev`, pero solo `read` en `Prod`).
- **Resultado:** Ana puede desplegar en `Dev` del módulo `Pagos`, pero NO en `Prod` (falta permiso en rol) y NO en el módulo `Logística` (su equipo no lo tiene asignado).

### 3.3 Roles Temporales y Suplencias

- El sistema permite asignar roles (ej. `Tech Lead`) con fecha de inicio y fin. Esto facilita cubrir vacaciones o licencias sin otorgar permisos permanentes innecesarios.

---

## 4. Roles Globales y Casos de Uso Avanzados

Para cubrir necesidades que exceden el ámbito de un solo proyecto, el sistema implementa **Roles Globales**.

### 4.1 Administrador de Plataforma (Global Admin)

- **Alcance:** Toda la plataforma (`platform:*`).
- **Responsabilidades:**
  - Crear nuevos proyectos.
  - Gestionar usuarios (altas/bajas).
  - Ver auditoría global.
- **Implementación:** Un rol especial `PLATFORM_ADMIN` que tiene permisos sobre los ABM maestros, pero **NO necesariamente** acceso operativo a los datos internos de cada proyecto (salvo que se le asigne explícitamente).

### 4.2 Auditor (Global Read-Only)

- caso: "Quiero un auditor que pueda ver todo pero no tocar nada".
- **Solución:** Se crea un Rol Global `AUDITOR` con permisos de solo lectura (`read`) sobre todos los recursos de auditoría y configuración de proyectos.
- **Scope:** `platform:audit:*:read`, `project:*:*:read`.

### 4.3 PM Multi-Proyecto (Cross-Project Management)

- Caso: "Un PM que gestiona el Proyecto A, Proyecto B, pero NO el Proyecto C".
- **Solución:** No se usa un rol global (que daría acceso a todo), sino **Asignaciones Múltiples**.
  - Se le asigna al usuario el rol `PROJECT_MANAGER` en el **Proyecto A**.
  - Se le asigna al usuario el rol `PROJECT_MANAGER` en el **Proyecto B**.
  - **Resultado:** El PM ve y gestiona A y B. El Proyecto C no aparece en su lista.

---

## 5. Módulos Funcionales

### 5.1 Identidad y Acceso (IAM)

- **Gestión de Usuarios:** Alta por Administrador.
- **Autenticación:**
  - Protocolo seguro basado en **JWT**.
  - `Access Token`: Vida corta (ej. 1 hora).
  - `Refresh Token`: Vida larga (ej. 7 días), con rotación para revocar accesos comprometidos.
- **Seguridad:** Hashing robusto de contraseñas, políticas de complejidad y bloqueo de cuenta.

### 5.2 Gestión de Recursos (Resource Management)

- **Catálogo de Proyectos:** ABM de Proyectos, Módulos y Entornos.
- **Staffing de Equipos:**
  - Creación de equipos.
  - Asignación de usuarios a equipos con roles internos (Líder/Miembro).
  - Asignación de equipos a módulos.

### 5.3 Operaciones y Herramientas (Tools)

El sistema actúa como un orquestador para herramientas externas o scripts internos.

**Flujo de Trabajo Estándar (Workflow):**

1.  **Solicitud (Request):**
    - El usuario crea una solicitud (ej. "Correr script de migración").
    - Selecciona: Proyecto, Módulo, Entorno.
    - Estado inicial: `Draft` o `Pending Approval`.
2.  **Revisión y Aprobación:**
    - Según la criticidad del entorno (ej. Prod), se requiere aprobación de un rol superior (ej. `Tech Lead` o `Arquitecto`).
    - El sistema valida permisos de aprobación.
3.  **Ejecución:**
    - Una vez aprobada, la acción se ejecuta (automática o manualmente según la herramienta).
    - Se registra el resultado (Éxito/Fallo).
4.  **Auditoría (Audit Log):**
    - Registro inmutable de todo el ciclo: Quién solicitó, quién aprobó, qué se ejecutó y cuándo.

---

## 6. Requerimientos No Funcionales

1.  **Auditoría:** Trazabilidad completa de acciones de modificación (Create/Update/Delete/Execute).
2.  **Seguridad:** Principio de "Deny by Default". Solo se permite lo explícitamente autorizado.
3.  **Usabilidad:** Interfaz clara para visualizar permisos efectivos ("¿Por qué no puedo hacer esto?").
4.  **Extensibilidad:** Arquitectura preparada para agregar nuevos tipos de herramientas y reglas de validación sin reescribir el núcleo.

---

## 7. Glosario de Términos

| Término             | Definición                                                 |
| :------------------ | :--------------------------------------------------------- |
| **Proyecto**        | Iniciativa o producto de software gestionado.              |
| **Módulo**          | Componente funcional dentro de un proyecto.                |
| **Entorno**         | Instancia de despliegue (Dev, QA, Prod).                   |
| **Equipo**          | Grupo de personas responsables de uno o más módulos.       |
| **Rol de Proyecto** | Conjunto de permisos (capacidades) dentro de un proyecto.  |
| **Solicitud**       | Petición formal para ejecutar una acción sobre un recurso. |
