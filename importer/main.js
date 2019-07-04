
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const extract = require('extract-zip');
const csvParse = require('csv-parse');

const logger = require('./lib/logger');
const { getClient, waitElastic } = require('./lib/elasticStation');

const CONFIG = require('./config');


function loadAllTranslations(srcDir) {
  return new Promise((resolve, reject) => {
    const srcFilePath = path.join(srcDir, 'translations.txt');
    const translationTree = {};

    if (!fs.existsSync(srcFilePath)) {
      logger.info('Missing [translations.txt].');
      resolve(translationTree);
      return;
    }

    const srcStream = fs.createReadStream(srcFilePath);

    srcStream
      .pipe(csvParse({ columns: true }))
      .on('data', (obj) => {
        if (!translationTree[obj.trans_id]) {
          translationTree[obj.trans_id] = {};
        }

        translationTree[obj.trans_id][obj.lang] = obj.translation;
      })
      .on('finish', () => { resolve(translationTree); })
      .on('error', reject);
  });
}

/* eslint-disable no-param-reassign */
function addMissingLang(multiLang, defaultText) {
  if (typeof (multiLang.fr) === 'undefined') {
    multiLang.fr = defaultText;
  }

  if (typeof (multiLang.nl) === 'undefined') {
    multiLang.nl = defaultText;
  }

  if (typeof (multiLang.de) === 'undefined') {
    multiLang.de = defaultText;
  }

  if (typeof (multiLang.en) === 'undefined') {
    multiLang.en = defaultText;
  }
}

function getMultiLang(translationTree, stopName) {
  let multiLang;
  let elasticText;

  if (stopName in translationTree) {
    multiLang = Object.assign({}, translationTree[stopName]);

    // Optimize multilang text to avoid word duplication.
    const tmp = Object.values(multiLang)
      .join(' ')
      .replace(/[-/.()]/g, ' ')
      .replace(/  +/g, ' ')
      .trim()
      .split(' ')
      .reduce((previousValue, currentValue) => ({
        ...previousValue,
        [currentValue]: true,
      }), {});

    elasticText = Object.keys(tmp).join(' ');

    addMissingLang(multiLang, stopName);
  } else {
    elasticText = stopName;

    multiLang = {};
    addMissingLang(multiLang, stopName);
  }

  return { elasticText, multiLang };
}

function loadAllStops(srcDir, translationTree, agencyKey) {
  return new Promise((resolve, reject) => {
    const srcFilePath = path.join(srcDir, 'stops.txt');
    const allStops = {};
    let allStopsCount = 0;

    if (!fs.existsSync(srcFilePath)) {
      logger.info('Missing [stops.txt].');
      resolve(allStops);
      return;
    }

    const srcStream = fs.createReadStream(srcFilePath);

    srcStream
      .pipe(csvParse({ columns: true }))
      .on('data', (obj) => {
        if (obj.stop_name in allStops === false) {
          const { elasticText, multiLang } = getMultiLang(translationTree, obj.stop_name);

          allStops[obj.stop_name] = {
            agencyId: agencyKey,
            text: elasticText,
            gtfs_name: obj.stop_name,
            multiLang,
            id: [],
            geo: [],
          };

          allStopsCount += 1;
        }

        allStops[obj.stop_name].id.push(obj.stop_id.trim());
        allStops[obj.stop_name].geo.push({
          lat: parseFloat(obj.stop_lat),
          lon: parseFloat(obj.stop_lon),
        });
      })
      .on('finish', () => { resolve({ allStopsCount, allStops }); })
      .on('error', reject);
  });
}

async function storeInElastic(allStopsCount, allStops) {
  const elastic = await getClient(CONFIG.elasticConnection);
  let bulkOpsDone = 0;

  const elasticInsertBulk = async (ops) => {
    try {
      await elastic.bulk({
        body: ops,
      });

      bulkOpsDone += ops.length / 2;
      process.stdout.write(`\r\x1b[2KInserting... ${((bulkOpsDone / allStopsCount) * 100).toFixed(0)} % `);
    } catch (e) {
      console.log('ES error :', e);
    }
  };

  const startTime = new Date().getTime();

  const chunks = (arr, size) => Array.from(
    { length: Math.ceil(arr.length / size) },
    (v, i) => arr.slice(i * size, i * size + size),
  );

  for (const chunk of chunks(Object.values(allStops), 1000)) {
    const bulkOps = [];
    for (const stop of chunk) {
      bulkOps.push(
        { index: { _index: 'station', _type: 'location', _id: stop.gtfs_name } },
        stop,
      );
    }

    await elasticInsertBulk(bulkOps);
  }

  const endTime = new Date().getTime();

  process.stdout.write('\r');
  logger.info(`Inserted ${bulkOpsDone} in ${((endTime - startTime) / 1000).toFixed(3)} s.`);
}

async function main() {
  const regexGtfsFile = /^(?<agencyKey>.+)-gtfs.zip$/;

  const agencies = fs
    .readdirSync(CONFIG.tmpDir, { withFileTypes: true })
    .reduce((res, item) => {
      if (item.isFile()) {
        const reRes = regexGtfsFile.exec(item.name);

        if (reRes) {
          res.push(reRes.groups.agencyKey);
        }
      }

      return res;
    }, []);

  await waitElastic(CONFIG.elasticConnection);

  for (const agency of agencies) {
    logger.info(`----- ${agency}`);
    const tmpFile = path.join(CONFIG.tmpDir, `${agency}-gtfs.zip`);
    const tmpGtfsDirSrc = path.resolve(path.join(CONFIG.tmpDir, `${agency}-src`));


    logger.info('Unzipping...');
    rimraf.sync(tmpGtfsDirSrc);
    mkdirp(tmpGtfsDirSrc);

    await promisify(extract)(tmpFile, { dir: tmpGtfsDirSrc });


    logger.info('Treat files...');
    const translationTree = await loadAllTranslations(tmpGtfsDirSrc);
    const { allStopsCount, allStops } = await loadAllStops(tmpGtfsDirSrc, translationTree, agency);

    logger.info('Indexing stops in ElasticSearch...');
    await storeInElastic(allStopsCount, allStops);
  }
}

main().catch((err) => {
  logger.error('MAIN ERROR ', err);
  process.exit(1);
});
