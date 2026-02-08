# Backend Structure Proposal

Objetivo: estructura monolito modular con limites por contexto y lista para extraer microservicios (module-first).

## Estructura

- `apps/backend/`
- `apps/backend/src/`
- `apps/backend/src/main/`
- `apps/backend/src/modules/`
- `apps/backend/src/shared/`

## Módulos (bounded contexts)

Cada modulo es autocontenido y puede extraerse a microservicio:

- `apps/backend/src/modules/identity/`
- `apps/backend/src/modules/projects/`
- `apps/backend/src/modules/operations/`
- `apps/backend/src/modules/audit/`

## Estructura interna por modulo

- `domain/`
- `application/`
- `infrastructure/`
- `http/`

Ejemplo:

- `apps/backend/src/modules/identity/domain/`
- `apps/backend/src/modules/identity/application/`
- `apps/backend/src/modules/identity/infrastructure/`
- `apps/backend/src/modules/identity/http/`

## Shared Kernel

- `apps/backend/src/shared/` para:
  - tipos comunes (ids, result, errors)
  - utilidades puras (sin dependencias)
  - contratos de eventos

## Reglas para extraer microservicios

- No imports directos entre módulos. Comunicar via eventos o puertos.
- Un modulo solo conoce interfaces externas, no implementaciones de otros módulos.
- Infraestructura de cada modulo vive dentro del modulo.
- Configuracion/bootstrapping en `src/main`.

## Beneficios

- Permite separar un modulo copiando su carpeta a un repo dedicado.
- Minimiza dependencias cruzadas.
- Facilita ownership por equipo.

## Mapa de eventos

Ver docs/operations.md (Event Map).





