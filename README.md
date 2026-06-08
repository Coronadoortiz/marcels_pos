# Documentation Técnica de Arquitectura: InventoryPro ERP

Este repositorio contiene el prototipo funcional de un sistema de Punto de Venta (POS) y Planificación de Recursos Empresariales (ERP) enfocado en los módulos de ventas, inventario y reportes financieros, diseñado bajo estrictos criterios de clean code, desacoplamiento de capas y buenas prácticas de ingeniería de software.

---

## 1. Arquitectura General del Sistema

El ecosistema adopta un patrón de **Arquitectura en Capas Desacopladas** (Multitier Architecture) distribuido a través de componentes totalmente independientes que se comunican mediante servicios web REST operados bajo políticas de acceso cruzado (CORS):

* **Capa de Presentación (Frontend):** Desarrollada sobre Next.js con Bootstrap, encargada de compilar los tableros de indicadores clave de rendimiento (KPIs), balances financieros automatizados en tiempo real, filtrado dinámico mediante el dropdownlist de métodos de pago y control analítico de inventarios.
* **Capa de Negocio (Backend):** Implementada en Spring Boot 3.x con Java 21, estructurada internamente bajo el patrón arquitectónico de diseño limpio:
    * **Controllers:** Exponen la interfaz de endpoints REST hacia la red externa y gestionan las lógicas de acceso seguro.
    * **Services:** Orquestan la lógica de negocio, cálculos aritméticos y validación de balances económicos (Ventas vs. Compras).
    * **Repositories / DAO:** Abstraen las consultas de persistencia e interacción transaccional mediante Spring Data JPA.
* **Capa de Datos:** PostgreSQL relacional administrado de forma serverless mediante la infraestructura en la nube de **Neon.tech**, garantizando transacciones seguras bajo estándares ACID sobre canales cifrados con SSL.

---

## 2. Diagrama de Base de Datos (Entidad-Relación - DER)

Este diagrama representa la estructura de persistencia en las tablas del clúster relacional de **Neon.tech**, optimizado para garantizar la consistencia relacional y proteger el histórico económico frente a variaciones retroactivas de precios de productos o catálogos.

```mermaid
erDiagram
    tbl_products {
        bigint id_product PK
        varchar name_product
        numeric selling_value_product
        integer stock
        bigint id_category FK
    }
    tbl_categories {
        bigint id_category PK
        varchar name_category
    }
    tbl_providers {
        bigint id_provider PK
        varchar name_provider
        varchar nit_provider
    }
    tbl_payment_methods {
        bigint id_payment_method PK
        varchar name_payment_method
    }
    tbl_sales {
        bigint id_sale PK
        timestamp date_sale
        bigint id_payment_method FK
    }
    tbl_sales_details {
        bigint id_sale_detail PK
        bigint id_sale FK
        bigint id_product FK
        integer amount_products
    }
    tbl_purchases {
        bigint id_purchase PK
        timestamp date_purchase
        bigint id_provider FK
    }
    tbl_purchase_details {
        bigint id_purchase_detail PK
        bigint id_purchase FK
        bigint id_product FK
        integer amount_purchased
        numeric purchase_product_price
    }
    tbl_audit_logs {
        bigint id_log PK
        varchar action_type
        timestamp log_date
        varchar detail
    }

    tbl_products }|--|| tbl_categories : "pertenece"
    tbl_sales }|--|| tbl_payment_methods : "usa"
    tbl_sales_details }|--|| tbl_sales : "es parte de"
    tbl_sales_details }|--|| tbl_products : "contiene"
    tbl_purchases }|--|| tbl_providers : "proveído por"
    tbl_purchase_details }|--|| tbl_purchases : "es parte de"
    tbl_purchase_details }|--|| tbl_products : "contiene"
