// find by id
db.titles2.find({_id: ObjectId('67163e2d558d2b21e03099cd')})
db.titles2.find(ObjectId('67163e2d558d2b21e03099cd'))

db.names.aggregate([
    { $project: { 
        firstname: {$arrayElemAt: [
            {$split: ["$primaryName", " "]},
            0
         ]},
        primaryName: 1 } },
    { $match: {firstname: "Irene"} },
    { $limit: 10}
],
{
    collation: {locale: 'fr', strength: 1}
})
  
// https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/
db.titles2.aggregate([
    { $match: {titleType: 'movie', 'isAdult': 0} },
    { $group: {
        _id: "$startYear",
        movie_count: {$count: {}}
    }},
    { $project: {
        year: "$_id",
        movie_count: "$movie_count",
        _id: 0
    }},
    // { $limit: 10 }
    { $sort: {year: 1} }
])

db.titles2.find({
    primaryTitle: 'The Matrix', 
    titleType: 'movie'
}).projection({
    title: "$primaryTitle",
    year: "$startYear",
    duration: {$toInt: "$runtimeMinutes"}
})

// view
db.createView(
    "movies",
    "titles2",
    [
        {$match: {titleType: 'movie'}},
        {$project: {
            title: "$primaryTitle",
            year: "$startYear",
            duration: {$convert:{
                input: "$runtimeMinutes",
                to: "int",
                onError: null
            }},
            director: 1
        }}
    ]
)

db.movies.find({title: "The Matrix"})

// join
db.titles2.aggregate([
    {$match: {primaryTitle: /^The Man Who Knew/}},
    {$lookup: {
        from: "names",
        localField: "director.imdId",
        foreignField: "imdbId",
        as: "director_details"
    }},
    {$unwind: "$director_details"},
    {$project:{
        primaryTitle: 1,
        startYear: 1,
        director_name: "$director.name",
        director_birthyear: "$director_details.birthYear" 
    }},
    {$limit: 10}
])

// indexes
db.titles2.createIndex({tconst: 1}, {unique: true})
db.names.createIndex({imdbId: 1}, {unique: true})

//
db.titles3.find({
    "director.name": "Clint Eastwood"
})

db.titles3.find({
    "actors.name": "Clint Eastwood"
})

