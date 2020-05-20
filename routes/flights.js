const express = require('express');

const flightRepo = require('../repositories/flights');
const flightTemplate = require('../views/index');

const router = express.Router();

router.get('/', (req, res) => {
	res.send(flightTemplate({ req }));
});

router.post('/', (req, res) => {});

module.exports = router;
