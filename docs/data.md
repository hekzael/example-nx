# Data

## Data Model

## ERD

### Entidades y relaciones

- projects 1..* modules
- projects 1..* environments
- projects 0..* tools (via project_tools)
- teams 2..* users (via team_members, type leader/leader_temp)
- users 0..* roles (via user_roles)
- roles 0..* permissions (via role_permissions)
- users 0..* permissions (via user_permissions)
- requests 1..1 projects
- requests 1..1 tools
- requests 1..1 environments
- requests 0..1 modules
- requests 0..* approvals
- requests 0..* executions
- audit_events 0..* (requests, approvals, executions, role/permission changes)

### Tablas de relacion (join)

- project_tools (project_id, tool_id)
- team_members (team_id, user_id, type, from, to)
- user_roles (user_id, role_id, from, to)
- role_permissions (role_id, permission_id)
- user_permissions (user_id, permission_id, scope_type, scope_id, from, to)

## Modelo de permisos y scope

- `permissions` modela la accion (ej. `sql.run`, `deploy.execute`, `requests.approve`).
- `scope_type` define el alcance: `global | project | module | environment`.
- `scope_id` es el ID concreto del recurso.
- La disponibilidad de una herramienta se controla por contexto con `project_tools`.

## Entidades persistentes

- projects
- modules
- teams
- users
- roles
- permissions
- tools
- environments
- requests
- approvals
- executions
- audit_events




