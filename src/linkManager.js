const fs = require('fs');
const path = require('path');

function* nextLink(file) {
  for (let link of nextLine(file)) {
    //TODO: debrid link
    yield link;
  }
}

function* nextLine(file) {
  const data = fs.readFileSync(file, 'utf-8');

  for (let line of data.split('\n')) {
    yield line;
  }
}

function setOutput(outputPath) {
  return function(name) {
    return path.join(outputPath, name);
  }
}

function debridLink(link) {
  return new Promise((resolve, reject) => {
    resolve(link);
  });
}

module.exports = {
  nextLine,
  nextLink,
  debridLink,
  setOutput,
}