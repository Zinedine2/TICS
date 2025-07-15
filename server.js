const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const usuariosPath = './data/usuarios.json';
const reservasPath = './data/reservas.json';

const horariosBase = ['08:00', '09:00', '10:00', '11:00', '12:00'];

function leer(path) {
  return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];
}
function guardar(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

app.post('/api/registrar', (req, res) => {
  const { nombre, dni } = req.body;
  const usuarios = leer(usuariosPath);
  if (usuarios.find(u => u.dni === dni)) {
    return res.send('DNI ya registrado');
  }
  usuarios.push({ nombre, dni });
  guardar(usuariosPath, usuarios);
  res.send('Usuario registrado con éxito');
});

app.get('/api/horarios', (req, res) => {
  const fecha = req.query.fecha;
  const reservas = leer(reservasPath);
  const ocupados = reservas.filter(r => r.fecha === fecha).map(r => r.hora);
  const disponibles = horariosBase.filter(h => !ocupados.includes(h));
  res.json(disponibles);
});

app.post('/api/reservar', (req, res) => {
  const { dni, fecha, hora } = req.body;
  const reservas = leer(reservasPath);
  const usuarios = leer(usuariosPath);

  if (!usuarios.find(u => u.dni === dni)) {
    return res.send('Usuario no registrado');
  }
  if (reservas.find(r => r.fecha === fecha && r.hora === hora)) {
    return res.send('Horario ya reservado');
  }

  reservas.push({ dni, fecha, hora, estado: 'Pendiente' });
  guardar(reservasPath, reservas);
  res.send('Reserva registrada con estado pendiente');
});

app.post('/api/pagar', (req, res) => {
  const { dni } = req.body;
  const reservas = leer(reservasPath);
  reservas.forEach(r => {
    if (r.dni === dni && r.estado === 'Pendiente') {
      r.estado = 'Confirmado';
    }
  });
  guardar(reservasPath, reservas);
  res.send('Reserva(s) confirmada(s) y pagada(s)');
});

app.get('/api/reservas', (req, res) => {
  res.json(leer(reservasPath));
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
