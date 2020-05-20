const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

class FlightRepository {
	constructor(filename) {
		// constructor require synchronus function
		if (!filename) {
			throw new Error('Creating a repository require a File name');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '{ "flights":[] }');
		}
	}

	async getall() {
		//open file, read content, parse json content, return this data
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}

	async create(attrib) {
		//{key:"value", key:"value"}
		attrib.id = this.randomId();
		const records = await this.getall();
		records.flights.push(attrib);
		await this.writeall(records);
		return attrib;
	}

	async writeall(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getall();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getall();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeall(filteredRecords);
	}

	async update(id, attrib) {
		const records = await this.getall();
		const record = records.find((record) => record.id === id);
		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}
		Object.assign(record, attrib);
		//{email:"ada"},{pass:"dd"}=>{email:"ada", pass:"dd"}
		await this.writeall(records);
	}

	async getOneBy(filters) {
		const records = await this.getall();
		for (let record of records.flights) {
			let found = true;
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			if (found) {
				return record;
			}
		}
	}

	async getAllBy(filters) {
		const records = await this.getall();
		let flightData = [];
		for (let record of records.flights) {
			let found = true;
			for (let key in filters) {
				if (key === 'departure') {
					let time = filters[key];
					let timeArray = time.split(':');
					let hours = parseInt(timeArray[0]);
					let min = parseInt(timeArray[1]);
					let finalTime = hours + min / 60;
					let timejson = record[key];
					let timeArrayjson = timejson.split(':');
					let hoursjson = parseInt(timeArrayjson[0]);
					let minjson = parseInt(timeArrayjson[1]);
					let AmOrPm = timeArrayjson[1].substring(2);
					if (AmOrPm === 'PM' && hoursjson !== 12) {
						hoursjson = hoursjson + 12;
					}
					if (AmOrPm === 'AM' && hoursjson === 12) {
						hoursjson = hoursjson - 12;
					}
					let finalTimeJson = hoursjson + minjson / 60;
					if (Math.abs(finalTimeJson - finalTime) <= 5) {
						continue;
					}
				}
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			if (found) {
				flightData.push(record);
			}
		}
		return flightData;
	}
}

module.exports = new FlightRepository('flights.json');
