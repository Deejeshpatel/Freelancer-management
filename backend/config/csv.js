const { Parser } = require('json2csv');
const csvParser = require('csv-parser');
const fs = require('fs');

exports.generateCSV = (data) => {
    const json2csv = new Parser();
    return json2csv.parse(data);
};

exports.parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};