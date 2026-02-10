# Magic Tool - Documento de Proyecto

> Estado: Draft  
> Ultima actualizacion: 2026-02-09  
> Responsable: Eulis Blanco

## 1. Vision y Objetivos

El objetivo es desarrollar una plataforma centralizada y escalable para gestionar el ciclo de vida de desarrollo de multiples proyectos, orquestando equipos y operaciones criticas (despliegues, scripts, configuraciones) de manera segura y auditable.

Metas principales:

- Escalabilidad: separar definicion de estructuras (proyectos, modulos, entornos) de la asignacion de personas (equipos).
- Seguridad operativa: ejecuciones controladas por solicitudes y aprobaciones.
- Auditoria total: trazabilidad completa de quien autorizo y ejecuto cada accion.
- Flexibilidad operativa: flujos de aprobacion configurables y roles temporales internos de equipo.

## 2. Problema, Impacto y Propuesta de Valor

Problema actual:

- Solicitudes manuales, aprobaciones por chat/correo y ejecuciones sin registro centralizado.
- Herramientas aisladas y procesos ad-hoc sin gobernanza.

Impacto:

- Operativo: demoras, errores en produccion, inconsistencia entre ambientes.
- Economico: downtime, retrabajo, perdida de productividad.
- Legal y compliance: falta de trazabilidad y auditoria.

Propuesta de valor:

- Trazabilidad completa y flujo estandarizado para cambios en datos y despliegues sin frenar la velocidad del equipo.

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
- Gestion de usuarios.
- Configuracion de ambientes por proyecto.
- Gestion de herramientas: SQL Runner y Deploy Runner.
- Flujo de solicitudes: crear, aprobar o rechazar, comentar, ejecutar y auditar.

MVP incluye:

- Alta de usuarios y herramientas.
- Alta de equipos, proyectos, modulos y ambientes.
- Asignar herramientas a proyectos.
- Solicitudes, aprobacion o rechazo, ejecucion y auditoria.

MVP excluye:

- Integraciones avanzadas adicionales a Rundeck.
- Reporteria avanzada y BI.
- Automatizaciones complejas de CI/CD.

Alcance tecnico inicial:

- Tenancy: single-tenant (tenant implicito, sin multi-tenant).
- Aprobaciones: minimo 1, configurable a 2 o 3.
- Herramientas: habilitadas solo por proyecto.
- Self-service: `/me/*` JWT-only (sin controles adicionales).
- Backoffice: admin completo para configuraciones maestras.

## 4. Modelo de Dominio y Lenguaje Ubicuo

Terminos clave:

- Proyecto: iniciativa o producto gestionado.
- Modulo: componente funcional dentro de un proyecto.
- Entorno: instancia de despliegue (dev, staging, prod, etc.).
- Equipo: grupo de personas responsables de uno o mas modulos.
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

- Identidad y Acceso provee autenticacion al resto.
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

## 6. Modelo de Datos (Resumen)

Entidades principales:

- `user`
- `project`
- `project_environment`
- `project_module`
- `team`
- `team_module`
- `team_member`
- `audit_log`
- `tool`
- `project_tool`
- `request`
- `request_approval`
- `request_execution`
- `request_comment`
- `request_event`

Diccionario de datos (tablas core):

Usuarios (user):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `user_id` | UUID | PK |
| `email` | String | Unique |
| `display_name` | String | Nombre a mostrar |
| `password_hash` | String | Hash de password |
| `is_active` | Boolean | Default true |

Proyectos (project):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `project_id` | UUID | PK |
| `code` | String | Unique (slug) |
| `name` | String | Nombre |

Entornos de proyecto (project_environment):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `project_environment_id` | UUID | PK |
| `project_id` | UUID | FK -> project.project_id |
| `code` | String | dev, staging, prod |
| `name` | String | Development, Production |
| `priority` | Integer | Orden UI |
| `min_approvals` | Integer | Default 1 (1-3) |

Modulos de proyecto (project_module):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `project_module_id` | UUID | PK |
| `project_id` | UUID | FK -> project.project_id |
| `code` | String | sales, catalog |
| `name` | String | Nombre |

Equipos (team):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `team_id` | UUID | PK |
| `project_id` | UUID | FK -> project.project_id |
| `name` | String | Nombre |

Asignacion equipo-modulo (team_module):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `team_id` | UUID | FK -> team.team_id |
| `module_id` | UUID | FK -> project_module.project_module_id |

Miembros de equipo (team_member):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `team_member_id` | UUID | PK |
| `team_id` | UUID | FK -> team.team_id |
| `user_id` | UUID | FK -> user.user_id |
| `role` | Enum | LEADER_PRIMARY, LEADER_TEMP, MEMBER |
| `valid_from` | Datetime | Inicio vigencia |
| `valid_until` | Datetime | Fin vigencia nullable |

Herramientas (tool):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `tool_id` | UUID | PK |
| `code` | String | Unique (sql_runner, deploy_runner) |
| `name` | String | Nombre |
| `description` | String | Descripcion corta (nullable) |
| `is_active` | Boolean | Default true |

Herramientas habilitadas por proyecto (project_tool):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `project_tool_id` | UUID | PK |
| `project_id` | UUID | FK -> project.project_id |
| `tool_id` | UUID | FK -> tool.tool_id |
| `is_enabled` | Boolean | Default true |
| `configuration` | JSON | Configuracion por proyecto |

Solicitudes (request):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `request_id` | UUID | PK |
| `title` | String | Titulo de la solicitud |
| `description` | String | Descripcion corta (nullable) |
| `url_ticket` | String | URL del ticket en Jira (requerido) |
| `project_id` | UUID | FK -> project.project_id |
| `module_id` | UUID | FK -> project_module.project_module_id (nullable) |
| `environment_id` | UUID | FK -> project_environment.project_environment_id |
| `tool_id` | UUID | FK -> tool.tool_id |
| `status` | Enum | PENDING_APPROVAL, APPROVED, REJECTED, EXECUTING, EXECUTED, FAILED, CANCELLED |
| `payload` | JSON | Datos de ejecucion (sql, params, etc.) |
| `created_by` | UUID | FK -> user.user_id |
| `updated_by` | UUID | FK -> user.user_id (nullable) |
| `created_at` | Datetime | Creacion |
| `updated_at` | Datetime | Ultima actualizacion (nullable) |

Aprobaciones (request_approval):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `request_approval_id` | UUID | PK |
| `request_id` | UUID | FK -> request.request_id |
| `approved_by` | UUID | FK -> user.user_id |
| `decision` | Enum | APPROVED, REJECTED |
| `comment` | String | Nullable |
| `created_at` | Datetime | Fecha |

Comentarios (request_comment):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `request_comment_id` | UUID | PK |
| `request_id` | UUID | FK -> request.request_id |
| `body` | String | Comentario |
| `created_by` | UUID | FK -> user.user_id |
| `updated_by` | UUID | FK -> user.user_id (nullable) |
| `created_at` | Datetime | Fecha |
| `updated_at` | Datetime | Ultima actualizacion |

Ejecuciones (request_execution):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `request_execution_id` | UUID | PK |
| `request_id` | UUID | FK -> request.request_id |
| `executed_by` | UUID | FK -> user.user_id (nullable si sistema) |
| `status` | Enum | SUCCESS, FAILED |
| `output_ref` | String | URL/ID de evidencia/log |
| `started_at` | Datetime | Inicio |
| `finished_at` | Datetime | Fin |

Auditoria (audit_log):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `audit_log_id` | UUID | PK |
| `event_type` | String | request.created, request.executed, etc. |
| `entity_type` | String | request, project, user, etc. |
| `entity_id` | UUID | ID de entidad |
| `actor_id` | UUID | FK -> user.user_id (nullable si sistema) |
| `payload` | JSON | Contexto del evento |
| `created_at` | Datetime | Fecha |

Auditoria de Solicitudes (request_event):
| Columna | Tipo | Descripcion |
| --- | --- | --- |
| `request_event_id` | UUID | PK |
| `request_id` | UUID | FK -> request.request_id |
| `trace_id` | UUID | FK -> trace.trace_id |
| `session_id` | UUID | FK -> session.session_id |
| `actor_id` | UUID | FK -> user.user_id |
| `actor_type` | String | USER, SYSTEM |
| `action` | String | Accion |
| `resource` | String | Recurso |
| `outcome` | String | Resultado |
| `resolved_by` | String | Resuelto por |
| `ip_address` | String | IP |
| `user_agent` | String | Agente |
| `metadata` | JSON | Metadata |
| `occurred_at` | Datetime | Fecha en que ocurre |
| `created_at` | Datetime | Fecha en que se guarda el registro |

Seeds minimos:

- Tools: `sql_runner`, `deploy_runner`.

Indices y uniques (baseline):

- `user`: unique (`email`)
- `project`: unique (`code`)
- `project_environment`: unique (`project_id`, `code`)
- `project_module`: unique (`project_id`, `code`)
- `team`: unique (`project_id`, `name`)
- `team_module`: unique (`team_id`, `module_id`)
- `team_member`: unique (`team_id`, `user_id`, `valid_from`)
- `tool`: unique (`code`)
- `project_tool`: unique (`project_id`, `tool_id`)
- `request`: index (`project_id`, `status`), index (`created_by`)
- `request_approval`: unique (`request_id`, `approved_by`)
- `request_execution`: index (`request_id`), index (`status`)
- `request_comment`: index (`request_id`)
- `audit_log`: index (`entity_type`, `entity_id`), index (`created_at`)
- `request_event`: index (`request_id`), index (`occurred_at`)

## 7. Reglas e Invariantes

Reglas minimas:

- Equipo pertenece a un proyecto.
- Modulo pertenece a un proyecto.
- Equipo debe tener al menos 2 miembros.
- Un equipo puede tener hasta 2 miembros con rol leader/leader_temp.
- Solicitud solo puede crearse si la herramienta esta habilitada.
- Solicitud solo se ejecuta si fue aprobada segun reglas.
- Aprobacion minima 1, configurable a 2 o 3.
- Toda ejecucion debe generar auditoria.
- Endpoints self-service `/me/*` validan solo JWT valido.

Estados y transiciones de Solicitud:

- Estados: `PENDING_APPROVAL -> APPROVED -> EXECUTING -> EXECUTED`
- Rechazo: `PENDING_APPROVAL -> REJECTED`
- Fallo: `EXECUTING -> FAILED`
- Cancelacion: `PENDING_APPROVAL -> CANCELLED` (solo creador o admin)

Diagrama textual de estados:

```
PENDING_APPROVAL
  -> APPROVED
  -> REJECTED
  -> CANCELLED
APPROVED
  -> EXECUTING
EXECUTING
  -> EXECUTED
  -> FAILED
```

Reglas de aprobacion:

- Un usuario solo puede aprobar/rechazar una vez por solicitud.
- Una solicitud con rechazo queda en `REJECTED` y no puede ejecutarse.

Agregados:

- Proyecto (root).
- Equipo (root).
- Solicitud (root) con aprobaciones y ejecuciones.

Relaciones principales:

- Proyecto 1..* Modulos.
- Proyecto 0..* Equipos.
- Equipo 2..* Usuarios (via team_member).
- Equipo 0..2 Usuarios con type leader o leader_temp.
- Proyecto 1..* AmbientesOperacion.
- Proyecto 0..* Herramientas habilitadas.
- Solicitud 1..1 Proyecto.
- Solicitud 1..1 Herramienta.
- Solicitud 1..1 AmbienteOperacion.
- Solicitud 0..1 Modulo.
- Solicitud 0..* Aprobaciones.
- Solicitud 0..* Ejecuciones.

## 8. Modulos Funcionales

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

Tokens y seguridad:

- Access token JWT: 15 minutos.
- Refresh token: 7 dias, rotacion en cada refresh.
- Reuso de refresh token invalido = revocar sesion.
- Almacenamiento sugerido: cookie `HttpOnly` + `Secure` para refresh; access en `Authorization` header.

Gestion de Recursos:

- ABM de proyectos, modulos, entornos.
- Equipos y staffing con roles internos.

Operaciones y Herramientas:

- Orquestador de acciones criticas.
- Flujo: solicitud -> aprobacion -> ejecucion -> auditoria.

Contrato del modulo Operations:

Scope:

- Orquesta solicitudes de herramientas (SQL Runner, Deploy Runner).
- Administra aprobaciones, ejecucion y auditoria de cada request.

Entidades core:

- `request`
- `request_approval`
- `request_execution`
- `request_comment`

Use cases (Application Layer):

1. `CreateRequest`
   Input: `project_id`, `environment_id`, `module_id?`, `tool_id`, `title`, `description?`, `url_ticket`, `payload`
   Output: `request_id`, `status=PENDING_APPROVAL`
   Reglas: tool habilitada en proyecto; `url_ticket` obligatorio.

2. `ApproveRequest`
   Input: `request_id`, `approved_by`, `comment?`
   Output: `request_id`, `status` (puede seguir en `PENDING_APPROVAL` o pasar a `APPROVED`)
   Reglas: no doble aprobacion.

3. `RejectRequest`
   Input: `request_id`, `approved_by`, `comment?`
   Output: `request_id`, `status=REJECTED`
   Reglas: no doble decision.

4. `ExecuteRequest`
   Input: `request_id`, `executed_by?`, `comment?`
   Output: `request_execution_id`, `status=EXECUTING|EXECUTED|FAILED`
   Reglas: aprobaciones completas, tool habilitada.

5. `CommentRequest`
   Input: `request_id`, `body`, `created_by`
   Output: `request_comment_id`
   Reglas: `body` requerido.

6. `GetRequest` / `ListRequests`
   Input: `request_id` o filtros.
   Reglas: filtros por proyecto/entorno/estado.

Eventos emitidos:

- `request.created`: `request_id`, `project_id`, `environment_id`, `module_id`, `tool_id`, `created_by`, `created_at`
- `request.approved`: `request_id`, `approved_by`, `comment`, `created_at`
- `request.rejected`: `request_id`, `approved_by`, `comment`, `created_at`
- `request.executed`: `request_id`, `executed_by`, `status`, `output_ref`, `created_at`

Integracion Runner:

- SQL Runner: ejecucion sincrona o job async segun tamano.
- Deploy Runner: trigger Rundeck y persistir `executionId`.

Payload requerido por herramienta:

- SQL Runner (`tool.code = sql_runner`):
  - `payload.sql` (string, requerido)
  - `payload.params` (object, opcional)
  - `payload.dryRun` (boolean, opcional)
  - La base de datos se resuelve por el contexto seleccionado (project/module/environment), no va en el payload.

- Deploy Runner (`tool.code = deploy_runner`):
  - `payload.jobId` (string, requerido)
  - `payload.version` (string, requerido)
  - `payload.strategy` (string, opcional: rolling|blue-green|canary)
  - `payload.notes` (string, opcional)

Dominio de Operations (DDD):

Agregado principal:

- `Request` (aggregate root)

Entidades dentro del agregado:

- `RequestApproval`
- `RequestExecution`
- `RequestComment`

Value Objects:

- `RequestId`
- `ProjectId`
- `ProjectEnvironmentId`
- `ProjectModuleId` (nullable)
- `ToolId`
- `RequestStatus`
- `ApprovalDecision`
- `ExecutionStatus`
- `RequestPayload`
- `TicketUrl`

Reglas del agregado `Request`:

- Crea en `PENDING_APPROVAL` con `url_ticket` obligatorio.
- Solo permite aprobaciones mientras el estado sea `PENDING_APPROVAL`.
- Un usuario no puede aprobar o rechazar dos veces la misma solicitud.
- Rechazo transiciona a `REJECTED` y bloquea ejecucion.
- Ejecucion solo si estado `APPROVED` y aprobaciones completas.

Servicios de dominio:

- `ApprovalPolicy` calcula si una solicitud cumple `min_approvals`.
- `PayloadPolicy` valida payload segun `tool.code`.

Eventos de dominio:

- `RequestCreated`
- `RequestApproved`
- `RequestRejected`
- `RequestExecuted`

Repositorios (ports):

- `RequestRepository` (persistencia del agregado y sus entidades)
- `RequestApprovalRepository` (opcional si se separa persistencia)

Puertos hacia otros contextos:

- `ToolResolver` (verifica tool habilitada en proyecto)
- `ScopeResolver` (resuelve contexto y entorno)

Estrategia de payload por herramienta:

- `RequestPayload` es polimorfico segun `tool.code` (union de tipos).
- Validacion por herramienta con `ToolPayloadValidator` (estrategia por tool).
- Persistencia: `request.payload` JSON con discriminador `tool_code` o `tool_id`.

Ejemplos:

- `SqlRunnerPayload`: `{ sql, params?, dryRun? }`
- `DeployRunnerPayload`: `{ jobId, version, strategy?, notes? }`

Flujo de trabajo estandar:

1. Solicitud: crear solicitud con proyecto, modulo y entorno.
2. Revision y aprobacion: validar reglas por entorno.
3. Ejecucion: automatica o manual segun herramienta.
4. Auditoria: registro inmutable del ciclo completo.

Integracion Rundeck (Deploy Runner):

- Auth: token (header `X-Rundeck-Auth-Token`).
- Trigger job: POST `/api/41/job/{jobId}/run` con payload `{ "argString": "-project X -env Y -requestId Z" }`.
- Status: GET `/api/41/execution/{executionId}`.
- Guardar `executionId` en `request_execution.output_ref`.

## 9. Requerimientos No Funcionales

Seguridad:

- Autenticacion JWT + refresh.
- Auditoria de solicitudes, aprobaciones, ejecuciones y cambios de configuracion.
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

Observabilidad:

- Logs estructurados JSON con `request_id`, `user_id`, `project_id`, `module_id`, `environment_id`, `tool_id`.
- Correlation ID por request (header `X-Request-Id`).
- Metricas minimas: latency p95/p99, error rate, throughput, ejecuciones por tool, aprobaciones por dia.

Soft delete y retencion:

- Soft delete en: `project`, `project_module`, `project_environment`, `team`, `user`.
- No soft delete en: `request`, `request_approval`, `request_execution`, `audit_log` (inmutables).
- Retencion de `audit_log`: 12 meses (baseline).

## 10. Casos de Uso (FRD)

UC-01 Configuracion general
Descripcion: configurar parametros globales de la plataforma.
Actor: Administrador de plataforma.
Reglas: solo administradores pueden gestionar configuracion.

UC-03 Gestion de proyectos, modulos y equipos
Descripcion: crear, editar y eliminar proyectos y modulos; asignar equipos.
Actor: Administrador de plataforma y usuarios autorizados.
Reglas: equipos pertenecen a un proyecto, modulos pertenecen a un proyecto.

UC-04 Solicitud SQL Runner
Descripcion: generar solicitud para ejecutar query o migracion.
Actor: Usuario asignado al modulo.
Reglas: solo en ambientes permitidos y con modulos asignados.

UC-05 Aprobacion o rechazo de solicitud
Descripcion: aprobar o rechazar solicitudes.
Actor: Usuario aprobado como revisor.
Reglas: minimo 1 aprobacion, configurable a 2 o 3.

UC-06 Ejecucion y auditoria
Descripcion: ejecutar solicitud y registrar auditoria.
Actor: Sistema o usuario asignado.
Reglas: toda ejecucion queda auditada.

UC-07 Solicitud Deploy Runner
Descripcion: gestionar despliegues integrados con Rundeck via API.
Actor: Desarrollador o lider tecnico.
Reglas: ambientes y proyectos habilitados. Solo puede ejecutar solicitudes previamente aprobadas.

UC-08 Asignacion de herramientas
Descripcion: habilitar herramientas por proyecto.
Actor: Administrador de plataforma o usuario autorizado.

Casos de uso tecnicos (Application Layer):

- CreateUser: email unico, password hasheada. Evento `user.created`.
- ChangePassword: validar password actual y politicas. Evento `user.password_changed`.
- RequestPasswordReset: token con TTL. Evento `user.password_reset_requested`.
- ResetPassword: token valido y no expirado. Evento `user.password_reset`.
- VerifyEmail: token valido y no expirado. Evento `user.email_verified`.
- SelfServiceProfile: solo puede acceder a su propio perfil.
- SelfUpdateProfile: cambio de email requiere verificacion. Evento `user.profile_updated`.
- SelfChangePassword: validar password actual. Evento `user.password_changed`.

## 11. Vertical Slices

Vertical Slice 1: Create & Execute Request (SQL Runner)
Objetivo: crear solicitud SQL, aprobarla, ejecutarla y auditarla.
Precondiciones: herramienta SQL Runner habilitada; aprobacion minima 1.
Flujo:

1. UI CreateRequest envia POST `/projects/{projectId}/requests` con tool, environmentId, moduleId, payload.sql.
2. API valida herramienta habilitada y crea request `PENDING_APPROVAL`.
3. Aprobacion: POST `/requests/{id}/approve` con validaciones de estado.
4. Ejecucion: POST `/requests/{id}/execute` con validacion de aprobacion.
5. Auditoria: eventos `request.created`, `request.approved`, `request.executed`, `audit.logged`.
   Resultado: solicitud ejecutada y timeline visible en RequestDetail.

## 12. Arquitectura y Stack

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
- Projects & Resources (Core Domain): gestiona estructura y contexto operativo.
- Operations & Executions (Generic Subdomain): orquesta ejecuciones.
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

## 13. Estructura de Carpetas

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
- `apps/frontend/src/modules/environments/`

## 14. Experiencia Frontend

Separacion de experiencia:

- Usuario final (operativo): solicitudes, aprobaciones, auditoria, herramientas.
- Backoffice (administracion): proyectos, modulos, equipos, usuarios, ambientes, tools.

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
- Tools

Flujos principales:

1. Crear solicitud: seleccionar herramienta, elegir proyecto/ambiente/modulo, enviar.
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
- Admin > Environments
- Admin > Tools

Wireframes (textual):

- Requests List: header, filtros, lista con chips, CTA New Request.
- Request Detail: header con id y status, timeline vertical, payload y contexto, acciones approve/reject/execute.
- Create Request: wizard con 4 pasos tool, contexto, payload, review.
- Approvals: lista de pendientes, drawer de detalle, acciones approve/reject.
- Admin Projects: lista, actions, detalle con modulos, ambientes, tools.
- Admin Teams: lista, detalle con members y roles internos, acciones de asignacion.
- Admin Users: lista, detalle de cuenta, acciones de gestion.
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

## 15. API

Convenciones:

- Base URL: `/api/v1`
- Respuestas: JSON
- Errores: 400, 401, 403, 404, 409, 422, 500
- Paginacion: `page` (default 1), `pageSize` (default 20, max 100)
- Orden: `sortBy`, `sortDir` (asc|desc)
- Busqueda: `q`
- Filtros comunes: `status`, `projectId`, `moduleId`, `teamId`, `environmentId`, `tool`
- Respuesta paginada: `{ items, total, page, pageSize, pages }`
- Respuesta comun:
  - Create (POST): `201 + recurso`
  - Update (PATCH): `200 + recurso`
  - Delete (DELETE): `204` sin body

Modelo de error (estandar):

```json
{
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "Invalid payload",
    "details": [{ "field": "environmentId", "reason": "required" }]
  }
}
```

DTOs minimos (resumen):

- POST `/auth/login` request: `{ "email": "a@b.com", "password": "..." }`
- POST `/auth/login` response: `{ "accessToken": "...", "refreshToken": "..." }`
- POST `/projects/{projectId}/requests` request: `{ "toolId": "...", "environmentId": "...", "moduleId": "...", "payload": { "sql": "..." } }`
- POST `/projects/{projectId}/requests` response: `{ "id": "...", "status": "PENDING_APPROVAL" }`
- POST `/requests/{id}/approve` request: `{ "comment": "ok" }`
- POST `/requests/{id}/execute` request: `{ "comment": "..." }`

DTOs (detalle):

```json
// Auth
POST /auth/login
{ "email": "a@b.com", "password": "..." }

200
{ "accessToken": "...", "refreshToken": "..." }

POST /auth/refresh
{ "refreshToken": "..." }

200
{ "accessToken": "...", "refreshToken": "..." }

POST /auth/forgot-password
{ "email": "a@b.com" }

POST /auth/reset-password
{ "token": "...", "newPassword": "..." }

POST /auth/verify-email
{ "token": "..." }
```

```json
// Users
POST /users
{ "email": "a@b.com", "displayName": "Ana", "password": "..." }

PATCH /users/{id}
{ "displayName": "Ana P", "isActive": true }
```

```json
// Projects
POST /projects
{ "code": "payments", "name": "Payments" }

POST /projects/{projectId}/modules
{ "code": "billing", "name": "Billing" }

POST /projects/{projectId}/environments
{ "code": "prod", "name": "Production", "priority": 1, "minApprovals": 2 }
```

```json
// Tools
POST /projects/{projectId}/tools
{ "toolId": "...", "isEnabled": true, "config": { "rundeckJobId": "..." } }
```

```json
// Requests
POST /projects/{projectId}/requests
{ "toolId": "...", "toolCode": "sql_runner", "environmentId": "...", "moduleId": null, "title": "Fix index", "description": "...", "urlTicket": "...", "payload": { "sql": "..." } }

POST /requests/{id}/approve
{ "comment": "ok" }

POST /requests/{id}/reject
{ "comment": "no" }

POST /requests/{id}/comment
{ "body": "..." }

POST /requests/{id}/execute
{ "comment": "running" }
```

Validaciones y formatos (baseline):

- `email`: formato RFC5322, lowercase, max 254.
- `password`: min 12, 1 mayus, 1 minus, 1 numero, max 72.
- `project.code`: kebab-case, 2-40 chars.
- `project_module.code`: kebab-case, 2-40 chars.
- `project_environment.code`: lowercase, 2-16 chars.
- `tool.code`: snake_case, 2-32 chars.
- `name`: 2-80 chars.
- `title`: 3-120 chars.
- `description`: max 500.
- `url_ticket`: requerido, URL valida, max 200.
- `payload`: max 2MB.
- `comment`: max 500.
- `pagination.page`: >= 1.
- `pagination.pageSize`: 1-100.

Matriz de errores (baseline):

- `400` VALIDATION_ERROR: payload invalido o campos faltantes.
- `401` UNAUTHORIZED: JWT invalido/expirado.
- `403` FORBIDDEN: acceso no permitido.
- `404` NOT_FOUND: recurso inexistente.
- `409` CONFLICT: duplicado por unique o estado invalido.
- `422` UNPROCESSABLE: reglas de negocio (aprobacion insuficiente, tool no habilitada).

### Endpoints

Auth:

- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`
- POST `/auth/verify-email`
- POST `/me/password`

Self-service (JWT valido):

- GET `/me`
- PATCH `/me`
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

- GET `/tools` (Listado desde DB)
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

## 16. Eventos

Event Map:

1. identity publica eventos hacia projects y audit.
2. projects publica eventos hacia operations y audit.
3. operations publica eventos hacia audit.

Eventos por modulo:

- identity publica: `user.created`, `user.password_changed`, `user.email_verified`.
- projects publica: `project.created`, `module.created`, `team.created`. Consume: `user.created`.
- operations publica: `request.created`, `request.approved`, `request.rejected`, `request.executed`. Consume: `project.created`, `module.created`.
- audit publica: `audit.logged`. Consume: todos los eventos de negocio.

Eventos minimos:

- `project.created`
- `module.created`
- `team.created`
- `user.created`
- `request.created`
- `request.approved`
- `request.rejected`
- `request.executed`
- `audit.logged`

Payload minimo por evento:

- `project.created`: `project_id`, `code`, `name`, `actor_id`, `created_at`
- `module.created`: `project_module_id`, `project_id`, `code`, `name`, `actor_id`, `created_at`
- `team.created`: `team_id`, `project_id`, `name`, `actor_id`, `created_at`
- `user.created`: `user_id`, `email`, `actor_id`, `created_at`
- `request.created`: `request_id`, `project_id`, `environment_id`, `module_id`, `tool_id`, `created_by`, `created_at`
- `request.approved`: `request_id`, `approved_by`, `comment`, `created_at`
- `request.rejected`: `request_id`, `approved_by`, `comment`, `created_at`
- `request.executed`: `request_id`, `executed_by`, `status`, `output_ref`, `created_at`
- `audit.logged`: `audit_log_id`, `event_type`, `entity_type`, `entity_id`, `actor_id`, `created_at`

## 17. Plan de Construccion (Semanal)

Semana 1 - Esqueleto y setup

- Monorepo Nx inicializado.
- Estructura backend y frontend creada.
- CI basico funcionando.

Semana 2 - Infra y Auth

- Configuracion de DB, env y logging.
- Esquema inicial (migraciones base).
- JWT login, logout y refresh.
- Verify email y reset password.

Semana 3 - Core backend

- Self-service `/me` (JWT-only).
- Modulos `identity`, `project`, `operations`, `audit`.
- CRUD de proyectos, modulos, ambientes, equipos.

Semana 4 - Vertical slice y Backoffice

- Crear solicitud, aprobar, ejecutar.
- Auditoria y eventos.
- UI basica para Requests, Approvals y Request Detail.
- Admin: proyectos, equipos, usuarios, tools.

Semana 5 - Hardening y QA

- Tests unit, integration y E2E en flujos criticos.
- Observabilidad (logs, metricas, alertas basicas).
- Ajustes de performance y validaciones.
- Release candidate.

## 18. Convenciones

Estructura del repositorio:

- `apps/`: apps deployables
- `libs/`: librerias reutilizables
- `tools/`: utilidades internas del repo
- `scripts/`: scripts auxiliares
- `docs/`: documentacion

Nombres:

- Carpetas y archivos en `kebab-case`.
- Casos de uso en `PascalCase` dentro de `## 10. Casos de Uso (FRD)` (Use Cases).
- ADRs dentro de `docs/architecture.md` (seccion ADRs).
- **Classes**: `PascalCase`, represent domain or application concepts.
- **Files/Folders**: `kebab-case`, represent technical artifacts.
- **One public class per file**.
- **Avoid ambiguous abbreviations**.
- **Avoid generic suffixes without context** (e.g., `Manager`, `Helper`).

Database Naming

| Notes                                         | Example Correct            | Example Wrong            |
| --------------------------------------------- | -------------------------- | ------------------------ |
| Tables use singular `snake_case`.             | `user`, `order_item`       | `users`, `order_items`   |
| Columns use `snake_case`.                     | `created_at`, `updated_at` | `createdAt`, `CreatedAt` |
| PK is `<singular>_id`; FK is `<singular>_id`. | `user_id`, `project_id`    | `id`, `userId`           |

- Database Schemas (por bounded context)
  - `identity`: identidad y acceso.
  - `projects`: proyectos, modulos, entornos y equipos.
  - `operations`: solicitudes, aprobaciones y ejecuciones.
  - `audit`: auditoria.

  Ejemplos:
  - `identity.user`
  - `projects.project`
  - `projects.project_module`
  - `projects.project_environment`
  - `projects.team`
  - `audit.audit_log`

Documentacion:

- Este documento es el indice maestro.
- Vision y objetivos: ver Seccion 1.
- Alcance y MVP: ver Seccion 3.
- Dominio y datos: ver Secciones 4, 6 y 7.
- Requerimientos no funcionales: ver Seccion 9.
- Casos de uso: ver Seccion 10.
- Arquitectura y ADRs: ver Seccion 12.
- API: ver Seccion 15.
- Mantener fecha de actualizacion en la portada de este documento.

CI:

- CircleCI usa `scripts/ci.sh`.
- El script debe ser idempotente y fallar solo ante errores reales.

## 19. Glosario

- Proyecto: iniciativa o producto gestionado.
- Modulo: componente funcional dentro de un proyecto.
- Entorno: instancia de despliegue (Dev, QA, Prod).
- Equipo: grupo de personas responsables de uno o mas modulos.
- Herramienta: utilidad operativa (SQL Runner, Deploy Runner).
- Solicitud: peticion formal para ejecutar una accion.
