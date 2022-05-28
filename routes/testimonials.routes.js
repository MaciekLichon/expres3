const express = require('express');
const shortid = require('shortid');
const router = express.Router();
const db = require('./../db');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[randomIndex]);
});

router.route('/testimonials/:id').get((req, res) => {
  const itemData = db.testimonials.find( item => item["id"] == req.params.id);

  if (itemData) {
    res.json(itemData);
  } else {
    res.json({ message: `id: '${req.params.id}' doesn't exist` });
  }
});


router.route('/testimonials').post((req, res) => {
  const id = shortid.generate();
  const { author, text } = req.body;

  if (id && author && text) {
    db.testimonials.push({ id, author, text });
    res.json({ message: 'OK' });
  } else {
    res.json({ message: 'missing data' });
  }
});


router.route('/testimonials/:id').put((req, res) => {
  const { author, text } = req.body;

  if (author && text) {
    const itemToChange = db.testimonials.find(elem => elem["id"] == req.params.id);
    if (itemToChange) {
      itemToChange["author"] = author;
      itemToChange["text"] = text;
      res.json({ message: 'OK' });
    } else {
      res.json({ message: `id: '${req.params.id}' doesn't exist` });
    }
  } else {
    res.json({ message: 'missing data' });
  }
});


router.route('/testimonials/:id').delete((req, res) => {
  let index = null;
  const itemToDelete = db.testimonials.find(elem => elem["id"] == req.params.id);

  if (itemToDelete) {
    index = db.testimonials.indexOf(itemToDelete);
    db.testimonials.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.json({ message: `id: '${req.params.id}' doesn't exist` });
  }
});

module.exports = router;
