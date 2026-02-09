# Modelo de datos definitivo (permisos por proyecto)

> [!WARNING]
> COMPROBADO: Este documento ha sido reemplazado por `propuesta-1.md` como la fuente de verdad para el esquema de datos y permisos. Consulte ese archivo para la definición canónica.

## Objetivo

Definir un modelo escalable para permisos por proyecto, módulo y entorno, sin incluir herramienta en el scope, soportando equipos con líderes y asignaciones con vigencia.

## Scope de permiso

Formato único:

- `context:module:env:action`

Reglas por contexto:

- `context=platform` -> `env` debe ser `*`
- `context=project` -> `env` obligatorio
- `context=analytics` -> `env` `*` si no aplica

Ejemplos:

- `platform:users:*:read`
- `project:ventas:prod:approve`
- `project:matriculacion:staging:request`
- `analytics:reports:*:read`

Acciones fijas recomendadas:

- Workflow: `request`, `approve`, `execute`, `reject`
- Gestión: `read`, `create`, `update`, `delete`, `enable`, `disable`, `assign`, `revoke`

## Entidades

### User

- `id`
- `first_name`
- `last_name`
- `email`
- `password_hash`
- `cargo` (informativo, no afecta permisos)
- `is_active`
- `requires_password_change`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

### Project

- `id`
- `name`
- `code`
- `description`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

### ProjectEnvironment

- `id`
- `project_id`
- `name`
- `code`
- `description`
- `order`

### ProjectModule

- `id`
- `project_id`
- `name`
- `code`
- `description`

### Team

- `id`
- `project_id`
- `name`
- `description`

### TeamModuleAssignment

Define el alcance real de un equipo dentro de un proyecto.

- `id`
- `team_id`
- `module_id`

### TeamMemberAssignment

Asignaciones con vigencia y rol dentro del equipo.

- `id`
- `team_id`
- `user_id`
- `role_in_team` (`leader_primary | leader_temp | member`)
- `valid_from`
- `valid_until` (nullable)

Reglas de negocio:

- Un usuario puede pertenecer a más de un equipo.
- Solo puede haber un `leader_primary` activo por equipo.
- Un usuario solo puede ser `leader_primary` en un equipo a la vez.
- `leader_temp` puede ser miembro del equipo o líder primario de otro equipo.

### ProjectRole

Rol definido por proyecto. Un mismo nombre puede existir en distintos proyectos con scopes distintos.

- `id`
- `project_id`
- `name` (ej: DEVELOPER, LEAD)
- `description`

### ProjectPermission

Permiso unitario por proyecto, módulo, entorno y acción.

- `id`
- `project_id`
- `module_id`
- `environment_id`
- `action`

### ProjectRolePermission

Relación M:N entre roles y permisos.

- `project_role_id`
- `project_permission_id`

### UserProjectRole

Asignación de roles por proyecto.

- `user_id`
- `project_id`
- `project_role_id`
- `start_at`
- `end_at` (nullable)

## Reglas de autorización

Para una acción sobre `project/module/environment`:

1. El usuario debe tener una asignación activa a un equipo que tenga asignado el módulo.
2. El usuario debe tener un `ProjectRole` activo en ese proyecto.
3. El `ProjectRole` debe contener el permiso `context:module:env:action` con `context=project`.

Si cualquiera de estas condiciones falla, se deniega.

## Notas

- Los permisos no incluyen herramienta. Si una herramienta necesita restricciones extra, se controla a nivel de políticas internas de la herramienta o por reglas de negocio.
- El catálogo de entornos es por proyecto y aplica a todos los módulos del proyecto.
- La pertenencia a equipos define el alcance real de trabajo sobre módulos.

## Ejemplo concreto

### Proyecto: "Ecommerce A"

Entornos:

- `dev`
- `staging`
- `prod`

Módulos:

- `ventas`
- `catalogo`

Roles por proyecto:

- `DEVELOPER`
- `LEAD`

Permisos del rol `DEVELOPER`:

- `project:ventas:dev:request`
- `project:ventas:dev:read`
- `project:ventas:staging:request`
- `project:catalogo:dev:request`
- `project:catalogo:dev:read`

Permisos del rol `LEAD`:

- `project:ventas:dev:approve`
- `project:ventas:staging:approve`
- `project:ventas:prod:approve`
- `project:ventas:prod:execute`
- `project:catalogo:staging:approve`
- `project:catalogo:prod:execute`

Equipos:

Equipo "Ventas Team":

- Módulo asignado: `ventas`
- Miembros: Alice (leader_primary), Bob (member)

Equipo "Catalogo Team":

- Módulo asignado: `catalogo`
- Miembros: Carol (leader_primary), Dan (member)

Asignaciones de roles:

- Alice: `LEAD` en "Ecommerce A"
- Bob: `DEVELOPER` en "Ecommerce A"
- Carol: `LEAD` en "Ecommerce A"
- Dan: `DEVELOPER` en "Ecommerce A"

Caso de autorización:

- Bob quiere ejecutar `project:ventas:prod:execute`
  - Tiene equipo con módulo `ventas` -> OK
  - Tiene rol `DEVELOPER` -> NO tiene `execute` en `prod`
  - Resultado: DENEGADO

- Alice quiere aprobar `project:ventas:prod:approve`
  - Tiene equipo con módulo `ventas` -> OK
  - Tiene rol `LEAD` con `ventas:prod:approve` -> OK
  - Resultado: PERMITIDO

## Roles globales (administración de plataforma)

Para permisos de plataforma se usan roles globales, independientes de proyectos.

### Entidades mínimas

- `GlobalRole`
- `GlobalPermission`
- `UserGlobalRole`

### Scopes globales (ejemplos)

- `platform:users:*:create|read|update|delete`
- `platform:projects:*:create|read|update|delete`
- `platform:roles:*:assign|revoke`
- `platform:teams:*:assign|revoke`
- `platform:catalogs:*:manage`
- `platform:audits:*:read`

### Rol `PLATFORM_ADMIN` (ejemplo)

Permisos:

- `platform:users:*:read`
- `platform:users:*:create`
- `platform:users:*:update`
- `platform:users:*:delete`
- `platform:projects:*:create`
- `platform:projects:*:read`
- `platform:projects:*:update`
- `platform:projects:*:delete`
- `platform:roles:*:assign`
- `platform:roles:*:revoke`
- `platform:teams:*:assign`
- `platform:teams:*:revoke`
- `platform:catalogs:*:manage`
- `platform:audits:*:read`

## Rol de observador (PM, analista, arquitecto)

Si querés que entren a la plataforma y solo vean el estado de proyectos, responsables y solicitudes, definí un rol global de lectura.

### Rol `PROJECT_OBSERVER` (global)

Permisos sugeridos:

- `platform:projects:*:read`
- `platform:teams:*:read`
- `platform:users:*:read`
- `platform:audits:*:read`

Con ese rol pueden ver:

- Estado general de proyectos
- Quién está a cargo de cada equipo o módulo
- Listado y estado de solicitudes

Si además deben ver detalles dentro de un proyecto específico, asignales un `ProjectRole` con permisos `read` sobre los módulos y entornos correspondientes.
