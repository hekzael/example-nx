# Vertical Slice - Administracion de Roles y Permisos

Este slice cubre la administracion completa de roles, permisos y asignaciones por scope.

## Objetivo

Crear un rol, asignar permisos por scope y aplicarlo a un usuario.

## Alcance

- UI (backoffice)
- API (backend)
- Dominio (reglas)
- Persistencia (DB)
- Auditoría (eventos)

## Precondiciones

- Usuario admin con permisos de administracion.
- Proyecto existente.

## Flujo

### 1) UI - Crear rol

Pantalla: `RolesPermissions`

Inputs:

- `nombre`
- `descripción`

Accion:

- POST `/roles`

### 2) API - Validaciones

- Rol no duplicado en la plataforma.
- Usuario tiene permiso `roles.manage` (scope global).

### 3) Asignar permisos al rol

Inputs:

- `permissionIds[]`
- `scope` + `scopeId`

Accion:

- POST `/roles/{id}/permissions`

Reglas:

- `permissionId` valido.
- `scope` valido.

### 4) Asignar rol a usuario

Inputs:

- `roleId`
- `userId`
- `from`/`to` (opcional)

Accion:

- POST `/users/{id}/roles`

### 5) Auditoría

Eventos:

- `role.created`
- `permission.assigned`
- `role.assigned`
- `audit.logged`

## Resultado

- Usuario puede operar segun permisos del rol en el scope definido.
- Registro completo de auditoría.








