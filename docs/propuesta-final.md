# Propuesta Unificada del Proyecto

> Estado: Draft  
> Ultima actualizacion: 2026-02-09  
> Responsable: Eulis Blanco

## 1. Vision y Objetivos

El objetivo es desarrollar una plataforma centralizada y escalable para gestionar el ciclo de vida de desarrollo de multiples proyectos, orquestando permisos, equipos y operaciones criticas (despliegues, scripts, configuraciones) de manera segura y auditable.

Metas principales:

- Escalabilidad: separar definicion de permisos (roles) de asignacion de personas (equipos).
- Seguridad granular: control de acceso por contexto `Proyecto -> Modulo -> Entorno`.
- Auditoria total: trazabilidad completa de quien autorizo y ejecuto cada accion.
- Flexibilidad operativa: flujos de aprobacion configurables y roles temporales.

## 2. Problema, Impacto y Propuesta de Valor

Problema actual:

- Solicitudes manuales, aprobaciones por chat/correo y ejecuciones sin registro centralizado.
- Herramientas aisladas y permisos ad-hoc sin gobernanza.

Impacto:

- Operativo: demoras, errores en produccion, inconsistencia entre ambientes.
- Economico: downtime, retrabajo, perdida de productividad.
- Legal y compliance: falta de trazabilidad y auditoria.

Propuesta de valor:

- Control granular de permisos, trazabilidad completa y flujo estandarizado para cambios en datos y despliegues sin frenar la velocidad del equipo.

Usuarios objetivo:

- Usuario primario: lider tecnico, arquitecto o PM responsable de aprobaciones.
- Usuario secundario: desarrollador que genera solicitudes.
- Administradores y compliance: administrador de plataforma y auditoria.

Metricas de exito:

- Porcentaje de solicitudes auditadas con aprobacion registrada.
- Tiempo promedio desde solicitud hasta ejecucion.
- Reduccion de incidentes en ambientes productivos.
- Adopcion por proyecto.

No-objetivos:

- No reemplazar herramientas de CI/CD existentes.
- No gestionar repositorios de codigo ni control de versiones.
- No ser un sistema de RRHH.

## 3. Alcance y MVP

Alcance funcional:

- Gestion de proyectos, modulos, entornos y equipos.
- Gestion de usuarios, roles y permisos, incluyendo asignaciones temporales.
- Configuracion de ambientes por proyecto.
- Gestion de herramientas: SQL Runner y Deploy Runner.
- Flujo de solicitudes: crear, aprobar o rechazar, comentar, ejecutar y auditar.

MVP incluye:

- Alta de usuarios, roles, permisos y herramientas.
- Alta de equipos, proyectos, modulos y ambientes.
- Asignar permisos a roles y usuarios, con vigencia temporal opcional.
- Asignar roles a usuarios, con vigencia temporal opcional.
- Asignar herramientas a proyectos.
- Solicitudes, aprobacion o rechazo, ejecucion y auditoria.

MVP excluye:

- Integraciones avanzadas adicionales a Rundeck.
- Reporteria avanzada y BI.
- Automatizaciones complejas de CI/CD.

Alcance tecnico inicial:

- Tenancy: single-tenant (tenant implicito, sin multi-tenant).
- Permisos: por use-case y scope (`global | project | module | environment`).
- Aprobaciones: minimo 1, configurable a 2 o 3, rol requerido configurable por entorno.
- Herramientas: habilitadas solo por proyecto.
- Self-service: `/me/*` JWT-only (sin permisos).
- Backoffice: admin completo y roles parciales configurables.

## 4. Modelo de Dominio y Lenguaje Ubicuo

Terminos clave:

- Proyecto: iniciativa o producto gestionado.
- Modulo: componente funcional dentro de un proyecto.
- Entorno: instancia de despliegue (dev, staging, prod, etc.).
- Equipo: grupo de personas responsables de uno o mas modulos.
- Rol de proyecto: conjunto de permisos en un proyecto.
- Permiso: accion granular sobre un recurso.
- Herramienta: utilidad operativa (SQL Runner, Deploy Runner).
- Solicitud: peticion para ejecutar una accion sobre un recurso.
- Aprobacion: decision sobre una solicitud.
- Ejecucion: resultado de la solicitud con auditoria.

Bounded contexts:

- Identidad y Acceso.
- Proyectos y Equipos.
- Operacion de Herramientas.
- Auditoria.

Context map:

- Identidad y Acceso provee autorizacion al resto.
- Proyectos y Equipos define el alcance operativo.
- Operacion de Herramientas consume ambos y publica eventos de Auditoria.

## 5. Estructura Organizativa

Jerarquia de recursos:

- Proyecto: unidad de negocio con entornos configurables.
- Modulo: subdivide responsabilidades dentro del proyecto.
- Entorno: etapa del ciclo de vida (configurable por proyecto).

Actores y equipos:

- Usuario: persona autenticada.
- Equipo: unidad operativa asignada a modulos de un proyecto.
- Roles internos del equipo: `LEADER_PRIMARY`, `LEADER_TEMP`, `MEMBER`.

## 6. Modelo de Permisos

Principios:

- Modelo whitelist: sin permiso explicito, no hay acceso.
- No existe blacklist o deny explicito.
- El permiso define la accion, el scope define el alcance.

Scopes:

- `global | project | module | environment` + `scopeId`.

Formato logico del permiso:

- `context:module:environment:action`.

Reglas de autorizacion:

- Pertenencia: el usuario debe ser miembro activo de un equipo asignado al modulo del proyecto.
- Capacidad: el usuario debe tener un rol de proyecto que incluya el permiso requerido.
- Permisos directos: se admiten asignaciones directas a usuario (ademas de roles).
- Herramienta habilitada: si hay toolId, debe estar habilitada en el proyecto.

Roles temporales y suplencias:

- Asignaciones con `valid_from` y `valid_until` para cubrir vacaciones o roles temporales.

Roles globales:

- `PLATFORM_ADMIN`: gestiona ABM maestros, no implica acceso operativo a proyectos salvo asignacion.
- `AUDITOR`: solo lectura de auditoria y configuracion (`platform:audit:*:read`, `project:*:*:read`).

Ejemplos:

- Usuario Ana (Developer) en proyecto A, equipo asignado al modulo Pagos.
- Permiso en rol: `deploy.execute` en scope environment `dev`.
- Resultado: Ana puede ejecutar deploy en Dev de Pagos, pero no en Prod ni en otros modulos.
- Permiso directo: `sql.run` con scope environment `prod` habilita ejecucion puntual sin cambiar el rol.

## 7. Modelo de Datos (Resumen)

Entidades principales:

- `users`
- `projects`
- `project_environments`
- `project_modules`
- `teams`
- `team_modules`
- `team_members`
- `project_roles`
- `project_permissions`
- `project_role_permissions`
- `user_project_roles`
- `audit_logs`

Reglas de permisos en datos:

- `project_permissions` define la tupla unica: `(project_id, module_id?, environment_id?, action)`.
- `module_id` NULL = permiso a nivel proyecto.
- `environment_id` NULL = permiso en todos los entornos.

Diccionario de datos (tablas core):

Usuarios (users):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `email` | String | Unique |
| `display_name` | String | Nombre a mostrar |
| `password_hash` | String | Hash de password |
| `is_active` | Boolean | Default true |

Proyectos (projects):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `code` | String | Unique (slug) |
| `name` | String | Nombre |

Entornos de proyecto (project_environments):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `project_id` | UUID | FK -> projects.id |
| `code` | String | dev, staging, prod |
| `name` | String | Development, Production |
| `priority` | Integer | Orden UI |

Modulos de proyecto (project_modules):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `project_id` | UUID | FK -> projects.id |
| `code` | String | sales, catalog |
| `name` | String | Nombre |

Equipos (teams):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `project_id` | UUID | FK -> projects.id |
| `name` | String | Nombre |

Asignacion equipo-modulo (team_modules):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `team_id` | UUID | FK -> teams.id |
| `module_id` | UUID | FK -> project_modules.id |

Miembros de equipo (team_members):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `team_id` | UUID | FK -> teams.id |
| `user_id` | UUID | FK -> users.id |
| `role` | Enum | LEADER_PRIMARY, LEADER_TEMP, MEMBER |
| `valid_from` | Datetime | Inicio vigencia |
| `valid_until` | Datetime | Fin vigencia nullable |

Roles de proyecto (project_roles):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `project_id` | UUID | FK -> projects.id |
| `name` | String | Developer, QA, PO |

Permisos (project_permissions):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `project_id` | UUID | FK -> projects.id |
| `module_id` | UUID | FK -> project_modules.id (nullable) |
| `environment_id` | UUID | FK -> project_environments.id (nullable) |
| `action` | String | request, approve, execute, read |

Permisos de rol (project_role_permissions):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `role_id` | UUID | FK -> project_roles.id |
| `permission_id` | UUID | FK -> project_permissions.id |

Asignacion de roles a usuarios (user_project_roles):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `id` | UUID | PK |
| `project_id` | UUID | FK -> projects.id |
| `user_id` | UUID | FK -> users.id |
| `role_id` | UUID | FK -> project_roles.id |
| `valid_from` | Datetime | Inicio vigencia |
| `valid_until` | Datetime | Fin vigencia nullable |

## 8. Reglas e Invariantes

Reglas minimas:

- Equipo pertenece a un proyecto.
- Modulo pertenece a un proyecto.
- Equipo debe tener al menos 2 miembros.
- Un equipo puede tener hasta 2 miembros con rol leader/leader_temp.
- Solicitud solo puede crearse si la herramienta esta habilitada.
- Solicitud solo se ejecuta si fue aprobada segun reglas.
- Aprobacion minima 1, configurable a 2 o 3.
- Puede requerirse aprobacion de un rol especifico segun entorno.
- Toda ejecucion debe generar auditoria.
- Endpoints self-service `/me/*` validan solo JWT valido.

Value objects:

- AmbienteOperacionTipo (dev, demo, staging, prod).
- RolTemporal (periodo de vigencia).

Agregados:

- Proyecto (root).
- Equipo (root).
- Solicitud (root) con aprobaciones y ejecuciones.

Relaciones principales:

- Proyecto 1..\* Modulos.
- Proyecto 0..\* Equipos.
- Equipo 2..\* Usuarios (via team_members).
- Equipo 0..2 Usuarios con type leader o leader_temp.
- Usuario 0..\* Roles.
- Rol 0..\* Permisos.
- Usuario 0..\* Permisos (asignaciones directas).
- Proyecto 1..\* AmbientesOperacion.
- Proyecto 0..\* Herramientas habilitadas.
- Solicitud 1..1 Proyecto.
- Solicitud 1..1 Herramienta.
- Solicitud 1..1 AmbienteOperacion.
- Solicitud 0..1 Modulo.
- Solicitud 0..\* Aprobaciones.
- Solicitud 0..\* Ejecuciones.

## 9. Modulos Funcionales

Identidad y Acceso:

- JWT con access token y refresh token con rotacion.
- Politicas de password y bloqueo.
- Reset y verificacion de email.

Politicas de password:

- Minimo 12 caracteres, 1 mayus, 1 minus, 1 numero.
- Historial: no reutilizar ultimas 5.
- Reset tokens TTL: 30 minutos.
- Verify email tokens TTL: 24 horas.
- Rate limit en /auth/forgot-password.
- Cambio forzado: si `require_password_change = true`, el usuario puede iniciar sesion pero queda bloqueado para operar la plataforma hasta cambiar su password. Solo puede acceder a `/me`, `/me/password`, `/auth/refresh` y `/auth/logout`.

Gestion de Recursos:

- ABM de proyectos, modulos, entornos.
- Equipos y staffing con roles internos.

Operaciones y Herramientas:

- Orquestador de acciones criticas.
- Flujo: solicitud -> aprobacion -> ejecucion -> auditoria.

Flujo de trabajo estandar:

1. Solicitud: crear solicitud con proyecto, modulo y entorno.
2. Revision y aprobacion: validar permisos y reglas por entorno.
3. Ejecucion: automatica o manual segun herramienta.
4. Auditoria: registro inmutable del ciclo completo.

Auditoria:

- Registro inmutable del ciclo completo.

## 10. Requerimientos No Funcionales

Seguridad:

- Autenticacion JWT + refresh.
- Autorizacion RBAC + permisos directos a usuario y temporales.
- Auditoria de solicitudes, aprobaciones, ejecuciones y cambios de permisos.
- Retencion baseline: 12 meses.

Performance:

- SLA: 99.5% mensual.
- Latencia: p95 < 400ms, p99 < 800ms.
- Volumen baseline: 500 usuarios activos, 2k solicitudes/mes, 500 ejecuciones/mes.

Escalabilidad:

- Preferencia por escalado horizontal.
- Limites baseline: 50 ejecuciones concurrentes, 2MB por payload, 30 dias de logs locales antes de rotacion.

Disponibilidad:

- Backups y rollback en deploys.

## 11. Casos de Uso (FRD)

UC-01 Configuracion general
Descripcion: configurar parametros globales de la plataforma.
Actor: Administrador de plataforma.
Reglas: solo administradores pueden gestionar configuracion.

UC-02 Gestion de roles y permisos
Descripcion: crear, editar y eliminar roles; asignar permisos.
Actor: Administrador de plataforma.
Reglas: permisos granulares y auditables.

UC-03 Gestion de proyectos, modulos y equipos
Descripcion: crear, editar y eliminar proyectos y modulos; asignar equipos.
Actor: Administrador de plataforma y usuarios autorizados.
Reglas: equipos pertenecen a un proyecto, modulos pertenecen a un proyecto

UC-04 Solicitud SQL Runner
Descripcion: generar solicitud para ejecutar query o migracion.
Actor: Usuario con permisos de SQL Runner.
Reglas: solo en ambientes permitidos y con modulos asignados.

UC-05 Aprobacion o rechazo de solicitud
Descripcion: aprobar o rechazar solicitudes.
Actor: Usuario con permisos de aprobacion.
Reglas: aprobadores solo sobre su equipo o proyecto. Minimo 1 aprobacion, configurable a 2 o 3, con rol requerido configurable por entorno.

UC-06 Ejecucion y auditoria
Descripcion: ejecutar solicitud y registrar auditoria.
Actor: Sistema o usuario con permisos de ejecucion.
Reglas: toda ejecucion queda auditada.

UC-07 Solicitud Deploy Runner
Descripcion: gestionar despliegues integrados con Rundeck via API.
Actor: Desarrollador o lider tecnico.
Reglas: ambientes y proyectos habilitados. Solo puede ejecutar solicitudes previamente aprobadas.

UC-08 Asignacion de herramientas
Descripcion: habilitar herramientas por proyecto.
Actor: Administrador de plataforma o usuario autorizado.

Casos de uso tecnicos (Application Layer):

CreateUser
Input: nombre, email, password.
Output: userId, user.
Reglas: email unico, password hasheada.
Eventos: user.created.

AssignBaseRole
Input: userId, roleId.
Output: userId, roleId.
Reglas: rol y usuario deben existir, no duplicar asignaciones.
Eventos: role.assigned.

GrantPermission
Input: subjectType (user|role), subjectId, permissionId, scope (global|project|module|environment), scopeId, from (opcional), to (opcional).
Output: assignmentId.
Reglas: permissionId valido, scope y scopeId validos, from < to si existen, no duplicar permisos equivalentes.
Eventos: permission.assigned.

EvaluateAccess
Input: userId, permissionId, scope (global|project|module|environment), scopeId, toolId (opcional), timestamp (opcional, default: now).
Output: allowed (boolean), reason (string).
Reglas: modelo whitelist, aplica RBAC + permisos directos, asignaciones temporales solo en ventana vigente, si hay toolId la herramienta debe estar habilitada.
Eventos: ninguno.

ChangePassword
Input: userId, currentPassword, newPassword.
Output: status.
Reglas: validar password actual y politicas.
Eventos: user.password_changed.

RequestPasswordReset
Input: email.
Output: status.
Reglas: si email existe emitir token; respuesta indistinguible si no existe; token con TTL.
Eventos: user.password_reset_requested.

ResetPassword
Input: token, newPassword.
Output: status.
Reglas: token valido y no expirado; invalidar token al usarlo.
Eventos: user.password_reset.

VerifyEmail
Input: token.
Output: status.
Reglas: token valido y no expirado; marcar email como verificado.
Eventos: user.email_verified.

SelfServiceProfile
Input: userId.
Output: user.
Reglas: solo puede acceder a su propio perfil.
Eventos: ninguno.

SelfUpdateProfile
Input: userId, campos (nombre, email, etc.).
Output: user.
Reglas: solo puede modificar su propio perfil; cambio de email requiere verificacion.
Eventos: user.profile_updated.

SelfChangePassword
Input: userId, currentPassword, newPassword.
Output: status.
Reglas: solo puede modificar su propia password; validar password actual.
Eventos: user.password_changed.

## 12. Vertical Slices

Vertical Slice 1: Create & Execute Request (SQL Runner)
Objetivo: crear solicitud SQL, aprobarla, ejecutarla y auditarla.
Precondiciones: herramienta SQL Runner habilitada; permiso `sql.run` en scope `environment`; aprobacion minima 1.
Flujo:

1. UI CreateRequest envia POST `/projects/{projectId}/requests` con tool, environmentId, moduleId, payload.sql.
2. API valida herramienta habilitada y permisos `sql.run`, crea request `PENDING_APPROVAL`.
3. Aprobacion: POST `/requests/{id}/approve` con validacion de rol y scope.
4. Ejecucion: POST `/requests/{id}/execute` con validacion de aprobacion y permisos.
5. Auditoria: eventos `request.created`, `request.approved`, `request.executed`, `audit.logged`.
   Resultado: solicitud ejecutada y timeline visible en RequestDetail.

Vertical Slice 2: Administracion de Roles y Permisos
Objetivo: crear rol, asignar permisos por scope y aplicarlo a un usuario.
Precondiciones: usuario admin con permisos de administracion; proyecto existente.
Flujo:

1. UI RolesPermissions crea rol via POST `/roles`.
2. Asigna permisos al rol via POST `/roles/{id}/permissions` con scope y scopeId.
3. Asigna rol a usuario via POST `/users/{id}/roles` con valid_from/valid_until opcional.
4. Auditoria: eventos `role.created`, `permission.assigned`, `role.assigned`, `audit.logged`.
   Resultado: usuario opera segun permisos del rol en el scope definido.

## 13. Arquitectura y Stack

Estilo:

- Monolito modular con limites claros por contexto.

Capas:

- Presentation, Application, Domain, Infrastructure.

Tecnologias:

- Frontend: React 19, React Router, Vite, Tailwind CSS, Axios, Jest, Testing Library, Playwright.
- Backend: NestJS, TypeScript, class-validator, class-transformer, Express, TypeORM, PostgreSQL.
- Infra: Nx, ESLint, Prettier.

Comunicacion:

- Sync interno para flujos core.
- Eventos internos para auditoria, notificaciones y ejecucion.

Mapa de contextos delimitados:

- Identity & Access (Upstream): provee autenticacion y UserId.
- Projects & Resources (Core Domain): gestiona estructura, provee validacion de scope.
- Operations & Executions (Generic Subdomain): orquesta ejecuciones, consume permisos.
- Audit (Supporting Subdomain): ingesta y consulta de eventos.

Reglas para extraer microservicios:

- No imports directos entre modulos.
- Comunicar via eventos o puertos.
- Un modulo solo conoce interfaces externas, no implementaciones de otros modulos.
- Infraestructura de cada modulo vive dentro del modulo.
- Configuracion y bootstrapping en `src/main`.

ADRs:

- ADR-001 Arquitectura: monolito modular por velocidad y control centralizado.
- ADR-002 DDD: bounded contexts y lenguaje ubicuo.
- ADR-003 Comunicacion: sync interno para core y eventos para secundarios.
- ADR-004 Monorepo: Nx para coordinacion de frontend y backend.
- ADR-005 DB principal: PostgreSQL por consistencia transaccional.
- ADR-006 Deploy Runner: integracion con Rundeck via API.

## 14. Estructura de Carpetas

Backend (propuesta):

- `apps/backend/`
- `apps/backend/src/`
- `apps/backend/src/app/`
- `apps/backend/src/configuration/`
- `apps/backend/src/database/`
- `apps/backend/src/modules/`
- `apps/backend/src/shared/`

Database:

- `migrations/`
- `seeds/`

Modulos (bounded contexts):

- `apps/backend/src/modules/identity/`
- `apps/backend/src/modules/projects/`
- `apps/backend/src/modules/operations/`
- `apps/backend/src/modules/audit/`

Estructura interna por modulo:

- `domain/`
- `domain/<entity>/`
- `domain/<entity>/value-object/`
- `domain/<entity>/event/`
- `domain/<entity>/entity/`
- `domain/<entity>/repository/`
- `application/`
- `application/<use-case>/`
- `application/<use-case>/handler/`
- `application/<use-case>/command/`
- `infrastructure/`
- `infrastructure/http/`
- `infrastructure/persistence/`
- `infrastructure/persistence/<technology>/`
- `infrastructure/persistence/<technology>/entities/`
- `infrastructure/ids/`
- `infrastructure/ids/<technology>/`
- `infrastructure/security/`
- `infrastructure/security/<technology>/`

Shared kernel:

- `apps/backend/src/shared/` para tipos comunes, utilidades puras y contratos de eventos.

Frontend (propuesta):

- `apps/frontend/`
- `apps/frontend/src/`
- `apps/frontend/src/app/`
- `apps/frontend/src/app/routes/`
- `apps/frontend/src/app/layouts/`
- `apps/frontend/src/app/providers/`
- `apps/frontend/src/app/state/`
- `apps/frontend/src/app/styles/`
- `apps/frontend/src/shared/`
- `apps/frontend/src/shared/components/`
- `apps/frontend/src/shared/ui/`
- `apps/frontend/src/shared/hooks/`
- `apps/frontend/src/shared/utils/`
- `apps/frontend/src/shared/api/`
- `apps/frontend/src/modules/`
- `apps/frontend/src/modules/requests/`
- `apps/frontend/src/modules/approvals/`
- `apps/frontend/src/modules/audit/`
- `apps/frontend/src/modules/tools/`
- `apps/frontend/src/modules/projects/`
- `apps/frontend/src/modules/teams/`
- `apps/frontend/src/modules/users/`
- `apps/frontend/src/modules/roles-permissions/`
- `apps/frontend/src/modules/environments/`

## 15. Experiencia Frontend

Separacion de experiencia:

- Usuario final (operativo): solicitudes, aprobaciones, auditoria, herramientas.
- Backoffice (administracion): proyectos, modulos, equipos, usuarios, roles y permisos, ambientes, tools.

Pantallas clave (usuario final):

- RequestsList
- RequestDetail
- CreateRequest (wizard)
- MyApprovals
- AuditTrail

Pantallas clave (backoffice):

- Projects
- Teams
- Users
- RolesPermissions
- Tools

Flujos principales:

1. Crear solicitud: seleccionar herramienta, elegir proyecto/ambiente/modulo, validar permisos, enviar.
2. Aprobacion: ver pendientes, validar reglas, aprobar o rechazar con comentario.
3. Ejecucion: ejecutar solicitud aprobada, registrar resultado.
4. Auditoria: timeline por solicitud con filtros por estado, ambiente y herramienta.

Routing sugerido:

- `/app/requests`
- `/app/requests/:id`
- `/app/requests/new`
- `/app/approvals`
- `/app/audit`
- `/admin/projects`
- `/admin/teams`
- `/admin/users`
- `/admin/roles-permissions`
- `/admin/environments`
- `/admin/tools`

UI signature:

- Timeline vertical en detalle de solicitud con eventos y evidencias.

Navigation map:

- App
- Requests
- Requests > Detail
- Requests > New
- Approvals
- Audit
- Admin
- Admin > Projects
- Admin > Teams
- Admin > Users
- Admin > Roles & Permissions
- Admin > Environments
- Admin > Tools

Wireframes (textual):

- Requests List: header, filtros, lista con chips, CTA New Request.
- Request Detail: header con id y status, timeline vertical, payload y contexto, acciones approve/reject/execute.
- Create Request: wizard con 4 pasos tool, contexto, payload, review.
- Approvals: lista de pendientes, drawer de detalle, acciones approve/reject.
- Admin Roles & Permissions: matriz roles x permissions, selector de scope, panel de asignacion.
- Admin Projects: lista, actions, detalle con modulos, ambientes, tools.
- Admin Teams: lista, detalle con members y roles internos, acciones de asignacion.
- Admin Users: lista, detalle de roles y permisos directos, acciones de gestion.
- Admin Tools: lista, detalle de habilitacion por proyecto.

Estados:

- Empty: no requests, no approvals, no audit events, no users.
- Loading: skeletons para listas y detalle.
- Error: banner con retry y detalle tecnico colapsable.

Auth flows:

- Login, ForgotPassword, ResetPassword, VerifyEmail, ChangePassword.
- Forgot Password: email, mensaje generico, email con link/token.
- Reset Password: link con token, nueva password, confirmacion.
- Verify Email: link con token, email verificado.
- Change Password: usuario autenticado, password actual y nueva.

Self-service (frontend):

- Profile, ProfileEdit, ChangePassword.
- Profile: ver datos personales desde /me.
- Edit Profile: actualizar nombre o email, cambio de email requiere verificacion.
- Change Password: requiere password actual.

## 16. API

Convenciones:

- Base URL: `/api/v1`
- Respuestas: JSON
- Errores: 400, 401, 403, 404, 409, 422, 500
- Paginacion: `page` (default 1), `pageSize` (default 20, max 100)
- Orden: `sortBy`, `sortDir` (asc|desc)
- Busqueda: `q`
- Filtros comunes: `status`, `roleId`, `permissionId`, `projectId`, `moduleId`, `teamId`, `environmentId`, `tool`
- Respuesta paginada: `{ items, total, page, pageSize, pages }`
- Respuesta comun:
  - Create (POST): `201 + recurso`
  - Update (PATCH): `200 + recurso`
  - Delete (DELETE): `204` sin body

Permisos y scope:

- `permission` modela la accion.
- `scope` define el alcance con `scopeId`.

### Endpoints

Auth:

- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`
- POST `/auth/verify-email`
- POST `/me/password`

Self-service (JWT valido, sin permisos):

- GET `/me`
- PATCH `/me`
- GET `/me/roles`
- GET `/me/permissions`
- GET `/me/teams`
- GET `/me/requests`
- GET `/me/approvals`
- GET `/me/audit-events`

Usuarios:

- GET `/users`
- POST `/users`
- GET `/users/{id}`
- PATCH `/users/{id}`
- DELETE `/users/{id}`
- POST `/users/{id}/roles`
- POST `/users/{id}/roles/temporary`
- POST `/users/{id}/permissions`
- POST `/users/{id}/permissions/temporary`

Roles y permisos:

- GET `/roles`
- POST `/roles`
- GET `/roles/{id}`
- PATCH `/roles/{id}`
- DELETE `/roles/{id}`
- POST `/roles/{id}/permissions`
- DELETE `/roles/{id}/permissions/{permissionId}`
- GET `/permissions`
- POST `/permissions`
- GET `/permissions/{id}`
- PATCH `/permissions/{id}`
- DELETE `/permissions/{id}`

Proyectos y estructura:

- GET `/projects`
- POST `/projects`
- GET `/projects/{id}`
- PATCH `/projects/{id}`
- DELETE `/projects/{id}`
- GET `/projects/{projectId}/modules`
- POST `/projects/{projectId}/modules`
- GET `/projects/{projectId}/environments`
- POST `/projects/{projectId}/environments`

Herramientas y asignaciones:

- GET `/tools` (Listado hardcoded/enum)
- POST `/projects/{projectId}/tools`

Equipos y Asignaciones:

- GET `/teams`
- POST `/teams`
- POST `/teams/{teamId}/members`
- DELETE `/teams/{teamId}/members/{userId}`
- POST `/teams/{teamId}/modules` (Asignar modulo al equipo)
- DELETE `/teams/{teamId}/modules/{moduleId}`

Solicitudes y ejecucion:

- GET `/projects/{projectId}/requests`
- POST `/projects/{projectId}/requests`
- GET `/requests/{id}`
- PATCH `/requests/{id}`
- POST `/requests/{id}/approve`
- POST `/requests/{id}/reject`
- POST `/requests/{id}/comment`
- POST `/requests/{id}/execute`

Auditoria:

- GET `/audit-events`

### Access Control Matrix (alineada al modelo)

- `/users` GET -> `platform:users:*:list`
- `/users/{id}` GET -> `platform:users:*:read`
- `/users` POST -> `platform:users:*:create`
- `/users/{id}` PATCH -> `platform:users:*:update`
- `/users/{id}` DELETE -> `platform:users:*:delete`
- `/users/{id}/roles` POST -> `platform:users:*:assign-role`
- `/users/{id}/roles/temporary` POST -> `platform:users:*:assign-role`
- `/users/{id}/permissions` POST -> `platform:users:*:grant-permission`
- `/users/{id}/permissions/temporary` POST -> `platform:users:*:grant-permission`
- `/roles` GET -> `platform:roles:*:list`
- `/roles/{id}` GET -> `platform:roles:*:read`
- `/roles` POST -> `platform:roles:*:create`
- `/roles/{id}` PATCH -> `platform:roles:*:update`
- `/roles/{id}` DELETE -> `platform:roles:*:delete`
- `/roles/{id}/permissions` POST -> `platform:roles:*:assign-permission`
- `/roles/{id}/permissions/{permissionId}` DELETE -> `platform:roles:*:revoke-permission`
- `/permissions` GET -> `platform:permissions:*:list`
- `/permissions/{id}` GET -> `platform:permissions:*:read`
- `/permissions` POST -> `platform:permissions:*:create`
- `/permissions/{id}` PATCH -> `platform:permissions:*:update`
- `/permissions/{id}` DELETE -> `platform:permissions:*:delete`
- `/projects` GET -> `platform:projects:*:list`
- `/projects/{id}` GET -> `platform:projects:*:read`
- `/projects` POST -> `platform:projects:*:create`
- `/projects/{id}` PATCH -> `platform:projects:*:update`
- `/projects/{id}` DELETE -> `platform:projects:*:delete`
- `/projects/{projectId}/modules` GET -> `platform:modules:*:list`
- `/projects/{projectId}/modules` POST -> `platform:modules:*:create`
- `/projects/{projectId}/environments` GET -> `platform:environments:*:list`
- `/projects/{projectId}/environments` POST -> `platform:environments:*:create`
- `/teams` GET -> `platform:teams:*:list`
- `/teams` POST -> `platform:teams:*:create`
- `/teams/{teamId}/members` POST -> `platform:teams:*:add-member`
- `/teams/{teamId}/members/{userId}` DELETE -> `platform:teams:*:remove-member`
- `/teams/{teamId}/modules` POST -> `platform:teams:*:assign-module`
- `/teams/{teamId}/modules/{moduleId}` DELETE -> `platform:teams:*:remove-module`
- `/tools` GET -> `platform:tools:*:list`
- `/projects/{projectId}/tools` POST -> `project:tools:*:enable`
- `/projects/{projectId}/requests` GET -> `project:requests:*:list`
- `/projects/{projectId}/requests` POST -> `project:requests:*:create` (Requiere scope)
- `/requests/{id}` GET -> `project:requests:*:read`
- `/requests/{id}` PATCH -> `project:requests:*:update`
- `/requests/{id}/approve` POST -> `project:requests:*:approve` (Requiere scope)
- `/requests/{id}/reject` POST -> `project:requests:*:reject` (Requiere scope)
- `/requests/{id}/comment` POST -> `project:requests:*:comment`
- `/requests/{id}/execute` POST -> `project:requests:*:execute` (Requiere scope)
- `/audit-events` GET -> `platform:audit:*:read`
- `/me` GET -> `self.read`
- `/me` PATCH -> `self.update`
- `/me/roles` GET -> `self.roles.read`
- `/me/permissions` GET -> `self.permissions.read`
- `/me/teams` GET -> `self.teams.read`
- `/me/requests` GET -> `self.requests.read`
- `/me/approvals` GET -> `self.approvals.read`
- `/me/audit-events` GET -> `self.audit.read`
- `/auth/forgot-password` POST -> `public`
- `/auth/reset-password` POST -> `public`
- `/auth/verify-email` POST -> `public`
- `/me/password` POST -> `self.change-password`

## 17. Eventos

Event Map:

1. identity publica eventos hacia projects y audit.
2. projects publica eventos hacia operations y audit.
3. operations publica eventos hacia audit.

Eventos por modulo:

- identity publica: `user.created`, `role.assigned`, `role.revoked`, `permission.assigned`, `permission.revoked`.
- projects publica: `projects.created`, `project.created`, `module.created`, `team.created`. Consume: `user.created`.
- operations publica: `request.created`, `request.approved`, `request.rejected`, `request.executed`. Consume: `permission.assigned`, `role.assigned`, `project.created`, `module.created`.
- audit publica: `audit.logged`. Consume: todos los eventos de negocio.

Eventos minimos:

- `project.created`
- `module.created`
- `team.created`
- `user.created`
- `role.assigned`
- `role.revoked`
- `permission.assigned`
- `permission.revoked`
- `request.created`
- `request.approved`
- `request.rejected`
- `request.executed`
- `audit.logged`

## 18. Plan de Construccion (Semanal)

Semana 1 - Esqueleto y setup

- Monorepo Nx inicializado.
- Estructura backend y frontend creada.
- CI basico funcionando.

Semana 2 - Infra y Auth

- Configuracion de DB, env y logging.
- Esquema inicial (migraciones base).
- JWT login, logout y refresh.
- Verify email y reset password.

Semana 3 - Seguridad y Core backend

- Access Control Matrix aplicada (guards por endpoint).
- Self-service `/me` (JWT-only).
- Modulos `identity`, `projects`, `operations`, `audit`.
- CRUD de proyectos, modulos, ambientes, equipos.

Semana 4 - Vertical slice y Backoffice

- Crear solicitud, aprobar, ejecutar.
- Auditoria y eventos.
- UI basica para Requests, Approvals y Request Detail.
- Admin: proyectos, equipos, roles y permissions, tools.

Semana 5 - Hardening y QA

- Tests unit, integration y E2E en flujos criticos.
- Observabilidad (logs, metricas, alertas basicas).
- Ajustes de performance y validaciones.
- Release candidate.

## 19. Convenciones

Estructura del repositorio:

- `apps/`: apps deployables
- `libs/`: librerias reutilizables
- `tools/`: utilidades internas del repo
- `scripts/`: scripts auxiliares
- `docs/`: documentacion

Nombres:

- Carpetas y archivos en `kebab-case`.
- Casos de uso en `PascalCase` dentro de `## 11. Casos de Uso (FRD)` (Use Cases).
- ADRs dentro de `docs/architecture.md` (seccion ADRs).
- **Classes**: `PascalCase`, represent domain or application concepts.
- **Files/Folders**: `kebab-case`, represent technical artifacts.
- **One public class per file**.
- **Avoid ambiguous abbreviations**.
- **Avoid generic suffixes without context** (e.g., `Manager`, `Helper`).

- Database Naming

 Notes                              | Example Correct            | Example Wrong            |
 ---------------------------------- | -------------------------- | ------------------------ |
 Tables use singular `snake_case`.  | `user`, `order_item`       | `users`, `order_items`   |
 Columns use `snake_case`.          | `created_at`, `updated_at` | `createdAt`, `CreatedAt` |
 PK is `id`; FK is `<singular>_id`. | `id`, `user_id`            | `userId`, `userID`       |

- Database Schemas (por bounded context)

  - `identity`: identidad y acceso.
  - `projects`: proyectos, módulos, entornos, equipos y roles.
  - `operations`: solicitudes, aprobaciones y ejecuciones.
  - `audit`: auditoría.

  Ejemplos:

  - `identity.user`
  - `projects.project`
  - `projects.project_module`
  - `projects.project_environment`
  - `projects.team`
  - `projects.project_role`
  - `audit.audit_log`

Documentacion:

- Este documento es el indice maestro.
- Vision y objetivos: ver Seccion 1.
- Alcance y MVP: ver Seccion 3.
- Dominio, permisos y datos: ver Secciones 4, 6, 7 y 8.
- Requerimientos no funcionales: ver Seccion 10.
- Casos de uso: ver Seccion 11.
- Arquitectura y ADRs: ver Seccion 13.
- API y matriz de acceso: ver Seccion 16.
- Mantener fecha de actualizacion en la portada de este documento.

CI:

- CircleCI usa `scripts/ci.sh`.
- El script debe ser idempotente y fallar solo ante errores reales.

## 20. Glosario

- Proyecto: iniciativa o producto gestionado.
- Modulo: componente funcional dentro de un proyecto.
- Entorno: instancia de despliegue (Dev, QA, Prod).
- Equipo: grupo de personas responsables de uno o mas modulos.
- Rol de proyecto: conjunto de permisos dentro de un proyecto.
- Solicitud: peticion formal para ejecutar una accion.
