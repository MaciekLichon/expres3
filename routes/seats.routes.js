const express = require('express');
const shortid = require('shortid');
const router = express.Router();
const db = require('./../db');


router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const itemData = db.seats.find( item => item["id"] == req.params.id);

  if (itemData) {
    res.json(itemData);
  } else {
    res.json({ message: `id: '${req.params.id}' doesn't exist` });
  }
});


router.route('/seats').post((req, res) => {
  const id = shortid.generate();
  const { day, seat, client, email } = req.body;

  const checkSeat = item => {
    return (item["seat"] == seat && item["day"] == day);
  };
  const alreadySelected = db.seats.some(checkSeat);

  if (id && day && seat && client && email) {
    if (alreadySelected) {
      res.json({ message: 'The slot is already taken...' });
    } else {
      db.seats.push({ id, day, seat, client, email });
      req.io.emit('seatsUpdated', db.seats);
      res.json({ message: 'OK' });
    }
  } else {
    res.json({ message: 'missing data' });
  }
});


router.route('/seats/:id').put((req, res) => {
  const { day, seat, client, email} = req.body;

  if (day && seat && client && email) {
    const itemToChange = db.seats.find(elem => elem["id"] == req.params.id);
    if (itemToChange) {
      itemToChange["day"] = day;
      itemToChange["seat"] = seat;
      itemToChange["client"] = client;
      itemToChange["email"] = email;
      res.json({ message: 'OK' });
    } else {
      res.json({ message: `id: '${req.params.id}' doesn't exist` });
    }
  } else {
    res.json({ message: 'missing data' });
  }
});


router.route('/seats/:id').delete((req, res) => {
  let index = null;
  const itemToDelete = db.seats.find(elem => elem["id"] == req.params.id);

  if (itemToDelete) {
    index = db.seats.indexOf(itemToDelete);
    db.seats.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.json({ message: `id: '${req.params.id}' doesn't exist` });
  }
});

module.exports = router;
