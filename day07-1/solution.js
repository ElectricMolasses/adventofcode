const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

// Read Separate Lines
let array = [];
lineReader.on('line', (line) => {
  array.push((line));
});

lineReader.on('close', () => {;
  array = array[0].split(',');
  array = array.map(value => Number(value));


  let possibilities = possiblePermutations([0, 1, 2, 3, 4]);
  let best = 0;

  for (const possibility of possibilities) {
    let output = 0;
    
    for (const choice of possibility) {
      output = smokeComputer([...array], [choice, output]);
      console.log(output);
    }
    if (output > best) {
      best = output;
    }
  }
  console.log(best);

  best = 0;

  let output = 0;
  possibility = [1, 0, 4, 3, 2];
  console.log(output);
  console.log(possibility);
  for (const choice of possibility) {
    output = smokeComputer([
      3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
    ], [choice, output]);
    console.log(output);
  }
  if (output > best) {
    best = output;
  }
  console.log(best);
});

function smokeComputer(array, phaseSetting) {

  let errorStack = [];

  input = phaseSetting[0];

  let numInstructions = 4;
  for (let i = 0; i < array.length; i += numInstructions) {
    let current = i;
    // Solution
    let opCode = array[i] % 100;
    let prep = Math.floor(array[i] / 100);

    let modes = [prep % 10, 
      Math.floor(prep / 10),
      Math.floor(prep / 100)];
    modes[1] = modes[1] - (modes[2] * 10);

    let parameters = [
      array[i + 1],
      array[i + 2],
      array[i + 3]
    ];
    let arguments = [];

    if (opCode <= 2) numInstructions = 4;
    else numInstructions = 2;

    // Save parameter value to arguments in immediate,
    // or value at parameter address in positional.
    for (let i = 0; i < numInstructions - 1; i++) {
      if (modes[i] === 1) {
        arguments.push(parameters[i]);
      } else if (modes[i] === 0) {
        arguments.push(array[parameters[i]]);
      }
    }
      // Add first 2 params and write to third
    if (opCode === 1) {
      array[parameters[2]] = arguments[0] + arguments[1];
      // Multiply first 2 params and write to third
    } else if (opCode === 2) {
      array[parameters[2]] = arguments[0] * arguments[1];
      // Save input to single param
    } else if (opCode === 3) { 
      array[parameters[0]] = input;
      input = phaseSetting[1];
      // Outputs the value of its only parameter
    } else if (opCode === 4) {
      return arguments[0];
      console.log('==========');
      console.log(current);
      console.log(arguments[0]);
      console.log('==========');
      if (arguments[0] === 0) {
        console.log(errorStack);
        errorStack = [];
      }
      else {
        console.log(errorStack);
        return;
      }
      // Halt the program immediately
    } else if (opCode === 99) {
      return arguments[0];
      console.log(errorStack);
      console.log(current);
    }

    errorStack.push({
      opCode, prep, modes, parameters, arguments, output: array[parameters[2]]
    });
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