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
  points += (obj.total.split(".")[1] === "00") ? 50 : 0;
  points += obj.total % 0.25 === 0 ? 25 : 0;
  points += Math.floor(obj.items.length / 2) * 5;
  points += obj.items.reduce((total, value) => {
    var l = value.shortDescription.trim().length;
    return total + Math.ceil(l % 3 === 0 ? value.price * 0.2 : 0);
  }, 0);
  console.log(new Date(obj.purchaseDate));
  points += (new Date(obj.purchaseDate)).getDate() % 2 !== 0 ? 6 : 0;
  points += (new Date(`${obj.purchaseDate} ${obj.purchaseTime}`)) > (new Date(`${obj.purchaseDate} 14:00`))
  && (new Date(`${obj.purchaseDate} ${obj.purchaseTime}`)) < (new Date(`${obj.purchaseDate} 16:00`)) ? 10 : 0;
  return points;
}
app.post('/receipts/process', (req, res) => {
  const { data } = req.body;
  const id = uuidv4();
  if (!data || typeof data !== 'object') {
    return res.status(404).json({ error: 'The receipt is invalid' });
  }
  try {
    processes.set(id, { data, points: calculatePoints(data) });
    res.status(200).json({ id });
  } catch {
    res.status(404).json({ error: 'The receipt is invalid' });
  }
});

app.get('/receipts/:id/points', (req, res) => {
  const { id } = req.params;
  if (processes.has(id)) {
    const points = processes.get(id).points;
    res.status(200).json({ points });
  }
  else {
    res.status(404).json({ error: 'No receipt found for that id' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});
