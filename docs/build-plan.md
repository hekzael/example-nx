# Build Plan (Weekly Deliverables)

## Semana 1 - Esqueleto y setup

- Monorepo Nx inicializado.
- Estructura backend/frontend creada.
- CI basico funcionando.

## Semana 2 - Infra + Auth

- Configuracion de DB, env y logging.
- Esquema inicial (migraciones base).
- JWT login/logout/refresh.
- Verify email + reset password.

## Semana 3 - Seguridad + Core backend

- Access Control Matrix aplicada (guards por endpoint).
- Self-service /me (JWT-only).
- Modulos `identity`, `projects`, `operations`, `audit`.
- CRUD de proyectos, modulos, ambientes, equipos.

## Semana 4 - Vertical slice + Backoffice

- Crear solicitud, aprobar, ejecutar.
- Auditoria y eventos.
- UI basica para Requests + Approvals + Request Detail.
- Admin: proyectos, equipos, roles/permissions, tools.

## Semana 5 - Hardening + QA

- Tests unit/integration/E2E en flujos criticos.
- Observabilidad (logs, metricas, alertas basicas).
- Ajustes de performance y validaciones.
- Release candidate.
