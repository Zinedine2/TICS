async function registrarUsuario() {
  const nombre = document.getElementById('nombre').value;
  const dni = document.getElementById('dni').value;
  const res = await fetch('/api/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, dni })
  });
  alert(await res.text());
}

async function consultarHorarios() {
  const fecha = document.getElementById('fechaConsulta').value;
  const res = await fetch(`/api/horarios?fecha=${fecha}`);
  const data = await res.json();
  const lista = document.getElementById('horariosDisponibles');
  lista.innerHTML = '';
  data.forEach(h => {
    lista.innerHTML += `<li>${h}</li>`;
  });
}

async function realizarReserva() {
  const dni = document.getElementById('dniReserva').value;
  const fecha = document.getElementById('fechaReserva').value;
  const hora = document.getElementById('horaReserva').value;
  const res = await fetch('/api/reservar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni, fecha, hora })
  });
  alert(await res.text());
  cargarReservas();
}

async function confirmarPago() {
  const dni = document.getElementById('dniPago').value;
  const res = await fetch('/api/pagar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni })
  });
  alert(await res.text());
  cargarReservas();
}

async function cargarReservas() {
  const res = await fetch('/api/reservas');
  const data = await res.json();
  const tabla = document.getElementById('tablaReservas');
  tabla.innerHTML = '';
  data.forEach(r => {
    tabla.innerHTML += `<tr>
      <td>${r.dni}</td><td>${r.fecha}</td><td>${r.hora}</td><td>${r.estado}</td>
    </tr>`;
  });
}

cargarReservas();
