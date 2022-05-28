const express = require('express');
const shortid = require('shortid');
const router = express.Router();
const db = require('./../db');

router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const itemData = db.concerts.find( item => item["id"] == req.params.id);

  if (itemData) {
    res.json(itemData);
  } else {
    res.json({ message: `id: '${req.params.id}' doesn't exist` });
  }
});


router.route('/concerts').post((req, res) => {
  const id = shortid.generate();
  const { performer, genre, price, day, image } = req.body;

  if (id && performer && genre && price && day && image) {
    db.concerts.push({ id, performer, genre, price, day, image });
    res.json({ message: 'OK' });
  } else {
    res.json({ message: 'missing data' });
  }
});


router.route('/concerts/:id').put((req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (performer && genre && price && day && image) {
    const itemToChange = db.concerts.find(elem => elem["id"] == req.params.id);
    if (itemToChange) {
      itemToChange["performer"] = performer;
      itemToChange["genre"] = genre;
      itemToChange["price"] = price;
      itemToChange["day"] = day;
      itemToChange["image"] = image;
      res.json({ message: 'OK' });
    } else {
      res.json({ message: `id: '${req.params.id}' doesn't exist` });
    }
  } else {
    res.json({ message: 'missing data' });
  }
});


router.route('/concerts/:id').delete((req, res) => {
  let index = null;
  const itemToDelete = db.concerts.find(elem => elem["id"] == req.params.id);

  if (itemToDelete) {
    index = db.concerts.indexOf(itemToDelete);
    db.concerts.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.json({ message: `id: '${req.params.id}' doesn't exist` });
  }
});

module.exports = router;
