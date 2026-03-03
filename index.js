import fs from 'node:fs';
import {Titanic} from "./model/Titanic.js";
import * as readline from "node:readline";



function maybeValueNullOrNumber(values) {
    const numericIndexes = new Set([0, 1, 2, 5, 6, 7, 9]);
    for(let i = 0; i < values.length; i++) {
        if (values[i] === '') values[i] = null;
        if (numericIndexes.has(i)) {
           values[i] = values[i] === null ? null : Number(values[i]);
        }
    }
    return values;
}

const file = fs.createReadStream(new URL('./train.csv',import.meta.url), 'utf-8');
const reader = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
})

let headers = false;
const stats = new Titanic();

reader.on('line', (line) => {
    if(!headers){
        headers = true;
        return;
    }

    const value = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    maybeValueNullOrNumber(value);
    stats.addFare(value[9]);
    stats.addFareByClass(value[2], value[9]);
    stats.addSurvived(value[1], value[4], value[5]);
})

reader.on('close', () => {
    console.log()
    console.log(`Total fares:`, stats.totalFare.toFixed(2));
    console.log(`Average fares by classes:`, stats.fareByClass);
    console.log(stats.survived);
    console.log(stats.survivedByGender);
    console.log(stats.survivedChildren);
})
console.log("cwd:", process.cwd());
console.log("script:", import.meta.url);
