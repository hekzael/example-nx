# Architecture

## Architecture Overview

## Estilo Arquitectonico

- Monolito modular con limites claros por contexto.

## Capas

- Presentation
- Application
- Domain
- Infrastructure

## Diagrama de alto nivel

```mermaid
flowchart LR
  U[Usuarios] --> FE[Frontend UI]
  FE --> API[Backend API (NestJS)]
  API --> IAM[Identidad y Acceso]
  API --> PRJ[Proyectos y Equipos]
  API --> OPS[Operación de Herramientas]
  OPS --> AUD[Auditoría/Events]
  IAM --> DB[(PostgreSQL)]
  ORG --> DB
  OPS --> DB
  AUD --> DB
  OPS --> RK[Rundeck API]
```

## Frontend / Backend

Frontend:
Responsable de la experiencia de usuario, flujos de solicitudes, Aprobaciónes y visualizacion de auditoría. Consume APIs internas, aplica control de acceso en UI y presenta estados de solicitudes en tiempo real (segun capacidad del backend).

Backend:
Responsable de la logica de negocio, control de permisos, flujo de solicitudes, integracion con Rundeck, auditoría y persistencia. Expone APIs internas y garantiza trazabilidad.

## Tecnologías Frontend

- React 19
- React Router
- Vite
- Tailwind CSS
- Axios
- Testing: Jest / Testing Library, Playwright (E2E)

## Tecnologías Backend

- NestJS
- TypeScript
- Validacion: class-validator / class-transformer
- HTTP: Express (via NestJS)
- Integraciones: Rundeck via API (Deploy Runner)
- Testing: Jest
- Base de datos: PostgreSQL
- ORM/DB Toolkit: TypeORM

## Infra / Tooling

- Nx (monorepo)
- ESLint + Prettier

## Comunicación (Sync / Events)

Modelo: monolito modular. Se prioriza comunicacion sincrona interna (invocaciones entre módulos) para flujos core, y eventos internos para desacoplar procesos secundarios.

### Sync (sincrono)

- Autenticación y autorización.
- CRUD de proyectos, módulos y equipos.
- Creacion de solicitudes (SQL Runner / Deploy Runner).
- Aprobación / rechazo de solicitudes.

### Events (asincrono interno)

- Auditoría de acciones (solicitudes, Aprobaciónes, Ejecuciónes, cambios de permisos/roles).
- Notificaciones (Aprobaciónes, rechazos, Ejecuciónes).
- Ejecución de solicitudes (trigger de Ejecución y registro de resultado).
- Alta de usuarios.
- Modificaciones de permisos o cambios de roles a usuarios.

## ADRs

## ADR-001 - Tipo de arquitectura (monolito modular)

- Contexto: se requiere velocidad de entrega, control centralizado de permisos y menor complejidad operativa.
- Decision: monolito modular con limites por contexto.
- Alternativas: microservicios.
- Consecuencias: despliegue unico, menor overhead, necesidad de disciplina en limites internos.

## ADR-002 - Estrategia de dominios (DDD)

- Contexto: dominio con multiples entidades y reglas de negocio complejas.
- Decision: aplicar DDD con bounded contexts y lenguaje ubicuo.
- Alternativas: arquitectura por capas sin contexto explicito.
- Consecuencias: mayor claridad de responsabilidades y contratos internos.

## ADR-003 - Comunicación (sync / events)

- Contexto: se necesitan flujos core consistentes y procesos secundarios desacoplados.
- Decision: sync interno para Operaciónes core; eventos internos para auditoría, notificaciones, Ejecuciónes y cambios de permisos/roles.
- Alternativas: todo sincrono o todo asincrono.
- Consecuencias: mejor resiliencia y trazabilidad en procesos secundarios.

## ADR-004 - Monorepo vs multirepo

- Contexto: frontend y backend evolucionan en paralelo con tooling compartido.
- Decision: monorepo con Nx.
- Alternativas: multirepo.
- Consecuencias: mejor coordinacion y versionado unico, requiere disciplina en dependencias.

## ADR-005 - DB principal

- Contexto: se necesita consistencia transaccional y consultas complejas.
- Decision: PostgreSQL como base de datos principal.
- Alternativas: MySQL, SQL Server, NoSQL.
- Consecuencias: soporte robusto de transacciones y relaciones.

## ADR-006 - Integración con Rundeck para Deploy Runner

- Contexto: se necesita orquestar despliegues y reutilizar pipelines existentes.
- Decision: integrar Deploy Runner con Rundeck via API.
- Alternativas: ejecutar scripts internos sin orquestador; integrar con otros tools.
- Consecuencias: dependencia de disponibilidad y permisos en Rundeck.









