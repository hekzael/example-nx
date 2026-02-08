# Requirements

## Alcance Tecnico Inicial

- Tenancy: single-tenant (tenant implicito, sin multi-tenant).
- Permisos: por use-case + scope (`global | project | module | environment`).
- Aprobaciónes: minimo 1 (configurable a 2 o 3), rol requerido configurable por entorno.
- Herramientas: habilitadas solo por proyecto.
- Self-service: `/me/*` JWT-only (sin permisos).
- Backoffice: admin completo y roles parciales configurables.
## Scope and MVP

## Alcance funcional

- Gestión de proyectos, módulos y equipos.
- Gestión de usuarios, roles y permisos (incluye asignaciones temporales).
- Configuracion de ambientes de operación por proyecto.
- Gestión de herramientas: SQL Runner y Deploy Runner.
- Flujo de solicitudes: crear, aprobar/rechazar, comentar, ejecutar, auditar.

## MVP

### Funcionalidades incluidas

- Alta de usuarios, roles, permisos, herramientas.
- Alta de equipos, proyectos, módulos y ambientes de operación.
- Asignar permisos a roles y usuarios (incluye temporales).
- Asignar roles a usuarios (incluye temporales).
- Asignar herramientas a proyectos.
- Solicitudes, aprobación/rechazo, Ejecución y auditoría.

### Funcionalidades excluidas

- Integraciones avanzadas adicionales a Rundeck.
- Reporteria avanzada y BI.
- Automatizaciones complejas de CI/CD.

## Functional Requirements (FRD)

## Actores

- Administrador de plataforma
- Lider tecnico
- Desarrollador
- Auditor / Compliance
- Project Manager / Product Manager

## Casos de Uso

Regla transversal:

- Modelo de permisos whitelist: sin permiso explicito no hay acceso.

### UC-01 - Configuracion general

- Descripción: configurar parametros globales de la plataforma.
- Actor: Administrador de plataforma.
- Reglas de negocio: solo administradores pueden Gestiónar configuracion.

### UC-02 - Gestión de roles y Permisos

- Descripción: crear/editar/eliminar roles y asignar permisos.
- Actor: Administrador de plataforma.
- Reglas de negocio: permisos son granulares y auditables.

### UC-03 - Gestión de proyectos, Módulos y equipos

- Descripción: crear/editar/eliminar proyectos y módulos; asignar equipos.
- Actor: Administrador de plataforma / Usuario de la plataforma.
- Reglas de negocio: equipos pertenecen a un proyecto.

### UC-04 - Solicitud SQL Runner

- Descripción: generar solicitud para ejecutar query o migracion.
- Actor: Usuario con permisos de SQL Runner.
- Reglas de negocio: solo en ambientes permitidos y con módulos asignados.

### UC-05 - Aprobación / Rechazo de solicitud

- Descripción: aprobar o rechazar solicitudes.
- Actor: Usuario con permisos de aprobación.
- Reglas de negocio: aprobadores solo pueden decidir sobre su equipo/proyecto. Minimo 1 aprobación (configurable a 2 o 3). Puede requerir aprobación de un rol especifico; reglas configurables por entorno/proyecto.

### UC-06 - Ejecución y Auditoría

- Descripción: ejecutar solicitud y registrar auditoría.
- Actor: Sistema / Usuario con permisos de Ejecución.
- Reglas de negocio: toda Ejecución debe quedar auditada.

### UC-07 - Solicitud Deploy Runner

- Descripción: Gestiónar despliegues integrados con Rundeck via API.
- Actor: Desarrollador / Lider tecnico.
- Reglas de negocio: ambientes y proyectos habilitados. Solo puedeejecutar solicitudes previamente aprobadas.

### UC-08 - Asignacion de herramientas

- Descripción: habilitar herramientas por proyecto.
- Actor: Administrador de plataforma / Usuario de la plataforma.

## Non-Functional Requirements (NFR)

## Seguridad

- Autenticación: usuario y password con JWT + refresh token.
- Autorización: RBAC + permisos granulares + asignaciones temporales.
- Auditoría: eventos de solicitudes y Ejecuciónes.
- Cumplimiento normativo: minimo GDPR-like (proteccion de datos), politicas de acceso y trazabilidad; retencion de auditoría 12 meses (baseline).

## Performance

- SLA: 99.5% mensual.
- Latencia maxima: p95 < 400ms, p99 < 800ms.
- Volumen esperado: 500 usuarios activos, 2k solicitudes/mes, 500 Ejecuciónes/mes (baseline).

## Escalabilidad

- Horizontal / Vertical: preferencia por escalado horizontal; vertical solo como medida temporal.
- Limites conocidos: max 50 Ejecuciónes concurrentes; max 2MB por payload de solicitud; max 30 dias de logs locales antes de rotacion (baseline).

## Disponibilidad

- Uptime esperado: 99.5% mensual.
- Estrategia de recuperacion: backups y rollback en deploys.











