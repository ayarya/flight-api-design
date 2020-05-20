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
		for (let record of records) {
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
}

module.exports = new FlightRepository('flights.json');
