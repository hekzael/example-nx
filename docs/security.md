# Security

## Security Model

## AutenticaciÃ³n

- Metodos: usuario y password con JWT + refresh token.
- Flujos: login, refresh, cierre de sesion.

## AutorizaciÃ³n

- Roles: administrador, lider tecnico, desarrollador, QA, PM, arquitecto (ajustable por plataforma).
- Permisos: acciones granulares (`permissions`) asignables por rol/usuario.
- Scopes: `global | project | module | environment` + `scopeId`.
- La accion esta en `permission`, el `scope` define donde aplica.

Principios:

- Modelo de permisos tipo whitelist: si no tiene permiso, no puede.
- No existe blacklist/deny explicito.
- Un rol debe incluir permisos apropiados para operar; sin permisos, no hay acceso.

Ejemplos de permisos:

- `sql.run`
- `sql.migrate`
- `deploy.execute`
- `requests.approve`

## Evaluacion de acceso

- Un permiso aplica si el `scope` cubre el recurso solicitado.
- Asignaciones temporales solo aplican dentro de su ventana de vigencia.
- El acceso efectivo a una herramienta requiere: herramienta habilitada + permiso valido en scope.
- Sin permiso explicito, el acceso es denegado.

## AuditorÃ­a

- Eventos auditados: solicitudes, Aprobaciónes, Ejecuciónes, cambios de permisos.
- Retencion: base de datos (tabla de auditoría).

## Password policies

- Min 12 caracteres, 1 mayus, 1 minus, 1 numero.
- Historial: no reutilizar ultimas 5.
- Reset tokens TTL: 30 minutos.
- Verify email tokens TTL: 24 horas.
- Rate limit en /auth/forgot-password.

## Access Control Matrix

| Endpoint                               | Metodo | Permiso                          |
| -------------------------------------- | ------ | -------------------------------- |
| /users                                 | GET    | users.list                       |
| /users/{id}                            | GET    | users.read                       |
| /users                                 | POST   | users.create                     |
| /users/{id}                            | PATCH  | users.update                     |
| /users/{id}                            | DELETE | users.delete                     |
| /users/{id}/roles                      | POST   | users.assign-role                |
| /users/{id}/roles/temporary            | POST   | users.assign-role-temporary      |
| /users/{id}/permissions                | POST   | users.grant-permission           |
| /users/{id}/permissions/temporary      | POST   | users.grant-permission-temporary |
| /roles                                 | GET    | roles.list                       |
| /roles/{id}                            | GET    | roles.read                       |
| /roles                                 | POST   | roles.create                     |
| /roles/{id}                            | PATCH  | roles.update                     |
| /roles/{id}                            | DELETE | roles.delete                     |
| /roles/{id}/permissions                | POST   | roles.assign-permission          |
| /roles/{id}/permissions/{permissionId} | DELETE | roles.revoke-permission          |
| /permissions                           | GET    | permissions.list                 |
| /permissions/{id}                      | GET    | permissions.read                 |
| /permissions                           | POST   | permissions.create               |
| /permissions/{id}                      | PATCH  | permissions.update               |
| /permissions/{id}                      | DELETE | permissions.delete               |
| /projects                              | GET    | projects.list                    |
| /projects/{id}                         | GET    | projects.read                    |
| /projects                              | POST   | projects.create                  |
| /projects/{id}                         | PATCH  | projects.update                  |
| /projects/{id}                         | DELETE | projects.delete                  |
| /projects/{projectId}/modules          | GET    | modules.list                     |
| /projects/{projectId}/modules          | POST   | modules.create                   |
| /projects/{projectId}/environments     | GET    | environments.list                |
| /projects/{projectId}/environments     | POST   | environments.create              |
| /teams                                 | GET    | teams.list                       |
| /teams                                 | POST   | teams.create                     |
| /teams/{teamId}/members                | POST   | teams.add-member                 |
| /teams/{teamId}/members/{userId}       | DELETE | teams.remove-member              |
| /tools                                 | GET    | tools.list                       |
| /tools                                 | POST   | tools.create                     |
| /projects/{projectId}/tools            | POST   | tools.enable-project             |
| /projects/{projectId}/requests         | GET    | requests.list                    |
| /projects/{projectId}/requests         | POST   | requests.create                  |
| /requests/{id}                         | GET    | requests.read                    |
| /requests/{id}                         | PATCH  | requests.update                  |
| /requests/{id}/approve                 | POST   | requests.approve                 |
| /requests/{id}/reject                  | POST   | requests.reject                  |
| /requests/{id}/comment                 | POST   | requests.comment                 |
| /requests/{id}/execute                 | POST   | requests.execute                 |
| /audit-events                          | GET    | audit.read                       |
| /me                                    | GET    | self.read                        |
| /me                                    | PATCH  | self.update                      |
| /me/roles                              | GET    | self.roles.read                  |
| /me/permissions                        | GET    | self.permissions.read            |
| /me/teams                              | GET    | self.teams.read                  |
| /me/requests                           | GET    | self.requests.read               |
| /me/approvals                          | GET    | self.approvals.read              |
| /me/audit-events                       | GET    | self.audit.read                  |
| /auth/forgot-password                  | POST   | public                           |
| /auth/reset-password                   | POST   | public                           |
| /auth/verify-email                     | POST   | public                           |
| /me/password                           | POST   | self.change-password             |

Nota: Endpoints self-service (/me/\*) no requieren permisos, solo JWT valido.\n





