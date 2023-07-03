//test array:
const meetings = [
    '0830, 30',
    '0900, 45',
    '0930, 35',
    '1000, 30',
    '1200, 40',
    '2200, 20',
    //'5600, 85'
];
//reducer function:
function reducer(arr) {
    const initialValue = 0;
    const sumWithInitial = arr.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
    return sumWithInitial;
};
//function for making sure time entries are 4 digits long:
function modifyTimes(time) {
    let strNumber = time.toString();
    let targetLength = 4;
    let result = ' ';
    if (strNumber.length < targetLength) {
        let padding = new Array(targetLength - strNumber.length + 1).join('0');
        result = padding + strNumber;
    } else {
        result = strNumber;
    }
    return result;
};
//function for making sure times are correct after math:
function fixTime(time) {
    let fixedTime;
    let strTime = time.toString();
    if (strTime[2] >= '6') {
        fixedTime = Number(strTime) + 40;
        return fixedTime.toString();
    } else {
        fixedTime = time;
        return fixedTime.toString();
    }
};
//function that filters the above functions into one return, but it only works for a single value, not an array:
function finalTime(time) {
    let newTime = modifyTimes(time)
    let nextTime = fixTime(newTime);
    let finalTime = modifyTimes(nextTime);
    return finalTime;
};
//function for getting start/end times as numbers and returning them as an array of individual values:
function getStartEnd(arr) {
    let newArray = [];
    arr.forEach((item) => {
        let itemArr = item.split(',');
        let duration = Number(itemArr[1]);
        let startTime = Number(itemArr[0]);
        let fixedStart = modifyTimes(startTime);
        let endTime = startTime + duration;
        let fixedEnd = finalTime(endTime);
        newArray.push(fixedStart, fixedEnd);
    });
    return newArray;
};
//main function:
function conflicts(arr) {

    const meetingRegEx = new RegExp('[0-2][0-9]{3}, [0-5][0-9]');
    let errors = [];
    let l = arr.length - 1;
    for (let a = 0; a <= l; a++) {
        const test = meetingRegEx.test(arr[a]);
        if (test === false) {
            errors.push(arr[a]);
        }
    };
    if (errors.length > 0) {
        return `Errors found: ${errors}`;
    };

    const arrToTest = getStartEnd(arr);
    let endTimes = [];
    let startTimes = [];
    const m = arrToTest.length - 1;
    for (let i = 1; i <= m - 1; i++) {
        if (i % 2) {
            endTimes.push(arrToTest[i]);
        } else {
            startTimes.push(arrToTest[i]);
        }
    };

    let numErrors = 0;
    let times = [];
    let n = (endTimes.length + startTimes.length) / 2;
    for (let i = 0; i <= n; i++) {
        const difference = Number(endTimes[i]) - Number(startTimes[i]);
        if (difference > 0) {
            numErrors++;
            times.push(difference);
        }
    };
    const totalMinutes = reducer(times);

    if (numErrors > 0 && totalMinutes > 0) {
        return `Conflicts Found: ${numErrors} - Total Time: ${totalMinutes} minutes`;
    } else {
        return "All good";
    };
};
const start = Date.now();
conflicts(meetings);
const end = Date.now();
console.log(`Execution time: ${end - start} ms`)
console.log(conflicts(meetings));