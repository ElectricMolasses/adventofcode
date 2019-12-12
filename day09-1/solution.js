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
  for (let i = 0; i < 1000000; i++) {
    array.push(BigInt(0));
  }
  let testArray = [1102,34915192,34915192,7,4,7,99,0];
  for (let i = 0; i < 10000000; i++) {
    testArray.push(0);
  }
  testArray = testArray.map(item => BigInt(item));
  console.log(
    smokeComputer(array, [1])
  );
});

function smokeComputer(data, input, startIndex = 0) {
  let step = BigInt(0);
  let currentInput = 0;
  let relativeBase = BigInt(0);

  let stepLookup = {
    1: 4,
    2: 4,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 4,
    8: 4,
    9: 2,
    99: 2
  }
  
  for (let i = BigInt(startIndex); i < data.length; i += step) {
    let opCode = Number(data[i]) % 100;

    let modePrep = Math.floor(Number(data[i]) / 100);
    let mode = [
      modePrep % 10,
      Math.floor(modePrep / 10) % 10,
      Math.floor(modePrep / 100) % 10
    ];

    let parameters = [];
    for (let k = BigInt(1); k <= stepLookup[opCode] - 1; k++) {
      parameters.push(data[i + k]);
    }

    let arguments = [];

    for (let j = 0; j < parameters.length; j++) {
      if (mode[j] === 1) {
        arguments.push(BigInt(parameters[j]));
      } else if (mode[j] === 0) {
        if (!data[BigInt(parameters[j])]) {
          arguments.push(0);
        } else {
          arguments.push(BigInt(data[parameters[j]]));
        }
      } else if (mode[j] === 2) {
        if (!data[BigInt(parameters[j]) + relativeBase]) {
          arguments.push(0);
        } else {
          arguments.push(BigInt(data[BigInt(parameters[j]) + relativeBase]));
        }
      } else if (j !== 3) {
        console.log('=================');
        console.log('NumArgs', parameters.length);
        console.log('ARGS', arguments);
        console.log('ModeP', modePrep);
        console.log('Modes', mode);
        console.log(`FAILURE IN MODE PARSING:>${i}, [${mode}]`);
        console.log('=================');
        return;
      }
      if (j === (stepLookup[opCode] - 2) && mode[j] === 1) {
        arguments.push(BigInt(data[parameters[j]] || 0));
      }
    }

    
    let offset = BigInt(0);
    if (opCode === 1) {
      if (mode[2] === 2) offset = BigInt(relativeBase);
      data[parameters[2] + offset] = arguments[0] + arguments[1];
      step = BigInt(4);
    }
    if (opCode === 2) {
      if (mode[2] === 2) offset = BigInt(relativeBase);;
      data[parameters[2] + offset] = arguments[0] * arguments[1];
      step = BigInt(4);
    }
    if (opCode === 3) {
      if (mode[0] === 2) offset = BigInt(relativeBase);;
      data[parameters[0] + offset] = BigInt(input[currentInput]);
      if (currentInput < input.length - 1) {
        currentInput++;
      }
      step = BigInt(2);
    }
    if (opCode === 4) {
      console.log('S::OUT=>', i, arguments[0]);
      step = BigInt(2);
    }
    if (opCode === 5) {
      if (arguments[0] !== BigInt(0)) {
        i = arguments[1];
        step = BigInt(0);
      } else {
        step = BigInt(3);
      }
    }
    if (opCode === 6) {
      if (arguments[0] === BigInt(0)) {
        i = arguments[1];
        step = BigInt(0);
      } else {
        step = BigInt(3);
      }
    }
    if (opCode === 7) {
      if(arguments[0] < arguments[1]) {
        data[arguments[2]] = BigInt(1);
      } else {
        data[arguments[2]] = BigInt(0);
      }
      step = BigInt(4);
    }
    if (opCode === 8) {
      if(arguments[0] === arguments[1]) {
        data[arguments[2]] = 1;
      } else {
        data[arguments[2]] = 0;
      }
      step = BigInt(4);
    }
    if (opCode === 9) {
      relativeBase += arguments[0];
      step = BigInt(2);
    }
    if (opCode === 99) {
      console.log('HALT');
      return arguments;
      return ['COMPLETE', 'COMPLETE', 'COMPLETE'];
    }
  }
}
