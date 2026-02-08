# API

## API Overview

## Convenciones

- Base URL: /api/v1
- Respuestas: JSON
- Errores comunes: 400, 401, 403, 404, 409, 422, 500
- Paginacion: `page` (default 1), `pageSize` (default 20, max 100)
- Orden: `sortBy` (campo), `sortDir` (asc|desc)
- Busqueda: `q` (texto libre)
- Filtros comunes: `status`, `roleId`, `permissionId`, ``, `projectId`, `moduleId`, `teamId`, `environmentId`, `tool`
- Respuesta paginada: `{ items, total, page, pageSize, pages }`

## Permisos y scope

- `permission` modela la accion (ej. `sql.run`, `deploy.execute`, `requests.approve`).
- `scope` define el alcance: `global | project | module | environment`.
- `scopeId` es el id concreto del recurso.
- Modelo whitelist: si no tiene permiso explicito, no puede.

Ejemplo:

- `permissionId=sql.run`, `scope=environment`, `scopeId=env_prod`
- Resultado: puede ejecutar SQL solo en prod.

## API Endpoints

## Auth

| Metodo | Path                  | Request                          | Response                            | Errores  |
| ------ | --------------------- | -------------------------------- | ----------------------------------- | -------- |
| POST   | /auth/login           | { email, password }              | { accessToken, refreshToken, user } | 400, 401 |
| POST   | /auth/refresh         | { refreshToken }                 | { accessToken, refreshToken }       | 400, 401 |
| POST   | /auth/logout          | { refreshToken }                 | 204                                 | 401      |
| POST   | /auth/forgot-password | { email }                        | 202                                 | 400      |
| POST   | /auth/reset-password  | { token, newPassword }           | 204                                 | 400, 401 |
| POST   | /auth/verify-email    | { token }                        | 204                                 | 400, 401 |
| POST   | /me/password          | { currentPassword, newPassword } | 204                                 | 400, 401 |

## Self-Service

Nota: estos endpoints requieren solo JWT valido (sin permisos).

| Metodo | Path             | Request             | Response    | Errores  |
| ------ | ---------------- | ------------------- | ----------- | -------- |
| GET    | /me              | -                   | 200 + user  | 401      |
| PATCH  | /me              | { campos }          | 200 + user  | 400, 401 |
| GET    | /me/roles        | -                   | 200 + lista | 401      |
| GET    | /me/permissions  | filtros             | 200 + lista | 401      |
| GET    | /me/teams        | -                   | 200 + lista | 401      |
| GET    | /me/requests     | filtros, paginacion | 200 + lista | 401      |
| GET    | /me/approvals    | filtros, paginacion | 200 + lista | 401      |
| GET    | /me/audit-events | filtros, paginacion | 200 + lista | 401      |

## Usuarios

| Metodo | Path                              | Request                            | Response    | Errores       |
| ------ | --------------------------------- | ---------------------------------- | ----------- | ------------- |
| GET    | /users                            | filtros, paginacion                | 200 + lista | 401, 403      |
| POST   | /users                            | { nombre, email, password } | 201 + user  | 400, 409      |
| GET    | /users/{id}                       | -                                  | 200 + user  | 401, 404      |
| PATCH  | /users/{id}                       | { campos }                         | 200 + user  | 400, 403, 404 |
| DELETE | /users/{id}                       | -                                  | 204         | 403, 404      |
| POST   | /users/{id}/roles                 | { roleIds[] }                      | 200         | 400, 404      |
| POST   | /users/{id}/roles/temporary       | { roleId, from, to }               | 200         | 400, 404      |
| POST   | /users/{id}/permissions           | { permissionIds[] }                | 200         | 400, 404      |
| POST   | /users/{id}/permissions/temporary | { permissionId, from, to }         | 200         | 400, 404      |

## Roles y Permisos

| Metodo | Path                                   | Request                 | Response         | Errores  |
| ------ | -------------------------------------- | ----------------------- | ---------------- | -------- |
| GET    | /roles                                 | filtros, paginacion     | 200 + lista      | 401, 403 |
| POST   | /roles                                 | { nombre, descripción } | 201 + role       | 400, 409 |
| GET    | /roles/{id}                            | -                       | 200 + role       | 401, 404 |
| PATCH  | /roles/{id}                            | { campos }              | 200 + role       | 400, 404 |
| DELETE | /roles/{id}                            | -                       | 204              | 404      |
| POST   | /roles/{id}/permissions                | { permissionIds[] }     | 200              | 400, 404 |
| DELETE | /roles/{id}/permissions/{permissionId} | -                       | 204              | 404      |
| GET    | /permissions                           | filtros, paginacion     | 200 + lista      | 401, 403 |
| POST   | /permissions                           | { nombre, descripción } | 201 + permission | 400, 409 |
| GET    | /permissions/{id}                      | -                       | 200 + permission | 401, 404 |
| PATCH  | /permissions/{id}                      | { campos }              | 200 + permission | 400, 404 |
| DELETE | /permissions/{id}                      | -                       | 204              | 404      |

## Proyectos y estructura

| Metodo | Path | Request | Response | Errores |
| ------ | ---- | ------- | -------- | ------- |
| GET | /projects | filtros, paginacion | 200 + lista | 401, 403 |
| POST | /projects | { nombre, descripción } | 201 + project | 400, 404 |
| GET | /projects/{id} | - | 200 + project | 401, 404 |
| PATCH | /projects/{id} | { campos } | 200 + project | 400, 404 |
| DELETE | /projects/{id} | - | 204 | 404 |
| GET | /projects/{projectId}/modules | filtros | 200 + lista | 401, 403 |
| POST | /projects/{projectId}/modules | { nombre, descripción } | 201 + module | 400, 404 |
| GET | /projects/{projectId}/environments | - | 200 + lista | 401, 403 |
| POST | /projects/{projectId}/environments | { nombre, orden } | 201 + environment | 400, 404 |
| GET | /teams | filtros | 200 + lista | 401, 403 |
| POST | /teams | { nombre, members[](1) } | 201 + team | 400, 404 |
| POST | /teams/{teamId}/members | { userIds[] } | 200 | 400, 404 |
| DELETE | /teams/{teamId}/members/{userId} | - | 204 | 404 |

- members[]: lista de { userId, type (member|leader|leader_temp), from?, to? }

## Herramientas y asignaciones

| Metodo | Path                         | Request          | Response    | Errores  |
| ------ | ---------------------------- | ---------------- | ----------- | -------- |
| GET    | /tools                       | -                | 200 + lista | 401, 403 |
| POST   | /tools                       | { nombre, tipo } | 201 + tool  | 400, 409 |
| POST   | /projects/{projectId}/tools  | { toolIds[] }    | 200         | 400, 404 |

## Solicitudes y Ejecuciónes

| Metodo | Path                           | Request                                    | Response      | Errores       |
| ------ | ------------------------------ | ------------------------------------------ | ------------- | ------------- |
| GET    | /projects/{projectId}/requests | filtros, paginacion                        | 200 + lista   | 401, 403      |
| POST   | /projects/{projectId}/requests | { tool, environmentId, moduloId, payload } | 201 + request | 400, 404      |
| GET    | /requests/{id}                 | -                                          | 200 + request | 401, 404      |
| PATCH  | /requests/{id}                 | { campos }                                 | 200 + request | 400, 403, 404 |
| POST   | /requests/{id}/approve         | { comentario }                             | 200           | 400, 403, 404 |
| POST   | /requests/{id}/reject          | { comentario }                             | 200           | 400, 403, 404 |
| POST   | /requests/{id}/comment         | { comentario }                             | 200           | 400, 404      |
| POST   | /requests/{id}/execute         | { parametros }                             | 202           | 400, 403, 404 |

## Auditorï¿½a

| Metodo | Path          | Request             | Response    | Errores  |
| ------ | ------------- | ------------------- | ----------- | -------- |
| GET    | /audit-events | filtros, paginacion | 200 + lista | 401, 403 |











