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

  smokeComputer(array, [1]);
  
  console.log(array[0]);
});

function smokeComputer(data, input) {
  let step;

  for (let i = 0; i < data.length; i += step) {
    let opCode = data[i] % 100;

    let modePrep = Math.floor(data[i] / 100);
    let mode = [
      modePrep % 10,
      Math.floor(modePrep / 10) % 10,
      Math.floor(modePrep / 100) % 10
    ];  


    let parameters = [
      data[i + 1],
      data[i + 2],
      data[i + 3]
    ];

    let arguments = [];

    for (let i = 0; i < parameters.length; i++) {
      if (mode[i] === 1) {
        arguments.push(parameters[i]);
      } else if (mode[i] === 0) {
        arguments.push(data[parameters[i]]);
      } else {
        return console.log('FAILURE IN MODE PARSING');
      }
    }

    if (opCode === 1) {
      data[parameters[2]] = arguments[0] + arguments[1];
      step = 4;
    }
    if (opCode === 2) {
      data[parameters[2]] = arguments[0] * arguments[1];
      step = 4;
    }
    if (opCode === 3) {
      data[parameters[0]] = input[0];
      step = 2;
    }
    if (opCode === 4) {
      console.log('S::OUT=>', arguments[0]);
      step = 2;
    }
    if (opCode === 99) {
      console.log('HALT');
      return;
    }
  }
}