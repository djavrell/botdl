const debridLink = require('./linkManager').debridLink;
const nextLink = require('./linkManager').nextLink;
const out = require('./linkManager').setOutput;
const handleError = require('./utils/utils').handleError;

const wget = require('wget-improved');
const status = require('node-status');

function downloader(cleaner, dest) {
  return async function(link) {

    const DLink = await debridLink(link);
    const fileName = cleaner.getName(DLink);
    const setOutput = out(dest);

    return new Promise((resolve, reject) => {
      const dl = wget.download(DLink, setOutput(fileName), {});

      let bar = status.addItem('bar');
      let previous = 0;
      
      dl.on('start', (fileSize) => {
        status.start({
          pattern: `${fileName} {uptime.green} | {spinner.line.cyan} | {bar.count}`,
          max: fileSize
        });
      });

      dl.on('progress', (progress) => {
        bar.inc(progress - previous);
        previous = progress;
      });

      dl.on('end', () => {
        status.stop();
        resolve(`${fileName} finish`)
      });

      dl.on('error', (err) => console.log(err));
    });
  }  
}

async function download(conf) {
  const downloadLink = downloader(conf.cleaner, conf.dest);

  for (let link of nextLink(conf.links)) {
    await downloadLink(link)
      .then((item) => console.log(`'${item}'`))
      .catch(handleError);
  }
}

module.exports = {
  // downloadLink,
  download,
}