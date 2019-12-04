const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

const array = [];
lineReader.on('line', (line) => {
  array.push(Number(line));
});

lineReader.on('close', () => {
  let result = 0;

  for (const value of array) {
    // Solution
    let current = value;
    while (current >= 0) {
      current = (Math.floor(current / 3) - 2);
      if (current >= 0) {
        result += current;
      }
    }
    
  }

  console.log(result);
});