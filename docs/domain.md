# Domain

## Ubiquitous Language

| Termino               | Definicion                                                                    |
| --------------------- | ----------------------------------------------------------------------------- |
| Proyecto              | Producto o iniciativa dentro de la plataforma.                             |
| Modulo                | Parte funcional de un proyecto.                                               |
| Equipo                | Grupo de usuarios asignados a un proyecto/modulo.                             |
| Usuario               | Persona con acceso a la plataforma.                                           |
| Rol                   | Conjunto de permisos.                                                         |
| Permiso               | Accion granular dentro del sistema.                                           |
| Herramienta           | Utilidad operativa (SQL Runner, Deploy Runner).                               |
| Ambiente de operación | Etapa del flujo de un proyecto (dev, demo, staging, prod).                    |
| Solicitud             | Pedido para ejecutar una accion en una herramientra sobre un proyecto/modulo. |
| Aprobación            | Decision sobre una solicitud.                                                 |
| Ejecución             | Resultado de la solicitud con auditoría.                                      |

## Domain Model

## Bounded Contexts

- Identidad y Acceso (Usuarios, Roles, Permisos)
- Proyecto y Equipo (Proyectos, Módulos, Equipos, Ambiente de operación)
- Operación de Herramientas (Herramientas, Solicitudes, Aprobaciónes, Ejecuciónes)
- Auditoría (Eventos)

## Context Map

Identidad y Acceso provee autorización al resto. Proyectos y Equipos define el alcance operativo. Operación de Herramientas consume ambos y publica eventos de Auditoría.

## Entidades

- Proyecto: agrupa módulos y equipos asignados.
- Equipo: usuarios con roles en un proyecto.
- Solicitud: estado y datos de la accion solicitada.

## Value Objects

- AmbienteOperaciónTipo (dev, demo, staging, prod)
- RolTemporal (periodo de vigencia)

## Agregados


- Proyecto (root).
- Equipo (root).
- Solicitud (root) con Aprobaciónes y Ejecuciónes.

## Relaciones (cardinalidades)

- Proyecto 1..* Módulos
- Proyecto 0..* Equipos (equipos asignados a proyectos)
- Equipo 2..* Usuarios (via team_members)
- Equipo 0..2 Usuarios con type leader/leader_temp (en team_members)
- Usuario 0..* Roles
- Rol 0..* Permisos
- Usuario 0..* Permisos (asignaciones directas)
- Proyecto 1..* AmbientesOperación
- Proyecto 0..* Herramientas habilitadas
- Solicitud 1..1 Proyecto
- Solicitud 1..1 Herramienta
- Solicitud 1..1 AmbienteOperación
- Solicitud 0..1 Modulo
- Solicitud 0..* Aprobaciónes
- Solicitud 0..* Ejecuciónes

## Invariantes (minimas)

- Un Equipo debe pertenecer a un Proyecto.
- Un Modulo debe pertenecer a un Proyecto.
- Un Equipo debe tener al menos 2 miembros.
- Un Equipo puede tener hasta 2 miembros con type leader/leader_temp.
- Un Usuario solo puede solicitar sobre proyectos/módulos a los que su equipo este asignado.
- Una Solicitud solo puede ejecutarse si fue aprobada segun sus reglas.
- Aprobación minima: 1, configurable a 2 o 3.
- Se puede requerir aprobación de un rol especifico, configurable por entorno.
- Las reglas de aprobación (minimo y rol requerido) son configurables por entorno/proyecto.
- Toda Ejecución debe generar un evento de Auditoría.
- Permisos temporales deben tener ventana de vigencia (from/to).
- Una Solicitud solo puede crearse si la herramienta esta habilitada en el proyecto.
- Modelo de permisos whitelist: si no tiene permiso explicito, no puede.
- Endpoints self-service (/me/*) validan solo JWT (sin permisos).

## Eventos de Dominio (minimos)

- project.created
- module.created
- team.created
- user.created
- role.assigned
- role.revoked
- permission.assigned
- permission.revoked
- request.created
- request.approved
- request.rejected
- request.executed
- audit.logged

## Use Cases (Application Layer)

## CreateUser

## Input

- `nombre`
- `email`
- `password`

## Output

- `userId`
- `user`

## Reglas

- El `email` debe ser unico.
- El usuario pertenece a un proyecto valido.
- La password se almacena hasheada.

## Eventos

- `user.created`

## AssignBaseRole

## Input

- `userId`
- `roleId`

## Output

- `userId`
- `roleId`

## Reglas

- El rol debe existir.
- El usuario debe existir.
- No se duplican asignaciones del mismo rol.

## Eventos

- `role.assigned`

## GrantPermission

## Input

- `subjectType` (user|role)
- `subjectId`
- `permissionId`
- `scope` (global|project|module|environment)
- `scopeId`
- `from` (opcional)
- `to` (opcional)

## Output

- `assignmentId`

## Reglas

- `permissionId` debe existir y representa la accion.
- `scope` y `scopeId` deben ser validos.
- Si `from`/`to` existen, `from` < `to`.
- No se duplican permisos equivalentes en el mismo scope.

## Ejemplo

- `subjectType=user`, `subjectId=u_123`
- `permissionId=sql.run`
- `scope=environment`, `scopeId=env_prod`

## Eventos

- `permission.assigned`

## EvaluateAccess

## Input

- `userId`
- `permissionId`
- `scope` (global|project|module|environment)
- `scopeId`
- `toolId` (opcional)
- `timestamp` (opcional, default: now)

## Output

- `allowed` (boolean)
- `reason` (string)

## Reglas

- Modelo whitelist: si no tiene permiso explicito, no puede.
- No existe blacklist/deny explicito.
- El acceso se resuelve por RBAC + permisos directos.
- Asignaciones temporales solo aplican dentro de su ventana de vigencia.
- Si `toolId` existe, la herramienta debe estar habilitada en el proyecto.

## Ejemplo

- `userId=u_123`, `permissionId=deploy.execute`
- `scope=project`, `scopeId=proj_9`, `toolId=deploy_runner`

## Eventos

- Ninguno

## ChangePassword

## Input

- `userId`
- `currentPassword`
- `newPassword`

## Output

- `status`

## Reglas

- Validar password actual.
- Cumplir politicas de password.

## Eventos

- `user.password_changed`

## RequestPasswordReset

## Input

- `email`

## Output

- `status`

## Reglas

- Si el email existe, emitir token (respuesta indistinguible si no existe).
- Token con TTL.

## Eventos

- `user.password_reset_requested`

## ResetPassword

## Input

- `token`
- `newPassword`

## Output

- `status`

## Reglas

- Token valido y no expirado.
- Invalidar token al usarlo.

## Eventos

- `user.password_reset`

## VerifyEmail

## Input

- `token`

## Output

- `status`

## Reglas

- Token valido y no expirado.
- Marcar email como verificado.

## Eventos

- `user.email_verified`

## SelfServiceProfile

## Input

- `userId`

## Output

- `user`

## Reglas

- Solo puede acceder a su propio perfil.

## Eventos

- Ninguno

## SelfUpdateProfile

## Input

- `userId`
- `campos` (nombre, email, etc.)

## Output

- `user`

## Reglas

- Solo puede modificar su propio perfil.
- Email cambio requiere verificación.

## Eventos

- `user.profile_updated`

## SelfChangePassword

## Input

- `userId`
- `currentPassword`
- `newPassword`

## Output

- `status`

## Reglas

- Solo puede modificar su propia password.
- Validar password actual.

## Eventos

- `user.password_changed`




