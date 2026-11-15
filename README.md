Para poder levantar el proyecto:

Desde la carpeta `backend`:

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
npm run dev
```

`crearBase` crea la base `technologia` si no existe (alcanza con hacerlo una vez). `cargarProductos` crea la tabla y carga los 10 productos de ejemplo solo si está vacía. `dev` deja la API en <http://localhost:3000/api> y el panel en <http://localhost:3000/login>, y reinicia el servidor al guardar cambios.