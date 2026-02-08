# Vertical Slice - Create & Execute Request (SQL Runner)

Este slice recorre de punta a punta el flujo principal desde UI hasta auditoría.

## Objetivo

Crear una solicitud SQL, aprobarla, ejecutarla y auditarla.

## Alcance

- UI (frontend)
- API (backend)
- Dominio (reglas)
- Persistencia (DB)
- Auditoría (eventos)

## Precondiciones

- Herramienta `SQL Runner` habilitada para el proyecto.
- Usuario con permiso `sql.run` en scope `environment`.
- Reglas de aprobación: minimo 1 (configurable).

## Flujo

### 1) UI - Crear solicitud

Pantalla: `CreateRequest` (wizard)

Inputs:

- `tool=sql_runner`
- `projectId`
- `environmentId`
- `moduleId` (opcional)
- `payload.sql`

Accion:

- POST `/projects/{projectId}/requests`

### 2) API - Validaciones

- Verificar herramienta habilitada en proyecto.
- Verificar permisos (`sql.run`) en scope solicitado.
- Crear `request` con estado `PENDING_APPROVAL`.

### 3) Dominio - Invariantes

- Solicitud solo puede crearse si herramienta habilitada.
- Solicitud requiere aprobación minima >= 1 (configurable).

### 4) Persistencia

Tablas:

- `requests`
- `approvals` (vacia inicialmente)
- `audit_events` (evento `request.created`)

### 5) Aprobación

Pantalla: `MyApprovals`

Accion:

- POST `/requests/{id}/approve`

Validaciones:

- Rol del aprobador y scope.
- Regla de minimo Aprobaciónes.

### 6) Ejecución

Accion:

- POST `/requests/{id}/execute`

Validaciones:

- Solicitud aprobada.
- Usuario con permiso `sql.run`.

### 7) Auditoría

Eventos:

- `request.created`
- `request.approved`
- `request.executed`
- `audit.logged`

## Resultado

- Solicitud ejecutada.
- Auditoría completa en `audit_events`.
- Timeline visible en `RequestDetail`.






