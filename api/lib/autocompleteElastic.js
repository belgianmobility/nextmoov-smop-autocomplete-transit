
const elasticsearch = require('elasticsearch');

const CONFIG = require('../config');

async function elasticSearch(elastic, index, text) {
    return elastic.search({
        index,
        body: {
            size: 10,
            query: {
                multi_match: {
                    type: 'most_fields',
                    query: text,
                    fields: ['text', 'text.folded'],
                },
            },
        },
    });
}

async function getElasticResults(text) {
    const elastic = new elasticsearch.Client({
        host: CONFIG.elasticConnection,
        log: 'error',
    });

    const searchResult = await elasticSearch(elastic, 'station', text);
    return searchResult.hits;
}

module.exports = {
    getElasticResults,
};
