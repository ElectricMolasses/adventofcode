const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./day1a.args')
});

const array = [];
lineReader.on('line', (line) => {
  array.push(Number(line));
});

lineReader.on('close', () => {
  let result = 0;

  for (const value of array) {
    console.log(value);
    result += (Math.floor(value / 3) - 2);
  }

  console.log(result);
});