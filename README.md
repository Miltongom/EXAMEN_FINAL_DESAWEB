# Chat UMG - Sistema de Mensajería con Autenticación

Sistema de chat desarrollado para el examen final de Desarrollo Web que implementa autenticación, envío de mensajes y visualización en tiempo real.

## Características

- **SERIE I**: Autenticación de usuarios con JWT Token
- **SERIE II**: Envío de mensajes protegidos con Bearer Token
- **SERIE III**: Visualización cronológica de mensajes desde SQL Server

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Base de datos**: SQL Server
- **Autenticación**: JWT Bearer Token

## Estructura del Proyecto

```
EXAMEN_FINAL_DESAWEB/
├── index.html          # Página principal (Login + Chat)
├── styles.css          # Estilos personalizados
├── app.js              # Lógica del frontend
├── server.js           # Servidor backend (API para SQL Server)
├── package.json        # Dependencias de Node.js
└── README.md           # Este archivo
```

## Instalación

### 1. Instalar Node.js

Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

### 2. Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará:
- express (servidor web)
- mssql (conexión a SQL Server)
- cors (permitir peticiones desde el frontend)

### 3. Iniciar el Servidor Backend

```bash
npm start
```

O para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### 4. Abrir la Aplicación

Abre el archivo `index.html` en tu navegador web. Puedes:

- Hacer doble clic en `index.html`
- O usar Live Server en VSCode
- O abrir directamente: `file:///C:/Users/Milton%20Gómez/Desktop/EXAMEN_FINAL_DESAWEB/index.html`

## Credenciales de Acceso

### Usuario de Prueba
- **Usuario**: `mgomezm46` (sin @miumg.edu.gt)
- **Contraseña**: `123456a`

### Configuración de Base de Datos (ya configurada en server.js)
- **Server**: svr-sql-ctezo.southcentralus.cloudapp.azure.com
- **Usuario**: usr_DesaWebDevUMG
- **Contraseña**: !ngGuast@360
- **Base de datos**: db_DesaWebDevUMG

## Uso de la Aplicación

### 1. Iniciar Sesión
1. Ingresa tu usuario (solo la parte antes del @miumg.edu.gt)
2. Ingresa tu contraseña
3. Haz clic en "Iniciar Sesión"

### 2. Enviar Mensajes
1. Escribe tu mensaje en el campo de texto
2. Presiona Enter o haz clic en "Enviar"
3. El mensaje aparecerá en el chat

### 3. Ver Mensajes
- Los mensajes se cargan automáticamente al iniciar sesión
- Se actualizan cada 3 segundos
- Los mensajes propios aparecen a la derecha (azul/morado)
- Los mensajes de otros aparecen a la izquierda (blanco)

### 4. Cerrar Sesión
- Haz clic en "Cerrar Sesión" en la parte superior derecha

## Endpoints de API

### API Externa (Autenticación y Mensajes)
- **Login**: `POST https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate`
- **Enviar Mensaje**: `POST https://backcvbgtmdesa.azurewebsites.net/api/Mensajes`

### API Local (Backend - Consultar Mensajes)
- **Obtener Mensajes**: `GET http://localhost:3000/api/messages`
- **Health Check**: `GET http://localhost:3000/api/health`

## Implementación de las Series

### SERIE I: Autenticación
- Formulario de login con validación
- Petición POST a API de autenticación
- Almacenamiento seguro del token en localStorage
- Validación de sesión al cargar la aplicación

### SERIE II: Envío de Mensajes
- Formulario para escribir mensajes
- Petición POST con Bearer Token en el header
- Validación de autenticación antes de enviar
- Actualización automática después de enviar

### SERIE III: Visualización de Mensajes
- Backend en Node.js para conectar con SQL Server
- Consulta a la tabla [dbo].[Chat_Mensaje]
- Ordenamiento cronológico (ASC)
- Actualización automática cada 3 segundos

## Seguridad

- Tokens almacenados en localStorage
- Header Authorization con Bearer Token
- Validación de sesión en cada carga
- Escapado de HTML para prevenir XSS
- CORS configurado en el backend

## Características Adicionales

- Diseño responsive (móvil y desktop)
- Animaciones suaves
- Indicadores de carga
- Formato de fecha inteligente (hoy, ayer, fecha completa)
- Auto-scroll al final del chat
- Toggle para mostrar/ocultar contraseña
- Mensajes propios vs mensajes de otros usuarios

## Problemas Comunes

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`
- Verifica que el puerto 3000 no esté en uso

### No se cargan los mensajes
- Verifica que el servidor backend esté corriendo
- Revisa la consola del navegador (F12) para ver errores
- Verifica la conexión a Internet

### Error de autenticación
- Verifica que uses el usuario correcto (mgomezm46)
- Verifica que la contraseña sea correcta (123456a)
- Revisa la consola del navegador para más detalles

## Autor

**Milton Gómez**
- Usuario: mgomezm46
- Universidad Mariano Gálvez
- Curso: Desarrollo Web

## Fecha de Entrega

Examen Final - 2025

---

**Nota**: Este proyecto fue desarrollado con fines educativos para el examen final de Desarrollo Web.
