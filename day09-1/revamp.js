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
  for (let i = 0; i < 1000000; i++) {
    array.push((0));
  }
  let testArray = [104,1125899906842624,99];
  for (let i = 0; i < 10000000; i++) {
    testArray.push(0);
  }
  testArray = testArray.map(item => (item));
  console.log(
    smokeComputer(array, [2])
  );
});

function smokeComputer(data, input) {
  let step;
  let currentInput = input[0];
  let relativeBase = 0;

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

    for (let j = 0; j < parameters.length; j++) {
      if (mode[j] === 2) {
        arguments.push(data[parameters[j] + relativeBase] || 0);
        parameters[j] += relativeBase;
      } else if (mode[j] === 1) {
        arguments.push(parameters[j] || 0);
      } else if (mode[j] === 0) {
        arguments.push(data[parameters[j]] || 0);
      } else {
        return console.log('FAILURE IN MODE PARSING', mode);
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
      data[parameters[0]] = currentInput;
      step = 2;
    }
    if (opCode === 4) {
      console.log(data);
      console.log('S::OUT=>', arguments[0]);
      return arguments[0];
      step = 2;
    }
    if (opCode === 5) {
      if (arguments[0] !== 0) {
        i = arguments[1];
        step = 0;
      } else {
        step = 3;
      }
    }
    if (opCode === 6) {
      if (arguments[0] === 0) {
        i = arguments[1];
        step = 0;
      } else {
        step = 3;
      }
    }
    if (opCode === 7) {
      if(arguments[0] < arguments[1]) {
        data[parameters[2]] = 1;
      } else {
        data[parameters[2]] = 0;
      }
      step = 4;
    }
    if (opCode === 8) {
      if(arguments[0] === arguments[1]) {
        data[parameters[2]] = 1;
      } else {
        data[parameters[2]] = 0;
      }
      step = 4;
    }
    if (opCode === 9) {
      relativeBase += arguments[0];
      step = 2;
    }
    if (opCode === 99) {
      console.log('HALT');
      return;
    }
  }
}