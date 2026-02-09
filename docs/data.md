# Data

## Data Model

## ERD

### Entidades y relaciones (Updated)

- `projects` 1..\* `project_environments`
- `projects` 1..\* `project_modules`
- `teams` 1..\* `team_modules` (assigns team to modules)
- `teams` 1..\* `team_members` (assigns users to teams)
- `users` 1..\* `user_project_roles` (assigns roles in projects)
- `project_roles` 1..\* `project_role_permissions`
- `project_permissions` (defines scope context: module/env/action)

### Tablas de relación (Pivot)

- `team_modules`: (team_id, module_id)
- `team_members`: (team_id, user_id, role, valid_from, valid_to)
- `user_project_roles`: (user_id, project_id, role_id, start_at, end_at)
- `project_role_permissions`: (role_id, permission_id)

## Modelo de permisos y scope

- `project_permissions` define la tupla única: `(project_id, module_id?, environment_id?, action)`.
- Si `module_id` es NULL -> Permiso a nivel Proyecto.
- Si `environment_id` es NULL -> Permiso en todos los entornos.

## Entidades persistentes

1. `users`
2. `projects`
3. `project_environments`
4. `project_modules`
5. `teams`
6. `team_modules`
7. `team_members`
8. `project_roles`
9. `project_permissions`
10. `project_role_permissions`
11. `user_project_roles`
12. `audit_logs`
