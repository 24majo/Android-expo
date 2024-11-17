// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000; 

const pool = new Pool({
  user: 'postgres',
  host: '10.10.25.190', 
  database: 'SIHEG2',
  password: '$PassW0rd',
  port: 5432, 
});

app.use(cors());
app.use(express.json()); // Para manejar JSON en las solicitudes


app.get('/mediciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tabla_dep_piezo;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mediciones:', error);
    res.status(500).send('Error en el servidor');
  }
});


app.post('/mediciones', async (req, res) => {
  const { medicionId, medicionNombre, valor } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO mediciones (medicionId, medicionNombre, valor) VALUES ($1, $2, $3) RETURNING *;',
      [medicionId, medicionNombre, valor]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al insertar medición:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor API escuchando en http://localhost:${port}`);
});

//prueba de conexion
// app.get('/test-db-connection', async (req, res) => {
//   try {
//     await pool.query('SELECT 1');
//     res.send('Conexión a la base de datos exitosa');
//   } catch (error) {
//     console.error('Error en la conexión a la base de datos:', error);
//     res.status(500).send('Error en la conexión a la base de datos');
//   }
// });