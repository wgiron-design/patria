# Fiestas Patrias — 205 Aniversario de Independencia de Guatemala 🇬🇹

Sistema web ceremonial e interactivo desarrollado para la conmemoración del **205 Aniversario de la Independencia de la República de Guatemala (1821 – 2026)**.

---

## 🌐 Enlaces Públicos (GitHub Pages)

- 📺 **Pantalla Principal (Evento / Proyector / TV)**: [https://wgiron-design.github.io/patria/main/](https://wgiron-design.github.io/patria/main/)
- ✍️ **Formulario Móvil de Invitados (Código QR)**: [https://wgiron-design.github.io/patria/form/](https://wgiron-design.github.io/patria/form/)
- 🔍 **Portal de Verificación de Participantes**: [https://wgiron-design.github.io/patria/verificar/](https://wgiron-design.github.io/patria/verificar/)

---

## 🏛️ Componentes del Sistema

### 1. Pantalla Ceremonial (`main/index.html`)
Diseñada para transmisión y proyección en pantallas 4K y Full HD:
- Fondo oficial DCE optimizado en alta definición.
- Reloj ceremonial en vivo con fecha completa en español.
- Insignia dorada animada del 205 aniversario y rotación automática de 36 frases patrióticas.
- **Visor de Mapas 3D**: Ciclo automático cada 12s de los 22 departamentos y vista general de Guatemala, con selector manual.
- **Muro de Mensajes en Vivo**: Actualización en tiempo real vía polling con la hora oficial de Guatemala.
- **Sistema Multimedia de Celebración**: Al entrar un nuevo mensaje, se reproduce un efecto sonoro patriótico, se lanza confeti en el lienzo interactivo y se despliega un modal festivo con animación GIF y los datos del remitente.

### 2. Formulario Móvil de Invitados (`form/index.html`)
Optimizada para acceso rápido desde teléfonos móviles:
- Campos: Nombre del invitado, departamento (22 departamentos) y mensaje conmemorativo.
- **Ticket de Validación**: Al enviar el mensaje, el sistema genera y entrega al usuario un código alfanumérico único de 5 caracteres (ej. `00523`, `FCLL9`) con botón para copiar al portapapeles.

### 3. Portal Administrativo de Verificación (`verificar/index.html`)
Permite a los coordinadores del evento validar y comprobar la autenticidad de los códigos presentados por los asistentes:
- **Búsqueda y Validación Rápida**: Comprueba en segundos si el código existe en la base de datos y muestra nombre, departamento, hora y mensaje.
- **Filtros Avanzados**: Búsqueda por participante, código o departamento.
- **Métricas**: Conteo total de participantes y departamentos representados.
- **Exportación**: Descarga directa de la base de datos a formato CSV.

### 4. Backend Serverless y Base de Datos (`api/mensajes.js` + Neon Postgres)
- Conexión ligera y segura sin credenciales expuestas en el cliente.
- Base de datos alojada en **Neon Postgres** con función nativa y trigger para generación automática de códigos de 5 caracteres.
- Despliegue en **Vercel** (`https://conexion-a-base-de-datos-neon.vercel.app/api/mensajes`).

---

## 🚀 Despliegue

### GitHub Pages:
1. Ir a **Settings > Pages**.
2. En **Build and deployment**, seleccionar la rama `main` y la carpeta `/ (root)`.
3. Guardar cambios.
