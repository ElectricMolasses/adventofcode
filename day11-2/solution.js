const fs = require('fs');

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

  let data = goRobot(array);
  let map = finnagleMap(data);
});

function goRobot(data) {
  const facings = {
    'U': {
      0: 'L',
      1: 'R'
    },
    'R': {
      0: 'U',
      1: 'D'
    },
    'D': {
      0: 'R',
      1: 'L'
    },
    'L': {
      0: 'D',
      1: 'U'
    }
  }
  const memory = {};
  const hasPainted = new Set();
  let x = 0;
  let y = 0;
  let facing = 'U';

  let argument = 0;
  let currentIndex = 0;
  let relB = 0;

  memory[x] = {};
  memory[x][y] = 1;
  
  while (true) {
    if (memory[x] === undefined) memory[x] = {};
    if (memory[x][y] === undefined) memory[x][y] = 0;

    [argument, data, currentIndex, relB] = smokeComputer(data, [memory[x][y]], currentIndex, relB);
    if (argument === 'HALT') break;

    memory[x][y] = argument;
    hasPainted.add(x * 10000 + y);

    [argument, data, currentIndex, relB] = smokeComputer(data, [memory[x][y]], currentIndex, relB);
    if (argument === 'HALT') break;

    facing = facings[facing][argument];

    if (facing === 'U') y++;
    if (facing === 'D') y--;
    if (facing === 'R') x++;
    if (facing === 'L') x--;
  }
  return memory;
}

function finnagleMap(data) {
  let lowest = Number(findLowest(data));
  let highest = Number(findHighest(data));
  let difference = highest - lowest;
  let map = [];
  console.log(highest, lowest, difference);
  for (let i = 0; i <= highest; i++) {
    map.push([]);
  }

  for (const a in data) {
    for (const b in data[a]) {
      console.log(a, b);
      map[Number(a)][Math.abs(Number(b))] = data[a][b];
    }
  }
  
  fs.open('output.txt', 'w', (err) => {
    if (err) throw err;
    console.log('saved');
  });

  for (const row of map) {
    fs.appendFileSync('output.txt', row + '\n', (err) => {
      if (err) throw err;
      console.log('BAM');
    })
  }

  console.log(data);


  return map;
}

function findHighest(data) {
  let highest = -Infinity;

  for (const a in data) {
    if (Number(a) > highest) highest = Number(a);
    for (const b in data[a]) {
      if (Number(b) > highest) highest = Number(b);
    }
  }

  return highest;
}

function findLowest(data) {
  let lowest = Infinity;

  for (const a in data) {
    if (Number(a) < lowest) lowest = Number(a);
    for (const b in data[a]) {
      if (Number(b) < lowest) lowest = Number(b);
    }
  }

  return lowest;
}

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
      return ['HALT', 'HALT', 'HALT'];
    }
  }
}