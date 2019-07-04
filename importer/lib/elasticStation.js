
const http = require('http');
const elasticsearch = require('elasticsearch');


async function getClient(elasticHost) {
  const elasticClient = new elasticsearch.Client({
    host: elasticHost,
    log: 'error',
  });

  // ----- Check if index exists.
  const exists = await elasticClient.indices.exists({
    index: 'station',
  });

  if (!exists) {
    console.log('Create elastic index.');

    await elasticClient.indices.create({
      index: 'station',
      body: {
        settings: {
          number_of_shards: 1,
          analysis: {
            filter: {
              autocomplete_filter: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 20,
              },
            },
            analyzer: {
              autocomplete: {
                type: 'custom',
                tokenizer: 'standard',
                filter: [
                  'lowercase',
                  'autocomplete_filter',
                ],
              },
              autocomplete_folded: {
                type: 'custom',
                tokenizer: 'standard',
                filter: [
                  'lowercase',
                  'asciifolding',
                  'autocomplete_filter',
                ],
              },
              folded: {
                type: 'custom',
                tokenizer: 'standard',
                filter: [
                  'lowercase',
                  'asciifolding',
                ],
              },
            },
          },
        },
      },
    });

    await elasticClient.indices.putMapping({
      index: 'station',
      type: 'location',
      body: {
        properties: {
          text: {
            type: 'text',
            analyzer: 'autocomplete',
            search_analyzer: 'standard',
            fields: {
              folded: {
                type: 'text',
                analyzer: 'autocomplete_folded',
                search_analyzer: 'folded',
              },
            },
          },
        },
      },
    });
  }

  return elasticClient;
}


function connectElastic(elasticHost, resolve) {
  const req = http.request(`http://${elasticHost}`, { method: 'HEAD' }, (res) => {
    resolve();
  });

  req.on('error', (e) => {
    console.log('Elastic down, waiting...');
    setTimeout(connectElastic.bind(null, elasticHost, resolve), 5000);
  });

  req.end();
}

function waitElastic(elasticHost) {
  return new Promise((resolve, reject) => {
    connectElastic(elasticHost, resolve);
  });
}

module.exports = {
  waitElastic,
  getClient,
};
