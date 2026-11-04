// Datos generales de la app (nombre, alumnos, categorías y sus atributos); lo usan todas las pantallas.
export const config = {
  nombreApp: "Technologia",
  eslogan: "Autoservicio de componentes de PC",
  empresa: "Technologia S.A.",
  alumnos: ["Daniel Alvarez", "Luciano Santa Cruz"],

  categorias: [
    {
      id: "ssd",
      nombre: "Memorias SSD",
      icono: "iconoSsd",
      atributos: [
        { clave: "marca", nombre: "Marca" },
        { clave: "capacidad", nombre: "Capacidad" },
        { clave: "formato", nombre: "Formato" },
        { clave: "interfaz", nombre: "Interfaz" },
        { clave: "lectura", nombre: "Lectura", unidad: "MB/s" },
        { clave: "escritura", nombre: "Escritura", unidad: "MB/s" },
      ],
    },
    {
      id: "procesadores",
      nombre: "Procesadores",
      icono: "iconoProcesador",
      atributos: [
        { clave: "marca", nombre: "Marca" },
        { clave: "nucleos", nombre: "Núcleos" },
        { clave: "hilos", nombre: "Hilos" },
        { clave: "frecuenciaBase", nombre: "Frecuencia base", unidad: "GHz" },
        { clave: "frecuenciaTurbo", nombre: "Frecuencia turbo", unidad: "GHz" },
        { clave: "socket", nombre: "Socket" },
        { clave: "graficosIntegrados", nombre: "Gráficos integrados" },
      ],
    },
  ],

  productosPorPagina: 6,

  urlLoginAdmin: null,
};
