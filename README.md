Para poder levantar el proyecto:

Desde la carpeta `backend` o usando `cd backend`(copiar `.env.ejemplo` como `.env` y completar los datos):

```bash
npm install
```

```bash
npm run crearBase
```

```bash
npm run cargarProductos
```

```bash
<<<<<<< HEAD
npm run cargarAdmin
```

```bash
npm run dev
=======
npm.cmd run dev
>>>>>>> origin/Rama-daniel
```

`crearBase` crea la base `technologia` si no existe (alcanza con hacerlo una vez). `cargarProductos` crea la tabla y carga los 10 productos de ejemplo solo si está vacía. `dev` deja la API en <http://localhost:3000/api> y el panel en <http://localhost:3000/login>, y reinicia el servidor al guardar cambios.


Abrir `frontend/index.html` con la extensión *Live Server* de VS Code (puerto 5500). Si se usa otro puerto, hay que agregarlo en `origenesPermitidos` del `.env`. El botón Tienda del panel lleva a `http://127.0.0.1:5500/frontend/index.html`; si Live Server abre la tienda en otra dirección, se cambia con `urlTienda` en el `.env`.