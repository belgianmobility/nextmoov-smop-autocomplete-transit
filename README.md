[< Back to general](https://github.com/nextmoov/nextmoov-smop-general)

# SMOP - Autocomplete - Transit

## Modules

You need to provide the static GTFS files (See [General > launching-the-modules](https://github.com/nextmoov/nextmoov-smop-general/blob/master/README.md#launching-the-modules) for more information).

### ElasticSearch

### Importer

The importer will index all GTFS stops data in ElasticSearch.

### API

After startup the API endpoint will be at http://localhost:8080/autocomplete/station

You can send POST request with the following JSON data :

```JSON
{
    "text": "bruxelles central"
}
```

or with ordering by distance from a specific point :

```JSON
{
    "text": "bruxelles central",
    "position": [50.84549, 4.35769],
    "distanceWeighting": 500
}
```

Example of reply :

```JSON
[
    {
        "_index": "station",
        "_type": "location",
        "_id": "Bruxelles-Central",
        "_score": 39.64377,
        "_source": {
            "agencyId": "sncb",
            "text": "Bruxelles Central Brussel Centraal Brus Brux Centr",
            "gtfs_name": "Bruxelles-Central",
            "multiLang": {
                "fr": "Bruxelles-Central",
                "nl": "Brussel-Centraal",
                "de": "Brus.-/ Brux-Centr.",
                "en": "Brux.-/ Brus-Centr."
            },
            "id": [
                "S8813003",
                "8813003_6",
                "8813003_4",
                "8813003_5",
                "8813003_3",
                "8813003_1",
                "8813003_2",
                "8813003"
            ],
            "geo": [
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                },
                {
                    "lat": 50.84565,
                    "lon": 4.356804
                }
            ],
            "distance": 65,
            "distanceScore": 3089.16453923077
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "Erembodegem Central",
        "_score": 23.933292,
        "_source": {
            "agencyId": "delijn",
            "text": "Erembodegem Central",
            "gtfs_name": "Erembodegem Central",
            "multiLang": {
                "fr": "Erembodegem Central",
                "nl": "Erembodegem Central",
                "de": "Erembodegem Central",
                "en": "Erembodegem Central"
            },
            "id": [
                "14595",
                "14596",
                "124844",
                "130719"
            ],
            "geo": [
                {
                    "lat": 50.91744852353837,
                    "lon": 4.073131803337038
                },
                {
                    "lat": 50.91713472026641,
                    "lon": 4.073460852518727
                },
                {
                    "lat": 50.91714363818988,
                    "lon": 4.073432355029021
                },
                {
                    "lat": 50.91744852353837,
                    "lon": 4.073131803337038
                }
            ],
            "distance": 21567,
            "distanceScore": 33.124132172485744
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "JODOIGNE Pharmacie Centrale",
        "_score": 23.149698,
        "_source": {
            "agencyId": "tec",
            "text": "JODOIGNE Pharmacie Centrale",
            "gtfs_name": "JODOIGNE Pharmacie Centrale",
            "multiLang": {
                "fr": "JODOIGNE Pharmacie Centrale",
                "nl": "JODOIGNE Pharmacie Centrale",
                "de": "JODOIGNE Pharmacie Centrale",
                "en": "JODOIGNE Pharmacie Centrale"
            },
            "id": [
                "Bjodpce1",
                "Bjodpce2"
            ],
            "geo": [
                {
                    "lat": 50.711513,
                    "lon": 4.859018
                },
                {
                    "lat": 50.711016,
                    "lon": 4.858681
                }
            ],
            "distance": 38372,
            "distanceScore": 28.31541388658397
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "QUAREGNON Central",
        "_score": 23.933292,
        "_source": {
            "agencyId": "tec",
            "text": "QUAREGNON Central",
            "gtfs_name": "QUAREGNON Central",
            "multiLang": {
                "fr": "QUAREGNON Central",
                "nl": "QUAREGNON Central",
                "de": "QUAREGNON Central",
                "en": "QUAREGNON Central"
            },
            "id": [
                "H1qu101a",
                "H1qu101b"
            ],
            "geo": [
                {
                    "lat": 50.445295,
                    "lon": 3.868319
                },
                {
                    "lat": 50.445531,
                    "lon": 3.869998
                }
            ],
            "distance": 56391,
            "distanceScore": 27.44837153396819
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "Ruien Centrale",
        "_score": 23.933292,
        "_source": {
            "agencyId": "delijn",
            "text": "Ruien Centrale",
            "gtfs_name": "Ruien Centrale",
            "multiLang": {
                "fr": "Ruien Centrale",
                "nl": "Ruien Centrale",
                "de": "Ruien Centrale",
                "en": "Ruien Centrale"
            },
            "id": [
                "118743",
                "119617"
            ],
            "geo": [
                {
                    "lat": 50.78129218038037,
                    "lon": 3.49457259590307
                },
                {
                    "lat": 50.7813631409303,
                    "lon": 3.49444365364423
                }
            ],
            "distance": 61249,
            "distanceScore": 27.169570959656486
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "PROFONDVAL Centrale",
        "_score": 23.933292,
        "_source": {
            "agencyId": "tec",
            "text": "PROFONDVAL Centrale",
            "gtfs_name": "PROFONDVAL Centrale",
            "multiLang": {
                "fr": "PROFONDVAL Centrale",
                "nl": "PROFONDVAL Centrale",
                "de": "PROFONDVAL Centrale",
                "en": "PROFONDVAL Centrale"
            },
            "id": [
                "Lpocent1",
                "Lpocent2"
            ],
            "geo": [
                {
                    "lat": 50.61547,
                    "lon": 5.464675
                },
                {
                    "lat": 50.61551,
                    "lon": 5.464291
                }
            ],
            "distance": 82238,
            "distanceScore": 26.343599278873516
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "Hendrieken Centrale Begraafplaats",
        "_score": 23.149698,
        "_source": {
            "agencyId": "delijn",
            "text": "Hendrieken Centrale Begraafplaats",
            "gtfs_name": "Hendrieken Centrale Begraafplaats",
            "multiLang": {
                "fr": "Hendrieken Centrale Begraafplaats",
                "nl": "Hendrieken Centrale Begraafplaats",
                "de": "Hendrieken Centrale Begraafplaats",
                "en": "Hendrieken Centrale Begraafplaats"
            },
            "id": [
                "43214"
            ],
            "geo": [
                {
                    "lat": 50.80205724131366,
                    "lon": 5.3324243302184335
                }
            ],
            "distance": 68852,
            "distanceScore": 26.028610014175335
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "Helkijn Cafe Central",
        "_score": 23.149698,
        "_source": {
            "agencyId": "delijn",
            "text": "Helkijn Cafe Central",
            "gtfs_name": "Helkijn Cafe Central",
            "multiLang": {
                "fr": "Helkijn Cafe Central",
                "nl": "Helkijn Cafe Central",
                "de": "Helkijn Cafe Central",
                "en": "Helkijn Cafe Central"
            },
            "id": [
                "37643",
                "41632"
            ],
            "geo": [
                {
                    "lat": 50.744875481963284,
                    "lon": 3.3775679509253647
                },
                {
                    "lat": 50.7448047694249,
                    "lon": 3.377711136568827
                }
            ],
            "distance": 70005,
            "distanceScore": 25.98119360745661
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "Bredene Centrale",
        "_score": 23.933292,
        "_source": {
            "agencyId": "delijn",
            "text": "Bredene Centrale",
            "gtfs_name": "Bredene Centrale",
            "multiLang": {
                "fr": "Bredene Centrale",
                "nl": "Bredene Centrale",
                "de": "Bredene Centrale",
                "en": "Bredene Centrale"
            },
            "id": [
                "123503",
                "123623"
            ],
            "geo": [
                {
                    "lat": 51.22170800551021,
                    "lon": 2.953192989023209
                },
                {
                    "lat": 51.22213952217895,
                    "lon": 2.9516910018414544
                }
            ],
            "distance": 107041,
            "distanceScore": 25.785095047430424
        }
    },
    {
        "_index": "station",
        "_type": "location",
        "_id": "Verviers-Central",
        "_score": 23.149698,
        "_source": {
            "agencyId": "sncb",
            "text": "Verviers Central Centraal",
            "gtfs_name": "Verviers-Central",
            "multiLang": {
                "fr": "Verviers-Central",
                "nl": "Verviers-Centraal",
                "de": "Verviers-Centraal / Verviers-Central",
                "en": "Verviers-Central / Verviers-Centraal"
            },
            "id": [
                "S8844008",
                "8844008_4",
                "8844008_3",
                "8844008_2",
                "8844008_1",
                "8844008_5",
                "8844008"
            ],
            "geo": [
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                },
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                },
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                },
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                },
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                },
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                },
                {
                    "lat": 50.58814,
                    "lon": 5.854913
                }
            ],
            "distance": 109545,
            "distanceScore": 24.959172188689582
        }
    }
]
```
