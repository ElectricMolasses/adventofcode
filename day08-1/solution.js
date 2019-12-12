const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

let input;
lineReader.on('line', (line) => {
  input = (String(line));
});

lineReader.on('close', () => {
  let array = input.split("").map(item => Number(item));
  console.log(array);

  let split = splitToLayers(array, 25, 6);
  let best = Infinity;
  let bestIndex;
  for (let i = 0; i < split.length; i++) {
    let current = countNum(split[i], 0);
    if (best > current) {
      best = current;
      bestIndex = i;
    }
  }
  console.log(bestIndex);
  console.log(countNum(split[bestIndex], 1)
    * countNum(split[bestIndex], 2))
});

function splitToLayers(data, width, height) {
  let limit = width * height;

  let current = [];
  let final = [];
  for (let i = 0; i < data.length; i++) {
    current.push(data[i]);
    if ((i + 1) % limit === 0) {
      final.push(current);
      current = [];
    }
  }

  return final;
}

function countNum(data, num) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === num) {
      count++;
    }
  }
  return count;
}