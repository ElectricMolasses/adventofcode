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

  let phases = [5, 6, 7, 8, 9];
  let possibilities = possiblePermutations(phases);



  let best = 0;

  for (const attempt of possibilities) {
    let dataState = [
      [...array],
      [...array],
      [...array],
      [...array],
      [...array]
    ];
    let indexState = [0, 0, 0, 0, 0];
    let inputs = [0, 0];
    let lastSet = [];
    let isDone = false;

    for (let i = 0; i < attempt.length; i++) {
      inputs[0] = attempt[i];
      lastSet = [inputs[1], dataState[i], indexState[i]];
      [inputs[1], dataState[i], indexState[i]] = smokeComputer(dataState[i], inputs, indexState[i]);
      if (indexState[i] === 'COMPLETE') {
        console.log('REACHED COMPLETION');
        isDone = true;
      }
    }

    while (!isDone) {
      for (let i = 0; i < attempt.length; i++) {
        lastSet = [inputs[1], dataState[i], indexState[i]];
        [inputs[1], dataState[i], indexState[i]] = smokeComputer(dataState[i], [inputs[1]], indexState[i]);
        if (indexState[i] === 'COMPLETE') {
          console.log('REACHED COMPLETION');
          i = Infinity;
          isDone = true;
        }
      }
    }
    console.log(inputs[1]);
    if (lastSet[0] > best) {
      console.log('Overwrite best');
      best = lastSet[0];
    }
  }

  console.log(best);
});

function smokeComputer(data, input, startIndex) {
  let step;
  let currentInput = 0;

  for (let i = startIndex; i < data.length; i += step) {
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
      if (mode[j] === 1) {
        arguments.push(parameters[j]);
      } else if (mode[j] === 0) {
        arguments.push(data[parameters[j]]);
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
      data[parameters[0]] = input[currentInput];
      if (currentInput < input.length - 1) {
        currentInput++;
      }
      step = 2;
    }
    if (opCode === 4) {
      console.log('S::OUT=>', arguments[0]);
      return [arguments[0], data, i + 2];
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
    if (opCode === 99) {
      console.log('HALT');
      return ['COMPLETE', 'COMPLETE', 'COMPLETE'];
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
      results.push([array[i]]);
    } else {
      for (let j = 0; j < rest.length; j++) {
        results.push([array[i]].concat(rest[j]));
      }
    }
  }
  return results;
}