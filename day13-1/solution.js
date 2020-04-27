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

  let running = true;

  let output;
  let state = [...array];
  let currentIndex;
  let relB;
  let draw = [];
  let screen = {};

  while(running) {
    if (draw.length >= 3) {
      if (!screen[draw[0]]) screen[draw[0]] = {};
      screen[draw[0]][draw[1]] = draw[2];
      draw = [];
    }

    [output, state, currentIndex, relB] = smokeComputer(state, 0, currentIndex, relB);
    draw.push(output);
    if (output[0] === 'HALT') {
      console.log('GOTEM')
      running = false;
    }
  }

  console.log(screen);

  let count = 0;

  for (const x in screen) {
    for (const y in screen[x]) {
      if (screen[x][y] === 2) count++;
    }
  }

  console.log(count);
});

function smokeComputer(data, input, currentPosition = 0, relB = 0) {
  let step;
  let currentInput = input[0];
  let relativeBase = relB;

  for (let i = currentPosition; i < data.length; i += step) {
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
        console.log(data[i]);
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
      console.log('S::OUT=>', arguments[0]);
      return [arguments[0], data, i += 2, relativeBase];
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
      let ret = new Array(['HALT', 'HALT', 'HALT', 'HALT']);
      console.log(ret);
      return ret;
    }
  }
}