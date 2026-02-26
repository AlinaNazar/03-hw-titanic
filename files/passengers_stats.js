import fs from 'node:fs';


// See file train.csv with information about "Titanic" passengers.
// 1.Calculate total fares;
// 2.Calculate average fare for 1,2,3 classes of travel;
// 3.Calculate total quantity of survived and non survived passengers;
// 4.Calculate total quantity of survived and non survived men, women and
// children(under 18 years old);


function stats(passengers) {
    const totalFares = passengers.reduce((sum, p) => sum + p.Fare, 0);

    const first = passengers.filter(p => p.Pclass === 1).reduce((sum, p) => sum + p.Fare, 0) / passengers.filter(p => p.Pclass === 1).length;
    const second = passengers.filter(p => p.Pclass === 2).reduce((sum, p) => sum + p.Fare, 0) / passengers.filter(p => p.Pclass === 2).length;
    const third = passengers.filter(p => p.Pclass === 3).reduce((sum, p) => sum + p.Fare, 0) / passengers.filter(p => p.Pclass === 3).length;
    const avgFare = {
        first,
        second,
        third,
    }

    const totalQSurv = passengers.filter(p => p.Survived === 1).length;
    const totalQNonSurv = passengers.filter(p => p.Survived === 0).length;

    const menS = passengers.filter(p => p.Age > 18 && p.Sex === 'male' && p.Survived === 1).length;
    const womenS = passengers.filter(p => p.Age > 18 && p.Sex === 'female' && p.Survived === 1).length;
    const childrenS = passengers.filter(p => p.Age <= 18 && p.Survived === 1).length;

    const survivedGroup = {
        menS,
        womenS,
        childrenS
    }

    const menN = passengers.filter(p => p.Age > 18 && p.Sex === 'male' && p.Survived === 0).length;
    const womenN = passengers.filter(p => p.Age > 18 && p.Sex === 'female' && p.Survived === 0).length;
    const childrenN = passengers.filter(p => p.Age <= 18 && p.Survived === 0).length;

    const nonSurvivedGroup = {
        menN,
        womenN,
        childrenN
    }

    return {
        totalFares,
        avgFare,
        totalQSurv,
        totalQNonSurv,
        survivedGroup,
        nonSurvivedGroup

    }
}

function splitFormula(line) {
    const res = [];
    let inQuotes = false;
    let temp = '';
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                temp += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (ch === ',' && !inQuotes) {
            res.push(temp.trim());
            temp = '';
            continue;
        }
        temp += ch;
    }

    res.push(temp.trim());
    return res;
}

function maybeValueNullOrNumber(h, value) {
    if (value === '') return null;
    if (['PassengerId', 'Survived', 'Pclass', 'Age', 'SibSp', 'Parch', 'Fare'].includes(h)) {
        return value === null ? null : Number(value);
    }
    return value;
}


function* passengerGenerator(passLines, headers) {
    for (const l of passLines) {
        const line = l.replace(/\r$/, '');
        if (!line.trim()) continue;

        const values = splitFormula(line);
        const p = Object.fromEntries(
            headers.map((h, i) => [h,
                maybeValueNullOrNumber(h, values[i] ?? '')])
        )
        yield p;
    }

}


fs.readFile('./train.csv', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        const arr = data.split('\n');
        const keys = arr[0].replace(/\r$/, '').split(',').map(k => k.trim());
        const passLines = arr.slice(1);
        const passengers = [...passengerGenerator(passLines, keys)];
        // console.log(keys);
        // console.log(passLines[0])
        // console.log(passengers[0]);


        const resultStats = stats(passengers);
        console.log(`Total fares: ${Math.round(resultStats.totalFares* 100)/100}`)
        console.log(`Average fare for first class: ${Math.round(resultStats.avgFare.first*100)/100}`)
        console.log(`Average fare for second class: ${Math.round(resultStats.avgFare.second* 100)/100}`)
        console.log(`Average fare for third class: ${Math.round(resultStats.avgFare.third* 100)/100}`)
        console.log(`Total quantity of survived: ${resultStats.totalQSurv}`)
        console.log(`Total quantity of non survived: ${resultStats.totalQNonSurv}`)
        console.log(`Total quantity of survived men: ${resultStats.survivedGroup.menS}`)
        console.log(`Total quantity of survived women: ${resultStats.survivedGroup.womenS}`)
        console.log(`Total quantity of survived children: ${resultStats.survivedGroup.childrenS}`)
        console.log(`Total quantity of non survived men: ${resultStats.nonSurvivedGroup.menN}`)
        console.log(`Total quantity of non survived women: ${resultStats.nonSurvivedGroup.womenN}`)
        console.log(`Total quantity of non survived children: ${resultStats.nonSurvivedGroup.childrenN}`)
    }
})

