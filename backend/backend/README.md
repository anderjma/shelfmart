# Sistema de Control de Inventario - Backend API

Este repositorio contiene la API del sistema de control de inventarios. Está desarrollado bajo una **Arquitectura en Capas (N-Tier Architecture)** para garantizar la modularidad, escalabilidad y una clara separación de responsabilidades. El backend expone servicios REST para la gestión de catálogo de productos, procesamiento de compras, registros de auditoría y autenticación de usuarios.

---

## Tecnologías Utilizadas

| Componente | Tecnología |
| :--- | :--- |
| **Lenguaje y Framework** | C# con .NET (ASP.NET Core Web API) |
| **Base de Datos** | PostgreSQL |
| **Acceso a Datos (ORM)** | Entity Framework Core utilizando Npgsql |
| **Documentación de API** | Swagger (Swashbuckle.AspNetCore) con soporte JWT integrado |
| **Seguridad** | Autenticación y Autorización basada en Json Web Tokens (JWT) |

---

## Arquitectura y Estructura del Proyecto

La solución está estructurada en proyectos individuales que dividen lógicamente las responsabilidades de la aplicación:

*   **`BusinessSystem.Api`**
    *   *Propósito:* Capa de presentación que contiene los controladores REST, los middlewares del sistema y la configuración de dependencias de la aplicación en el archivo `Program.cs`.
*   **`BusinessSystem.Facade`**
    *   *Propósito:* Capa de fachada que simplifica el flujo de datos entre la API y la lógica de negocio, sirviendo como interfaz unificada para los controladores.
*   **`BusinessSystem.DomainService`**
    *   *Propósito:* Capa que implementa la lógica de negocio central y las validaciones de dominio del sistema.
*   **`BusinessSystem.Domain`**
    *   *Propósito:* Definición de las entidades del dominio de negocio e interfaces de los repositorios.
*   **`BusinessSystem.Infrastructure`**
    *   *Propósito:* Capa de persistencia de datos. Contiene la configuración del contexto de la base de datos (`AppDbContext`), las migraciones de Entity Framework Core y la implementación concreta de los repositorios.
*   **`BusinessSystem.Dto`**
    *   *Propósito:* Data Transfer Objects para transferir datos de forma segura entre el cliente y el servidor sin exponer directamente las entidades del dominio.
*   **`BusinessSystem.Exceptions`**
    *   *Propósito:* Excepciones de negocio personalizadas para flujos de error controlados.

---

## Patrones de Diseño Aplicados

*   **Layered Architecture (Arquitectura en Capas):** Permite la separación de la interfaz de usuario, la lógica de negocio y el acceso a datos.
*   **Facade Pattern (Patrón Fachada):** Proporciona una interfaz unificada y simplificada sobre un conjunto de interfaces en el subsistema de servicios.
*   **Repository Pattern (Patrón Repositorio):** Abstrae la lógica de acceso a datos de la lógica de negocio, facilitando el mantenimiento y las futuras pruebas unitarias.
*   **Dependency Injection (Inyección de Dependencias):** Utilizado de forma nativa para resolver dependencias a través de contenedores de servicios de ASP.NET Core.

---

## Buenas Prácticas y Características Destacadas

*   **Manejo Global de Excepciones:** Uso de un middleware personalizado (`ExceptionMiddleware`) para capturar y estandarizar las respuestas de error en la API, evitando el uso repetitivo de bloques `try-catch` en controladores.
*   **Seguridad y Autorización:** Implementación de políticas de autorización basadas en roles (`Admin`, `Customer`, etc.) para proteger rutas críticas.
*   **Transaccionalidad de Operaciones:** Gestión de transacciones atómicas al registrar pedidos y actualizar stock para evitar inconsistencias en el inventario.
*   **Programación Asíncrona:** Uso extendido de `async/await` en la comunicación con la base de datos para mejorar el rendimiento y la escalabilidad del servidor.
