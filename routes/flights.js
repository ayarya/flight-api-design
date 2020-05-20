const express = require('express');

const flightRepo = require('../repositories/flights');
const flightTemplate = require('../views/index');

const router = express.Router();

router.get('/', (req, res) => {
	res.send(flightTemplate({ req }));
});

router.post('/', async (req, res) => {
	const { departure } = req.body;
	const data = await flightRepo.getAllBy({ departure });
	res.send(data);
});

// router.post('/create', async (req, res) => {
// 	await flightRepo.create({ flight: 'Air Canada 8099', departure: '7:30AM' });
// 	await flightRepo.create({ flight: 'United Airline 6115', departure: '10:30AM' });
// 	await flightRepo.create({ flight: 'WestJet 6456', departure: '12:30PM' });
// 	await flightRepo.create({ flight: 'Delta 3833', departure: '3:00PM' });
// });

module.exports = router;
