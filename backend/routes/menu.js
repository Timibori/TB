const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEED data (Run this once to populate your DB)
router.post('/seed', async (req, res) => {
  try {
    await Menu.deleteMany({}); // Clears old data
    const newMenu = await Menu.insertMany(req.body);
    res.json(newMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;