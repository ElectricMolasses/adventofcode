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

  smokeComputer(array);
  
  console.log(array[0]);
});

function smokeComputer(data) {
  let step = 4;

  for (let i = 0; i < data.length; i += step) {
    let opCode = data[i] % 100;
    


    let parameters = [
      data[i + 1],
      data[i + 2],
      data[i + 3]
    ];

    let arguments = [
      data[parameters[0]],
      data[parameters[1]],
      data[parameters[2]]
    ];

    if (opCode === 1) {
      data[parameters[2]] = arguments[1] + arguments[2];
    }
    if (opCode === 2) {
      data[parameters[2]] = arguments[1] * arguments[2];
    }
    if (opCode === 99) {
      console.log('HALT');
      return;
    }
  }
}