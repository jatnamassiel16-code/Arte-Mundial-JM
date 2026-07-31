const API = '/api/artworks';
const ORDERS_API = '/api/orders';

const galeria = document.getElementById('galeria');
const form = document.getElementById('obraForm');
const erroresEl = document.getElementById('errores');
const btnCancelar = document.getElementById('btnCancelar');
const formTitulo = document.getElementById('formTitulo');

let obrasCache = [];

async function cargarObras(params = '') {
  const res = await fetch(API + params);
  const obras = await res.json();
  obrasCache = obras;
  pintarGaleria(obras);
}

function pintarGaleria(obras) {
  galeria.innerHTML = '';
  if (!obras.length) {
    galeria.innerHTML = '<p>No se encontraron obras.</p>';
    return;
  }
  obras.forEach(obra => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${obra.imagenUrl}" alt="${obra.titulo}" />
      <div class="card-body">
        <h3>${obra.titulo}</h3>
        <div class="card-meta">${obra.artista} · ${obra.pais} · ${obra.categoria}</div>
        <div class="card-precio">$${obra.precio}</div>
        <p>${obra.descripcion || ''}</p>
        <div class="card-acciones">
          <button class="btn-comprar" onclick="abrirModalCompra(${obra.id})">Comprar</button>
          <button class="btn-editar" onclick="editarObra(${obra.id})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarObra(${obra.id})">Eliminar</button>
        </div>
      </div>
    `;
    galeria.appendChild(card);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  erroresEl.textContent = '';

  const id = document.getElementById('obraId').value;
  const payload = {
    titulo: document.getElementById('titulo').value,
    artista: document.getElementById('artista').value,
    pais: document.getElementById('pais').value,
    categoria: document.getElementById('categoria').value,
    precio: document.getElementById('precio').value,
    imagenUrl: document.getElementById('imagenUrl').value,
    descripcion: document.getElementById('descripcion').value
  };

  const url = id ? `${API}/${id}` : API;
  const metodo = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json();
    erroresEl.textContent = (data.errores || [data.error]).join(' ');
    return;
  }

  resetForm();
  cargarObras();
});

async function editarObra(id) {
  const res = await fetch(`${API}/${id}`);
  const obra = await res.json();

  document.getElementById('obraId').value = obra.id;
  document.getElementById('titulo').value = obra.titulo;
  document.getElementById('artista').value = obra.artista;
  document.getElementById('pais').value = obra.pais;
  document.getElementById('categoria').value = obra.categoria;
  document.getElementById('precio').value = obra.precio;
  document.getElementById('imagenUrl').value = obra.imagenUrl;
  document.getElementById('descripcion').value = obra.descripcion;

  formTitulo.textContent = 'Editar obra';
  btnCancelar.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function eliminarObra(id) {
  if (!confirm('¿Seguro que deseas eliminar esta obra?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  cargarObras();
}

btnCancelar.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  document.getElementById('obraId').value = '';
  formTitulo.textContent = 'Agregar nueva obra';
  btnCancelar.style.display = 'none';
  erroresEl.textContent = '';
}

document.getElementById('btnBuscar').addEventListener('click', () => {
  const q = document.getElementById('buscar').value;
  const pais = document.getElementById('filtroPais').value;
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (pais) params.append('pais', pais);
  cargarObras('?' + params.toString());
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
  document.getElementById('buscar').value = '';
  document.getElementById('filtroPais').value = '';
  cargarObras();
});

// ============ REGISTRO DE COMPRAS ============

const modalCompra = document.getElementById('modalCompra');
const compraForm = document.getElementById('compraForm');
const compraObraId = document.getElementById('compraObraId');
const compraErrores = document.getElementById('compraErrores');
const listaCompras = document.getElementById('listaCompras');

document.getElementById('btnAbrirCompra').addEventListener('click', () => abrirModalCompra());
document.getElementById('btnCerrarCompra').addEventListener('click', cerrarModalCompra);

function abrirModalCompra(obraIdPreseleccionada) {
  compraObraId.innerHTML = obrasCache
    .map(o => `<option value="${o.id}">${o.titulo} — $${o.precio}</option>`)
    .join('');

  if (obraIdPreseleccionada) {
    compraObraId.value = obraIdPreseleccionada;
  }
  compraErrores.textContent = '';
  modalCompra.style.display = 'flex';
}

function cerrarModalCompra() {
  modalCompra.style.display = 'none';
  compraForm.reset();
}

compraForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  compraErrores.textContent = '';

  const payload = {
    obraId: compraObraId.value,
    comprador: document.getElementById('compraComprador').value,
    cantidad: document.getElementById('compraCantidad').value
  };

  const res = await fetch(ORDERS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const data = await res.json();
    compraErrores.textContent = (data.errores || [data.error]).join(' ');
    return;
  }

  cerrarModalCompra();
  cargarCompras();
});

async function cargarCompras() {
  const res = await fetch(ORDERS_API);
  const compras = await res.json();
  pintarCompras(compras);
}

function pintarCompras(compras) {
  if (!compras.length) {
    listaCompras.innerHTML = '<p>Todavía no hay compras registradas.</p>';
    return;
  }
  listaCompras.innerHTML = compras.map(c => `
    <div class="compra-item">
      <div>
        <strong>${c.tituloObra}</strong> — ${c.comprador} (x${c.cantidad})
        <div class="card-meta">${new Date(c.fecha).toLocaleString()}</div>
      </div>
      <div class="compra-total">
        $${c.total}
        <button class="btn-eliminar" onclick="cancelarCompra(${c.id})">Cancelar</button>
      </div>
    </div>
  `).join('');
}

async function cancelarCompra(id) {
  if (!confirm('¿Cancelar esta compra registrada?')) return;
  await fetch(`${ORDERS_API}/${id}`, { method: 'DELETE' });
  cargarCompras();
}

cargarObras();
cargarCompras();
