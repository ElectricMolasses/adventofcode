const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

let input;
lineReader.on('line', (line) => {
  input = (String(line));
});

lineReader.on('close', () => {
  let array = [];
  input.split(',').forEach((item)=>array.push(Number(item)));
  array[1] = 12;
  array[2] = 2;

  for (let i = 0; i < array.length; i += 4) {
    // Solution
    if (array[i] === 1) {
      let a = array[array[i+1]];
      let b = array[array[i+2]];
      array[array[i+3]] = a + b;
    } else if (array[i] === 2) {
      let a = array[array[i+1]];
      let b = array[array[i+2]];
      array[array[i+3]] = a * b;
    }
  }
  console.log(array);
  console.log(array[0]);
});

// 1 ADDS
// Three integers immediteyl ater tell you the three positions.
// Read from first two positions and write to the third.

// 2 is 1 but MULTIPLIES

// After each op code step ahead 4 positions.