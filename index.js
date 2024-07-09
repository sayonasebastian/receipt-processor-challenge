const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
const processes = new Map();

const calculatePoints = function (obj) {
  let points = 0;
  const regX = /[a-zA-Z0-9]/g;
  const matches = obj.retailer.match(regX);
  points += matches ? matches.length : 0;
  points += obj.total === Math.round(obj.total) ? 50 : 0;
  points += obj.total % 0.25 === 0 ? 25 : 0;
  points += Math.floor(obj.items.length / 2) * 5;
  points += obj.items.reduce((total, value) => {
    var l = value.shortDescription.trim().length;
    return total + Math.ceil(l % 3 === 0 ? value.price * 0.2 : 0);
  }, 0);
  points += (new Date(obj.purchaseDate)).getDate() % 2 !== 0 ? 6 : 0;
  points += parseInt(obj.purchaseTime.split(':')[0]) > 2 && parseInt(obj.purchaseTime.split(':')[0]) < 4 ? 10 : 0;
  return points;
}
app.post('/receipts/process', (req, res) => {
  const { data } = req.body;
  const id = uuidv4();
  try {
    processes.set(id, { data, points: calculatePoints(data) });
    res.json({ id });
  } catch {
    res.status(400).json({ error: 'Invalid json' });
  }
});

app.get('/receipts/:id/points', (req, res) => {
  const { id } = req.params;
  let points
  if (processes.has(id)) {
    points = processes.get(id).points
  }
  ;
  const response = points ? { points } : { message: "id not present" }
  res.json(response);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});
