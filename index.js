const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Datos en memoria (sin base de datos)
let candidatos = [
  { id: '1', nombre: 'Juan Pérez', votos: 0 },
  { id: '2', nombre: 'María Gómez', votos: 0 },
  { id: '3', nombre: 'Carlos Ruiz', votos: 0 }
];

let votosRegistrados = {}; // Para evitar votos duplicados

// Función para mostrar en consola los votos actuales
function mostrarVotosEnConsola() {
  console.log('--- Votos actuales ---');
  candidatos.forEach(c => {
    console.log(`${c.nombre}: ${c.votos} votos`);
  });
  console.log('----------------------');
}

// Ruta para obtener candidatos
app.get('/candidatos', (req, res) => {
  res.json(candidatos);
});

// Ruta para votar
app.post('/votar', (req, res) => {
  const { usuarioId, candidatoId } = req.body;

  if (!usuarioId || !candidatoId) {
    return res.status(400).json({ msg: 'Faltan datos' });
  }

  if (votosRegistrados[usuarioId]) {
    return res.status(400).json({ msg: 'Usuario ya votó' });
  }

  const candidato = candidatos.find(c => c.id === candidatoId);
  if (!candidato) {
    return res.status(404).json({ msg: 'Candidato no encontrado' });
  }

  candidato.votos += 1;
  votosRegistrados[usuarioId] = true;

  // Mostrar votos en consola cada vez que alguien vote
  mostrarVotosEnConsola();

  res.json({ msg: 'Voto registrado' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
