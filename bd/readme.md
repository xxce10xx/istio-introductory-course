# Base de datos
Este archivo es muy sencillo, solo pretende establecer parámetros mínimos para la creación de la base de datos
1. Las tablas y sus relaciones no son necesario crearlas, ya que se crearan con **Sequelize** desde el cópdigo fuente, este proceso, en general, es una mala práctica, pero nos facilita la creación y el poder levantar los servicios con mayor facilidad, sobre todo en ejemplos y aprendizaje.
2. Únicamente debemos crear la instancia de **BBDD**, el **schema** y la **base de datos**. En nuestro ejemplo usamos:
> - **AWS RDS** para aprovisionar una instancia de _postgreSQL_
> - Usamos el schema **public**
> - Creamos la base de datos **health_db**