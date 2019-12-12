var fs = require('fs');

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./args')
});

let input;
lineReader.on('line', (line) => {
  input = (String(line));
});

lineReader.on('close', () => {
  let array = input.split("").map(item => Number(item));

  let split = splitToLayers(array, 25, 6);
  
  const image = [];
  for (let i = 0; i < (25 * 6); i++) {
    let complete = false;

    for (let j = 0; j < split.length; j++) {
      if (split[j][i] !== 2) {
        image.push(split[j][i]);
        j = split.length;
      }
    }
    
  }

  console.log(image);
  fs.writeFile('image.txt', image, (err) => {
    if (err) throw err;
    console.log('Complete');
  });
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