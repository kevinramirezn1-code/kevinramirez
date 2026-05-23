# Sistema Web de Reservas de Salas

Este proyecto es una aplicación web para la gestión de reservas de salas de reuniones dentro de la universidad.

---

# Cómo ejecutar el proyecto

## 1. Configurar la Base de Datos

Abrir MySQL Workbench o la consola de MySQL.

Crear una nueva base de datos y ejecutar el script SQL del proyecto:

```sql
CREATE DATABASE bd_proyecto;
```

Después de crearla:

- Abrir el archivo `.sql` del proyecto.
- Copiar y pegar el código SQL.
- Ejecutarlo completo para crear las tablas y datos iniciales.

---

# 2. Configurar el archivo .env

Dentro de la carpeta `backend` ya existe un archivo `.env`.

Solo debe modificar:

```env
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
```

Ejemplo:

```env
DB_USER=root
DB_PASSWORD=12345
```

Guardar cambios con:

```bash
CTRL + S
```

---

# 3. Abrir el proyecto en Visual Studio Code

Abrir el proyecto completo en VS Code.

---

# 4. Abrir dos terminales

Debe abrir dos terminales diferentes dentro de VS Code.

---

# 5. Ejecutar Backend

En la primera terminal:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Iniciar backend:

```bash
npm run dev
```

---

# 6. Ejecutar Frontend

En la segunda terminal:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Iniciar frontend:

```bash
npm start
```

---

# 7. Ingresar al sistema

Cuando frontend y backend estén ejecutándose correctamente, el sistema abrirá automáticamente el navegador.

La aplicación iniciará directamente en el inicio.

Deberia ir al login

---

# 8. Usuario para ingresar

Para acceder al sistema primero debe iniciar sesion con estos datos:

- Correo institucional:Secretaria@uao.edu.co
- Contraseña: Uao123@1

El sistema permite ingreso para:
- Secretaria

Para acceder al sistema primero debe iniciar sesion con estos datos:

- Correo institucional:Docente@uao.edu.co
- Contraseña: contaseña 123Uao@1
El sistema permite ingreso para:
- Docente

O tambien se puede crear usuario para secretaria con el siguiente correo:
- SecretariaLista@uao.edu.co
y crear la contraseña que quieras cumpliendo los requisitos

Y para crear usuario de Docente es con cualquier correo

Si el correo está registrado en la lista blanca, el sistema asignará automáticamente el rol SECRETARIA.

En caso contrario, asignará el rol DOCENTE.

---

# Consideraciones

- Las reservas solo pueden realizarse entre 7:00 a.m. y 9:30 p.m.
- No se permiten reservas simultáneas.
- El sistema conserva historial de reservas y reportes.

---

# Tecnologías utilizadas

## Frontend
- React.js

## Backend
- Node.js
- Express.js

## Base de Datos
- MySQL
