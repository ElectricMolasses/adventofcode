const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

let input;
lineReader.on('line', (line) => {
  input = (String(line));
});

lineReader.on('close', () => {
  let array = [];
  input.split(',').forEach((item)=>array.push(BigInt(item)));

  let phases = [0, 1, 2, 3, 4];
  let possibilities = possiblePermutations(phases);

  let best = 0;
  for (const attempt of possibilities) {
    let inputs = [BigInt(0), BigInt(0)];
    for (const setting of attempt) {
      inputs[0] = BigInt(setting);
      inputs[1] = BigInt(smokeComputer([...array], inputs));
    }
    if (inputs[1] > best) best = inputs[1];
  }

  console.log(best);
});

function smokeComputer(data, input) {
  let step;
  let currentInput = input[0];
  let relativeBase = 0;

  let stepLookup = {
    1: 4,
    2: 4,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 4,
    8: 4,
    9: () => {throw new Error()},
    99: 2,
  };

  for (let i = 0; i < data.length; i += step) {
    let opCode = data[i] % 100;

    let modePrep = Math.floor(data[i] / 100);
    let mode = [
      modePrep % 10,
      Math.floor(modePrep / 10) % 10,
      Math.floor(modePrep / 100) % 10
    ];  
    let parameters = [];

    for (let k = 1; k <= stepLookup[opCode]; k++) {
      parameters.push(data[i + k]);
    }

    let arguments = [];

    for (let j = 0; j < parameters.length; j++) {
      if (mode[j] === 1) {
        if (j === 3 && opCode <= 3) {
          arguments.push(data[parameters[j]]);
        } else {
          arguments.push(parameters[j]);
        }
      } else if (mode[j] === 0) {
        arguments.push(data[parameters[j]]);
      } else {
        //return console.log('FAILURE IN MODE PARSING');
      }
    }
    let offset = 0;
    if (opCode === 1) {
      if (mode[2] === 2) {
        offset = relativeBase;
      }
      data[parameters[2] + offset] = arguments[0] + arguments[1];
      step = 4;
    }
    if (opCode === 2) {
      if (mode[2] === 2) {
        offset = relativeBase;
      }
      data[parameters[2] + offset] = arguments[0] * arguments[1];
      step = 4;
    }
    if (opCode === 3) {
      if (mode[2] === 2) {
        offset = relativeBase;
      }
      data[parameters[0] + offset] = currentInput;
      currentInput = input[1];
      step = 2;
    }
    if (opCode === 4) {
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
        data[arguments[2]] = 1;
      } else {
        data[arguments[2]] = 0;
      }
      step = 4;
    }
    if (opCode === 8) {
      if(arguments[0] === arguments[1]) {
        data[arguments[2]] = 1;
      } else {
        data[arguments[2]] = 0;
      }
      step = 4;
    }
    if (opCode === 99) {
      console.log('HALT');
      return;
    }
  }
}

function possiblePermutations(array) {
  const results = [];

  for (let i = 0; i < array.length; i++) {
    let rest = possiblePermutations(
      array.slice(0, i).concat(array.slice(i + 1))
    );

    if (!rest.length) {
      results.push(BigInt([array[i]]));
    } else {
      for (let j = 0; j < rest.length; j++) {
        results.push[BigInt(array[i])].concat(BigInt(rest[j]));
      }
    }
  }
  return results;
}