const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const pool = new Pool({
  user: 'moral503',
  password: 'hG0rwDrm5KbOVGgM2yZyPagsPb3IQTQX',
  host: 'dpg-cmduaa6d3nmc73dn5bqg-a.oregon-postgres.render.com',
  port: '5432',
  database: 'lover_flower',
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => {
    console.log('Connected to the database');
    
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', async (req, res) => {
  res.status(200).json({ result: 'all ok' });
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM world_bike_product');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/from-little', async (req, res) => {
  try {
    const result = await (await pool.query('SELECT * FROM world_bike_product')).rows;
    res.json(result.sort((a, b) => a.cost - b.cost));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/from-biggest', async (req, res) => {
  try {
    const result = await (await pool.query('SELECT * FROM world_bike_product')).rows;
    res.json(result.sort((a, b) => b.cost - a.cost));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const result = await pool.query(`SELECT * FROM world_bike_product WHERE id = ${id.slice(1)}`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});