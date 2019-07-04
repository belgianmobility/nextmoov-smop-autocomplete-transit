
const geolib = require('geolib');

const { getElasticResults } = require('../lib/autocompleteElastic');


async function post_station(info) {
    const postData = await info.readRequestData();
    const { text } = postData;

    const allResults = await getElasticResults(text);

    if (typeof postData.position !== 'undefined') {
        if (typeof postData.distanceWeighting === 'undefined') {
            postData.distanceWeighting = 10;
        }

        const { position, distanceWeighting } = postData;

        for (const result of allResults.hits) {
            const geo = result._source.geo[0];

            result._source.distance = geolib.getDistance(
                { latitude: position[0], longitude: position[1] },
                { latitude: geo.lat, longitude: geo.lon },
            );

            result._source.distanceScore = result._score + ((allResults.max_score * (distanceWeighting / 100)) * (1000 / result._source.distance));
        }
    }

    if (typeof postData.position !== 'undefined') {
        allResults.hits.sort((a, b) => b._source.distanceScore - a._source.distanceScore);
    }

    return allResults.hits;
}


module.exports = {
    post_station,
};
