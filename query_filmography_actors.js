const thresholdMinActing = 4
const thresholdMaxActing = 15

db.titles3.aggregate([
    { $match: { 
            titleType: 'movie', 
            actors: { $ne: null},
            startYear: { $ne: null, $gte: 1980, $lt: 1990 }, 
    }},
    { $unwind: "$actors" },
    { $sort: { "actors.imdbId": 1, startYear: 1, primaryTitle: 1 }},
    { $group: {
        _id: {
            actorImdbId: "$actors.imdbId",
            actorName: "$actors.primaryName" 
        },
        roleCount: { $count: {} },
        firstYear: { $min: "$startYear" },
        lastYear: { $max: "$startYear" },
        genresByMovie: { $push: "$genres" }, 
        filmography: { $push: {year: "$startYear", title: "$primaryTitle"}}
    }}, 
    { $match: {roleCount: {$gte: thresholdMinActing, $lt: thresholdMaxActing}} },
    { $unwind: "$genresByMovie" },
    { $unwind: "$genresByMovie" },
    { $group: {
        _id: {
            actorImdbId: "$_id.actorImdbId",
            actorName: "$_id.actorName" 
        },
        roleCount: { $first: "$roleCount" },
        firstYear: { $first: "$firstYear" },
        lastYear: { $first: "$lastYear" },
        genres: { $addToSet: "$genresByMovie" },
        filmography: { $first: "$filmography" }
    }}, 
    { $sort: {roleCount: -1} },
    // { $limit: 1 }
])
