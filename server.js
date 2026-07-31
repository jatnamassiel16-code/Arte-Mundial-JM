const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'artworks.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Utilidades de "base de datos" en archivo JSON ---
function leerObras() {
  const contenido = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(contenido);
}

function guardarObras(obras) {
  fs.writeFileSync(DB_FILE, JSON.stringify(obras, null, 2));
}

function nuevoId(obras) {
  return obras.length ? Math.max(...obras.map(o => o.id)) + 1 : 1;
}

// --- Utilidades para las compras registradas ---
function leerCompras() {
  const contenido = fs.readFileSync(ORDERS_FILE, 'utf-8');
  return JSON.parse(contenido);
}

function guardarCompras(compras) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(compras, null, 2));
}

// --- Validación básica (feature/validate-user-input) ---
function validarObra(body) {
  const errores = [];
  if (!body.titulo || body.titulo.trim().length < 2) {
    errores.push('El título es obligatorio (mínimo 2 caracteres).');
  }
  if (!body.artista || body.artista.trim().length < 2) {
    errores.push('El nombre del artista es obligatorio.');
  }
  if (!body.pais || body.pais.trim().length < 2) {
    errores.push('El país es obligatorio.');
  }
  if (body.precio === undefined || isNaN(body.precio) || Number(body.precio) < 0) {
    errores.push('El precio debe ser un número mayor o igual a 0.');
  }
  return errores;
}

// ============ RUTAS CRUD ============

// READ (todas, con filtro opcional por país o categoría -> feature/search-filter)
app.get('/api/artworks', (req, res) => {
  let obras = leerObras();
  const { pais, categoria, q } = req.query;

  if (pais) {
    obras = obras.filter(o => o.pais.toLowerCase() === pais.toLowerCase());
  }
  if (categoria) {
    obras = obras.filter(o => o.categoria.toLowerCase() === categoria.toLowerCase());
  }
  if (q) {
    const term = q.toLowerCase();
    obras = obras.filter(o =>
      o.titulo.toLowerCase().includes(term) ||
      o.artista.toLowerCase().includes(term)
    );
  }
  res.json(obras);
});

// READ (una obra)
app.get('/api/artworks/:id', (req, res) => {
  const obras = leerObras();
  const obra = obras.find(o => o.id === Number(req.params.id));
  if (!obra) return res.status(404).json({ error: 'Obra no encontrada' });
  res.json(obra);
});

// CREATE
app.post('/api/artworks', (req, res) => {
  const errores = validarObra(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const obras = leerObras();
  const nueva = {
    id: nuevoId(obras),
    titulo: req.body.titulo.trim(),
    artista: req.body.artista.trim(),
    pais: req.body.pais.trim(),
    categoria: req.body.categoria || 'General',
    precio: Number(req.body.precio),
    imagenUrl: req.body.imagenUrl || 'https://picsum.photos/400/300',
    descripcion: req.body.descripcion || ''
  };
  obras.push(nueva);
  guardarObras(obras);
  res.status(201).json(nueva);
});

// UPDATE
app.put('/api/artworks/:id', (req, res) => {
  const errores = validarObra(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const obras = leerObras();
  const idx = obras.findIndex(o => o.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Obra no encontrada' });

  obras[idx] = {
    ...obras[idx],
    titulo: req.body.titulo.trim(),
    artista: req.body.artista.trim(),
    pais: req.body.pais.trim(),
    categoria: req.body.categoria || obras[idx].categoria,
    precio: Number(req.body.precio),
    imagenUrl: req.body.imagenUrl || obras[idx].imagenUrl,
    descripcion: req.body.descripcion || obras[idx].descripcion
  };
  guardarObras(obras);
  res.json(obras[idx]);
});

// DELETE
app.delete('/api/artworks/:id', (req, res) => {
  const obras = leerObras();
  const idx = obras.findIndex(o => o.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Obra no encontrada' });

  const eliminada = obras.splice(idx, 1);
  guardarObras(obras);
  res.json({ mensaje: 'Obra eliminada', obra: eliminada[0] });
});

// ============ RUTAS DE COMPRAS (feature/purchase-registration) ============

// READ (todas las compras registradas)
app.get('/api/orders', (req, res) => {
  res.json(leerCompras());
});

// CREATE (registrar una compra)
app.post('/api/orders', (req, res) => {
  const { obraId, comprador, cantidad } = req.body;

  const errores = [];
  if (!obraId) errores.push('Debes elegir una obra.');
  if (!comprador || comprador.trim().length < 2) {
    errores.push('El nombre del comprador es obligatorio.');
  }
  if (!cantidad || isNaN(cantidad) || Number(cantidad) < 1) {
    errores.push('La cantidad debe ser al menos 1.');
  }
  if (errores.length) return res.status(400).json({ errores });

  const obras = leerObras();
  const obra = obras.find(o => o.id === Number(obraId));
  if (!obra) return res.status(404).json({ error: 'La obra seleccionada no existe' });

  const compras = leerCompras();
  const nuevaCompra = {
    id: compras.length ? Math.max(...compras.map(c => c.id)) + 1 : 1,
    obraId: obra.id,
    tituloObra: obra.titulo,
    comprador: comprador.trim(),
    cantidad: Number(cantidad),
    precioUnitario: obra.precio,
    total: obra.precio * Number(cantidad),
    fecha: new Date().toISOString()
  };
  compras.push(nuevaCompra);
  guardarCompras(compras);
  res.status(201).json(nuevaCompra);
});

// DELETE (cancelar una compra registrada)
app.delete('/api/orders/:id', (req, res) => {
  const compras = leerCompras();
  const idx = compras.findIndex(c => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Compra no encontrada' });

  const eliminada = compras.splice(idx, 1);
  guardarCompras(compras);
  res.json({ mensaje: 'Compra cancelada', compra: eliminada[0] });
});

app.listen(PORT, () => {
  console.log(`ArteMundial corriendo en http://localhost:${PORT}`);
});
