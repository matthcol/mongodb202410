const thresholdMinDirecting = 4
const thresholdMaxDirecting = 15

db.titles3.aggregate([
    { $match: { 
            titleType: 'movie', 
            director: { $ne: null},
            startYear: { $ne: null, $gte: 1980, $lt: 1990 }, 
    }},
    { $sort: { "director.imdbId": 1, startYear: 1, primaryTitle: 1 }},
    { $group: {
        _id: {
            director_imdbId: "$director.imdbId",
            director_name: "$director.name" 
        },
        movieCount: { $count: {} },
        firstYear: { $min: "$startYear" },
        lastYear: { $max: "$startYear" },
        filmography: { $push: {year: "$startYear", title: "$primaryTitle"}}
    }}, 
    { $match: {movieCount: {$gte: thresholdMinDirecting, $lt: thresholdMaxDirecting}} },
    { $sort: {movieCount: -1} },
    // { $limit: 1 }
])
