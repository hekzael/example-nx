# Convenciones

## Estructura del repositorio

- `apps/`: apps deployables
- `libs/`: librerias reutilizables
- `tools/`: utilidades internas del repo
- `scripts/`: scripts auxiliares
- `docs/`: documentacion

## Nombres

- Carpetas y archivos en `kebab-case`.
- Casos de uso en `PascalCase` dentro de `docs/domain.md` (seccion Use Cases).
- ADRs dentro de `docs/architecture.md` (seccion ADRs).

## Documentacion

- `docs/PRODUCT_ENGINEERING.md` es el indice maestro.
- Mantener fechas de actualizacion en documentos de vision o alcance.
- Agregar nuevas decisiones en `docs/architecture.md`.

## CI

- CircleCI usa `scripts/ci.sh`.
- El script debe ser idempotente y fallar solo ante errores reales.




