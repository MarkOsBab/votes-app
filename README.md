# Votes APP
Aplicación realizada para la prueba técnica de [solcre.tech](https://solcre.tech/).
La aplicación se realizó con [React v18](https://es.react.dev/) y para sus estilos se utilizó [Tailwind CSS](https://tailwindcss.com/)

## Paquetes - repositorios requeridos para correcto funcionamiento

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/package-manager)
* [Api](https://github.com/MarkOsBab/votes-api)

## Pasos para correr el proyecto

* Clonar el repositorio `git clone https://github.com/MarkOsBab/votes-app`
* Acceder a la carpeta del proyecto `cd votes-app`
* Instalar todas las dependencias `npm i`
* Copiar el contenido del archivo [.env.example](https://github.com/MarkOsBab/votes-app/blob/main/.env.example) y crear el archivo .env.local
    - Referencias de las variables de entorno
        - REACT_APP_API_URL: Hace referencia a la url de la api  **Recomendado poner http://urlApi.com/api**
        - REACT_APP_API_KEY: Hace referencia a la KEY utilizada para poder acceder a los endpoints de la api
        - REACT_APP_JWT_SECRET: Hace referencia a la clave de encripción que se utiliza para los Json web tokens
* Ejecutar el comando `npm run serve` **Asegurarse de tener la api corriendo**

## Vistas y funcionalidades principales

- Inicio (ruta `http://urlProyecto.com/`)
    - La vista del inicio contiene:
        - Formulario para realizar los votos donde se podrá ingresar el documento y seleccionar uno de los candidatos
        - Candidato más votado
        - Lista de votos realizados con los detalles del votante 
            - Ver detalle despliega un dialog con todos los detalles del voto seleccionado
        - Enlace de Acceso a gestión
- Acceso a gestión (ruta `http://urlProyecto.com/admin`)
    - La vista de Acceso a gestión contiene:
        - Formulario de inicio de sesión solo para usuarios administradores
        - Enlace que redirige a la página de Inicio
- Gestión (ruta `http://urlProyecto.com/admin/panel`)
    - La vista contiene:
        - Sidebar colapsable para hacer más sencillo el uso del sitio en dispositivos con pantalla más pequeñas
            * Inicio (ruta `http://urlProyecto.com/admin/panel`)
            * Nuevo votante (ruta `http://urlProyecto.com/admin/panel/add-voter`)
            * Modificar clave (ruta `http://urlProyecto.com/admin/panel/change-password`)
            * Cerrar sesión **(petición a api y eliminación de sesión)**
        - Estadísticas de los votos / votantes
        - Lista de los candidatos más votados en orden de más votado a menos votado y paginado
        - Highcharts
            - Estadísticas de votación (para hacer más visuales las estadísticas que están colocadas en la parte superior)
            - Votos por candidato (nombre de los candidatos y la cantidad de votos que contiene cada uno de ellos)
    - Nuevo votante (ruta `http://urlProyecto.com/admin/panel/add-voter`)
        - En esta vista se podrá crear un nuevo votante
            - Campos obligatorios para su carga:
                * Documento
                * Nombre
                * Apellido
                * Fecha de nacimiento
                * Dirección
                * Teléfono
                * Sexo (desplegable)
                    * Masculino
                    * Femenino
                * Tipo de votante
                    * Candidato
                    * Votante
    - Modificar clave (ruta `http://urlProyecto.com/admin/panel/change-password`)
        - En esta vista se podrá modificar la clave del administrador que contiene la sesión iniciada
            - Campos obligatorios para el cambio de clave
                * Clave actual
                * Nueva clave
                * Confirmar nueva clave **(misma que Nueva Clave)**
            - Validaciones para el cambio de contraseña
                * Mínimo de 6 caracteres
                * Máximo de 16 caracteres
                * Una letra mayúscula
                * Un símbolo
                * Nueva clave y confirmar nueva clave iguales
                * Clave nueva distinta a la clave actual