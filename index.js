const fs = require('fs');
const dlAPI = require('./src/debridLinkAPI');

const download = require('./src/downloader').download;
const nextLine = require('./src/linkManager').nextLine;
const handleError = require('./src/utils/utils').handleError;
const cleaner = require('./src/cleaner/cleaner').cleaner;
const regexList = require('./src/cleaner/regexList').regexList;

const opt = {};
let login = false;

function loadConf(path) {
  return new Promise((resolve, reject) => {
    const dict = {};
    const linksFile = process.argv.slice(2)[0];

    if (!fs.existsSync(path)) reject('no configuration file');
    if (!linksFile) reject('no link file provided');
    if (!fs.existsSync('./' + linksFile)) reject('wrong path for link file');

    dict['links'] = './' + linksFile;

    for (let line of nextLine(path)) {
      const keyValue = line.split('=');
      const key = keyValue[0];
      const value = keyValue[1];

      dict[key] = value;
    }

    resolve(dict);
  });
}

async function main() {
  const cl = new cleaner();
  regexList
    .forEach(item => cl.registerExpression(item[0], item[1]));

  const conf = await loadConf('./conf.txt');
  conf.cleaner = cl;
  // await dlAPI.login(conf)
  //   .then((data) => {
  //     console.log(data);
  //     login = true;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     login = false;
  //   });
  // if (login) {
  //   await dlAPI.infoAccount();
  // }
  download(conf)
    .catch(handleError);
}

main()
  .catch(handleError);