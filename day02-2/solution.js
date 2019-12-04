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
  let original = [...array];

  let result = 0;
  let noun = 0;
  let verb = 0;

  while (result !== 19690720) {
    array = [...original];

    while (noun < 100 && result !== 19690720) {
      verb = 0;
      while (verb < 100 && result !== 19690720) {
        array[1] = noun;
        array[2] = verb;

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
        result = array[0];
        if (result === 19690720) console.log(noun, verb);
        array = [...original];
        verb++;
      }
      noun++;
    }
  }
});

// 1 ADDS
// Three integers immediteyl ater tell you the three positions.
// Read from first two positions and write to the third.

// 2 is 1 but MULTIPLIES

// After each op code step ahead 4 positions.