export class Titanic {

    constructor() {
        this._totalFare = 0;
        this._fareByClass = {
            1: {sum: 0, count: 0},
            2: {sum: 0, count: 0},
            3: {sum: 0, count: 0},
        };

        this._survived = {
            s: 0,
            n: 0,
        }

        this._survivedByGender = {
            sM: 0,
            nsM: 0,
            sW: 0,
            nsW: 0
        }

        this._survivedChildren = {
            sCh: 0,
            nsCh: 0,
        }
    }

    addFare(fare) {
        this._totalFare += fare;
    }

    get totalFare() {
        return this._totalFare;
    }

    addFareByClass(key, value) {
        if (this._fareByClass[key]) {
            this._fareByClass[key].sum += value;
            this._fareByClass[key].count++
        }
    }

    get fareByClass() {
        const res = {};

        for (let clss of [1, 2, 3]) {
            const {sum, count} = this._fareByClass[clss];
            switch (clss) {
                case 1:
                    clss = 'first';
                    break;
                case 2:
                    clss = 'second';
                    break;
                case 3:
                    clss = 'third';
                    break;
            }
            res[clss] = +(sum / count).toFixed(2);
        }
        return res;
    }

    addSurvived(isSurvive, gender, age) {
        if (isSurvive) {
            gender === 'male' ? this._survivedByGender.sM++ : this._survivedByGender.sW++;
            if (age != null && age <= 18) this._survivedChildren.sCh++;
        } else {
            gender === 'male' ? this._survivedByGender.nsM++ : this._survivedByGender.nsW++;
            if (age <= 18) this._survivedChildren.nsCh++;
        }

    }

    get survived() {
        return {
            'Total survived': this._survivedByGender.sM + this._survivedByGender.sW,
            'Total non survived': this._survivedByGender.nsM + this._survivedByGender.nsW
        }
    }

    get survivedByGender() {
        return {
            'Total survived men': this._survivedByGender.sM,
            'Total survived women': this._survivedByGender.sW,
            'Total non survived men': this._survivedByGender.nsM,
            'Total non survived women': this._survivedByGender.nsW
        }
    }

    get survivedChildren() {
        return {
            'Total survived children': this._survivedChildren.sCh,
            'Total non survived children': this._survivedChildren.nsCh
        }
    }

}

