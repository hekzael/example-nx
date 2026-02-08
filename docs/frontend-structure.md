# Frontend Structure Proposal

Direcciï¿½n: interfaz tï¿½cnica y densa, centrada en flujo de solicitudes y trazabilidad. El usuario final opera solicitudes; el backoffice administra estructura, roles y herramientas.

## Estructura de carpetas

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

## Separaciï¿½n de experiencia

### Usuario final (operativo)

- Solicitudes (crear, ver estado, ejecutar)
- Aprobaciónes (si aplica)
- Auditorï¿½a (ver eventos de sus solicitudes)
- Herramientas (SQL Runner, Deploy Runner)

### Backoffice (administraciï¿½n)

- Proyectos / Mï¿½dulos
- Equipos
- Usuarios
- Roles y permisos
- Ambientes
- Habilitaciï¿½n de herramientas

## Pantallas clave

### Usuario final

- `RequestsList`: lista con estados, ambiente, herramienta.
- `RequestDetail`: timeline de solicitud (Aprobaciónes, ejecuciï¿½n, auditorï¿½a).
- `CreateRequest`: wizard por herramienta (SQL/Deploy).
- `MyApprovals`: solicitudes pendientes de aprobaciï¿½n.
- `AuditTrail`: eventos de solicitudes propias.

### Backoffice

- `Projects`: proyectos, mï¿½dulos y ambientes.
- `Teams`: miembros con `type` (member|leader|leader_temp).
- `Users`: gestiï¿½n y asignaciones.
- `RolesPermissions`: matriz por scope.
- `Tools`: habilitacion por proyecto.

## Flujos principales

1. **Crear solicitud**
   - Seleccionar herramienta
   - Elegir proyecto/ambiente/mï¿½dulo
   - Validar permisos + herramienta habilitada
   - Enviar solicitud

2. **Aprobaciï¿½n**
   - Ver solicitudes pendientes
   - Validar reglas (mï¿½nimo y rol requerido)
   - Aprobar o rechazar con comentario

3. **Ejecuciï¿½n**
   - Solicitud aprobada
   - Ejecutar (manual o automï¿½tica)
   - Registrar resultado

4. **Auditorï¿½a**
   - Timeline por solicitud
   - Filtros por estado, ambiente, herramienta

## Routing sugerido

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

## UI Signature

- Timeline vertical en detalle de solicitud con eventos y evidencias.

## Navigation Map

- `App`
- `Requests`
- `Requests > Detail`
- `Requests > New`
- `Approvals`
- `Audit`
- `Admin`
- `Admin > Projects`
- `Admin > Teams`
- `Admin > Users`
- `Admin > Roles & Permissions`
- `Admin > Environments`
- `Admin > Tools`

## Wireframes (textual)

### Requests List

- Header: "Requests"
- Filters: status, environment, tool, project
- List rows: status chip, request title, environment, tool, requester, updated at
- CTA: "New Request"

### Request Detail (Timeline)

- Header: request id + status
- Left: timeline vertical (created, approvals, execution, audit)
- Right: request payload + context (project/module/env/tool)
- Actions: approve/reject (if pending), execute (if approved)

### Create Request (Wizard)

- Step 1: select tool
- Step 2: select project/environment/module
- Step 3: payload (SQL or Deploy params)
- Step 4: review + submit

### Approvals

- List: pending approvals
- Detail drawer: request context + required approvals
- Actions: approve/reject with comment

### Admin - Roles & Permissions

- Matrix: roles x permissions
- Scope selector: global/project/module/environment
- Assign panel: add/remove permissions

### Admin - Projects

- Header: "Projects"
- List: name, project, environments count, tools enabled
- Actions: create/edit/delete project
- Detail: modules, environments, tool enablement

### Admin - Teams

- Header: "Teams"
- List: team name, project, members count, leaders
- Detail: members with type (member|leader|leader_temp)
- Actions: add/remove member, update type, set time window

### Admin - Users

- Header: "Users"
- List: name, email, project, roles
- Detail: roles, permissions directas, activity
- Actions: assign role, grant permission, disable user

### Admin - Tools

- Header: "Tools"
- List: tool name, type, enabled projects
- Detail: where enabled + status
- Actions: enable/disable per project

## Estados (vacï¿½o, loading, error)

- Empty: no requests / no approvals / no audit events / no users.
- Loading: skeletons para listas y detalle.
- Error: banner con retry y detalle tï¿½cnico colapsable.

## Auth Flows (Frontend)

### Pantallas

- `Login`
- `ForgotPassword`
- `ResetPassword`
- `VerifyEmail`
- `ChangePassword` (en perfil)

### Flujos

1. **Forgot Password**
   - Usuario ingresa email
   - Mensaje generico
   - Email con link/token

2. **Reset Password**
   - Usuario abre link con token
   - Ingresa nueva password
   - Confirmacion

3. **Verify Email**
   - Usuario abre link con token
   - Email verificado

4. **Change Password**
   - Usuario autenticado
   - Ingresa password actual + nueva
## Self Service (Frontend)

### Pantallas

- `Profile`
- `ProfileEdit`
- `ChangePassword`

### Flujos

1. **Profile**
   - Ver datos personales (/me)
2. **Edit Profile**
   - Actualizar nombre/email
   - Si cambia email: requerir verificación
3. **Change Password**
   - Requiere password actual





