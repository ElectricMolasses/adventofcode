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

  array[0] = 2;

  let running = true;

  let output;
  let state = [...array];
  let currentIndex;
  let relB;
  let draw = [];
  let screen = {};
  let stick = 1;
  let score = 0;
  let paddle;
  let ball = [];
  let bpos = [];

  while(running) {
    if (draw.length >= 3) {
      if (draw[0] === -1 && draw[1] === 0) {
        score = draw[2];
      } else {
        if (draw[2] === 4) bpos.push([draw[0], draw[1]]);
        if (!screen[draw[0]]) screen[draw[0]] = {};
        screen[draw[0]][draw[1]] = draw[2];
        draw = [];
      }
    }

    ball = findBall(screen);
    paddle = findPaddles(screen);

    console.log('Paddle', paddle);
    console.log('BALL', ball);

    stick = 0;
    if (Number(paddle[1]) < Number(ball[1])) stick = 1;
    if (Number(paddle[1]) > Number(ball[1])) stick = -1;
    console.log('STICK', stick);

    [output, state, currentIndex, relB] = smokeComputer(state, [stick], currentIndex, relB);
    draw.push(output);

    if (output === 'HALT') {
      running = false;
    }
  }

  console.log(score);
  console.log(highs(screen));

  console.log(bpos);
});

function actualDrawScreen(screen) {
  fs.open('output.txt', 'w', (err) => {
    if (err) throw err;
    console.log('saved');
  });

  for (const x in screen) {
    for (const y in screen) {
      fs.appendFileSync('output.txt', screen[x][y], (err) => {
        if (err) throw err;
        console.log('BAM');
      });
    }
    fs.appendFileSync('output.txt', '\n', (err) => {
      if (err) throw err;
    })
  }
}

function drawScreen(data) {
  let screen = [];
  for (const x in data) screen.push([]);

  for (const x in data) {
    for (const y in data) {
      screen[x][y] = data[x][y];
    }
  }

  console.log(screen);
}

function highs(data) {
  let hx = 0;
  let hy = 0;
  for (const x in data) {
    for (const y in data[x]) {
      if (Number(x) > hx) hx = Number(x);
      if (Number(y) > hy) hy = Number(y);
    }
  }
  return [hx, hy];
}

function findBall(data) {
  for (const x in data) {
    for (const y in data) {
      if (data[x][y] === 4) {
        return [x, y];
      }
    }
  }

  return [0, 0];
}

function findPaddles(data) {
  let paddles = [];
  for (const x in data) {
    for (const y in data) {
      if (data[x][y] === 3) {
        return [x, y];
      }
    }
  }

  return paddles;
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
      console.log('ACCEPTING INPUT', currentInput);
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
      let ret = new Array('HALT', 'HALT', 'HALT', 'HALT');
      return ret;
    }
  }
}