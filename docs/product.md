# Product Overview

> Estado: Draft  
> Ultima actualizacion: 2026-02-07  
> Responsable: Eulis Blanco

## Problem Statement

### Problema

La plataforma necesita controlar de forma segura las solicitudes de despliegue y la Ejecución de SQL/migraciones en bases de datos, con Aprobaciónes y auditoría. Hoy ese flujo suele resolverse de manera informal (scripts sueltos, permisos ad-hoc y poca trazabilidad), lo que genera riesgos operativos y de cumplimiento.

- Que sucede hoy: solicitudes manuales, Aprobaciónes por chat o correo, Ejecuciónes sin registro centralizado.
- A quien afecta: equipos de desarrollo, lideres tecnicos, QA, PM, arquitectura, y compliance.
- Por que es un problema real: se pierden controles, aumenta el riesgo de errores en ambientes productivos y se dificulta el accountability.

### Impacto

- Impacto operativo: bloqueos por Aprobaciónes lentas, errores en despliegues, inconsistencia entre ambientes.
- Impacto economico: downtime, retrabajo, perdida de productividad.
- Impacto legal / regulatorio: falta de trazabilidad y auditoría en cambios sobre datos y codigo.
- Impacto en usuarios: friccion en el flujo de trabajo y menor confianza en los releases.

### Situacion actual (AS-IS)

La gestión de despliegues y SQL se realiza con herramientas aisladas (scripts, runbooks locales, Rundeck sin control de roles centralizado) y sin un ciclo formal de solicitudes, Aprobaciónes y auditoría en la plataforma.

## Product Vision

### Objetivo del producto

Construir una plataforma interna que permita a la plataforma Gestiónar equipos, proyectos y módulos, y ejecutar herramientas operativas (SQL Runner y Deploy Runner) mediante un flujo de solicitudes con aprobación, Ejecución y auditoría.

### Usuarios objetivo

- Usuario primario: Lider tecnico / Arquitecto / PM responsable de Aprobaciónes.
- Usuario secundario: Desarrollador que genera solicitudes.
- Administradores / tecnicos: Administrador de plataforma (backoffice) y compliance.

### Propuesta de valor

Control granular de permisos, trazabilidad completa y flujo estandarizado para cambios en datos y despliegues, sin frenar la velocidad del equipo.

### Metricas de exito

- % de solicitudes auditadas con aprobación registrada.
- Tiempo promedio desde solicitud hasta Ejecución.
- Reduccion de incidentes en ambientes productivos.
- Adopcion por proyecto.

### No-Objetivos

- No reemplazar herramientas de CI/CD existentes.
- No Gestiónar repositorios de codigo ni control de versiones.
- No ser un sistema de RRHH.







