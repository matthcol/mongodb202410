// filter + projection + sort
db.titles2.aggregate([
    { $match: {primaryTitle: /^star/i, titleType: 'movie', startYear: {$ne: null}}},
    // { $limit: 10}
    { $project: {
        title: "$primaryTitle",
        year: "$startYear",
        director: "$director.name"
    }},
    { $sort: {year: 1, title: 1}}
])

// group by year, count nb films (+ other stats)
db.titles2.aggregate([
    { $match: { titleType: 'movie', startYear: {$ne: null} }},
    { $group: {
        _id: {"year": "$startYear"},
        movieCount: {$count: {}}
    }},
    { $sort: {"_id.year": 1} }
])
// Result:
[
    { _id: { year: 1894 }, movieCount: 1 },
    { _id: { year: 1896 }, movieCount: 1 },
    { _id: { year: 1897 }, movieCount: 2 },
    { _id: { year: 1898 }, movieCount: 7 },
    { _id: { year: 1899 }, movieCount: 8 }
]

// renommage de keys
db.titles2.aggregate([
    { $match: { titleType: 'movie', startYear: {$ne: null} }},
    { $group: {
        _id: {"year": "$startYear"},
        movieCount: {$count: {}}
    }},
    { $project: {
        year: "$_id.year",
        movieCount: 1,
        _id: 0
    }},
    { $sort: {year: 1} }
])
// Result (extrait):
[
    { movieCount: 17356, year: 2015 },
    { movieCount: 18543, year: 2016 },
    { movieCount: 18991, year: 2017 },
    { movieCount: 19236, year: 2018 },
    { movieCount: 19201, year: 2019 },
    { movieCount: 16461, year: 2020 }
]

db.titles2.find({ 
    // titleType: 'movie', // NB: tous les films ont 1 duree
    runtimeMinutes: {$regex: "[^0-9]"}
}).limit(5)

db.titles2.find({ 
    runtimeMinutes: {$regex: "[^0-9]"}
}).count()


// runtimeMinutes null => OK: 257367
db.titles2.find({ 
    titleType: 'movie',
    runtimeMinutes: null
}).count()

// UPDATES: https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators-top-level

// update 1: set null les runtimes en texte
db.titles2.updateMany(
    { runtimeMinutes: {$regex: "[^0-9]"} }, // filter
    { $set: {runtimeMinutes: null}} // update operator
)
// Result: 
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 630,
  modifiedCount: 630,
  upsertedCount: 0
}

db.titles3.updateMany(
    { runtimeMinutes: {$regex: "[^0-9]"} }, // filter
    { $set: {runtimeMinutes: null}} // update operator
)

// update: rename keys
// * genres2 -> genres
// * role -> actors
// * director.imdId -> director.imdbId

// delete: prog adulte

// update 2: convert runtime en int (wait for me)


db.titles3.updateMany(
    {}, // filter
    { $rename: {
        'genres2': 'genres', 
        'role': 'actors', 
    }} // update operator
)

db.titles3.updateMany(
    {director: {$ne: null}}, // filter
    { $rename: {
        'director.imdId': 'director.imdbId'
    }} // update operator
)

// NB: see also: $currentDate, $min, $unset, ...
// https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators-top-level

db.titles3.find({
    isAdult: 1
}).limit(10)

db.titles3.deleteMany({
    isAdult: 1
})
// { acknowledged: true, deletedCount: 358373 }

// NB: use convert if errors can occur (null is not an error)
db.titles3.updateMany(
    {},
    [
        { $set: {runtimeMinutes: {$toInt: "$runtimeMinutes"}}}
    ]
)
//
{
    acknowledged: true,
    insertedId: null,
    matchedCount: 10816282,
    modifiedCount: 10816282,
    upsertedCount: 0
}


// drop
db.titles2.drop()

// aggregation (suite)
db.titles3.aggregate([
    { $match: { titleType: 'movie', startYear: {$ne: null} }},
    { $group: {
        _id: {"year": "$startYear"},
        movieCount: {$count: {}},
        runtimeMin: {$min: "$runtimeMinutes"}, 
        runtimeMax: {$max: "$runtimeMinutes"}, 
        runtimeMean: {$avg: "$runtimeMinutes"}, 
        runtimeMedian: {$median: { input: "$runtimeMinutes", method: 'approximate'}}, 
        runtimeQuartiles: {$percentile: {input: "$runtimeMinutes", p: [0.25, 0.5, 0.75], method: 'approximate'}}, 
    }},
    { $sort: {"_id.year": -1} }
])

// group by decade

db.titles3.aggregate([
    { $match: { titleType: 'movie', startYear: {$ne: null} }},
    { $group: {
        _id: {"decade": {$floor: {$divide: ["$startYear", 10]}}},
        movieCount: {$count: {}},
        runtimeMin: {$min: "$runtimeMinutes"}, 
        runtimeMax: {$max: "$runtimeMinutes"}, 
        runtimeMean: {$avg: "$runtimeMinutes"}, 
        runtimeMedian: {$median: { input: "$runtimeMinutes", method: 'approximate'}}, 
        runtimeQuartiles: {$percentile: {input: "$runtimeMinutes", p: [0.25, 0.5, 0.75], method: 'approximate'}}, 
        firstYear: {$min: "$startYear"},
        lastYear: {$max: "$startYear"},
    }},
    { $sort: {"_id.decade": -1} }
])

// casting

db.titles3.aggregate([
    { $match: { titleType: 'movie', primaryTitle: "Face/Off",  startYear: {$ne: null} } },
    { $unwind: {
        path: "$actors"
    }},
    { $unwind: {
        path: "$actors.characters"
    }},
    { $project: {
        actorImdbid: "$actors.imdbId",
        actor: "$actors.primaryName",
        role: "$actors.characters",
        movie: "$primaryTitle",
        year: "$startYear",
        _id: 0
    }}
])

// ajouter l'annee de naissance et age de l'actor
db.titles3.aggregate([
    { $match: { titleType: 'movie', primaryTitle: "Face/Off",  startYear: {$ne: null} } },
    { $unwind: {
        path: "$actors"
    }},
    { $unwind: "$actors.characters" },
    { $lookup: {
        from: "names",
        localField: "actors.imdbId",
        foreignField: "imdbId",
        as: "actorDetails"
    }},
    { $unwind: "$actorDetails" }, // key unique => 1
    { $project: {
        actorImdbid: "$actors.imdbId",
        actor: "$actors.primaryName",
        birthYear: "$actorDetails.birthYear",
        age: { $subtract: ["$startYear", "$actorDetails.birthYear"] },
        ageNow: { $subtract: [{$year: new Date()}, "$actorDetails.birthYear"] },
        role: "$actors.characters",
        movie: "$primaryTitle",
        movieYear: "$startYear",
        // actorDetails: 1, // TODO: pick your data
        _id: 0
    }}
])

// filmographie: director (1), actor (2)
// 1. filters: movies only, années 80
// 2. threshold: minDirecting, minActing