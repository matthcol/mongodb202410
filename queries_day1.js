// operators
// https://www.mongodb.com/docs/manual/reference/operator/query/

db.titles2.find({'primaryTitle': 'Matrix'})  // predicat =
db.titles2.find({primaryTitle: 'Matrix'})

db.titles2.find({primaryTitle: {$regex: '^Matrix'}})

// and
db.titles2.find({
    primaryTitle: {$regex: '^Matrix'},
    isAdult: 0,
    titleType: 'movie'
})

const title = 'The Man Who Knew Too Much'
db.titles2.find({
    primaryTitle: title,
    isAdult: 0,
    titleType: 'movie'
})

db.titles2.find({
    primaryTitle: {$regex: '^The Man Who Knew Too'},
    isAdult: 0,
    titleType: {$in: ['movie', 'tvEpisode']}
})

db.titles2.find({
    primaryTitle: {$regex: '^The Man Who Knew Too'},
    $or: [
        { 
            isAdult: 0,
            titleType: {$in: ['movie', 'tvEpisode']}
        },
        {
            isAdult: 1
        }
    ]
})

db.titles2.find({
    primaryTitle: {$regex: '^The Man Who Knew Too'},
    isAdult: 1
})
// Result: None

// films The Man Who Knew Too ... entre 1930 et 1960
db.titles2.find({
    primaryTitle: {$regex: '^The Man Who Knew Too'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
})

// NB: JavaScript regex
db.titles2.find({
    primaryTitle: {$regex: /^The man Who knew too/i},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
})

// NB: PCRE Regexp (entre quotes)
db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    "director.name": 1,
    _id: 0
})

// Arrays
// https://www.mongodb.com/docs/manual/tutorial/query-arrays/
// https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/
// https://www.mongodb.com/docs/manual/reference/operator/query-array/

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genres2: {$slice: 1},
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genre: { $arrayElemAt: ['$genres2', 0]},
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genre: { $first: '$genres2'},
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960},
    genres2: {$elemMatch: {$eq: 'Drama'}}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    genres2: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    genres2: {$elemMatch: {$eq: 'Drama'}},
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960},
    "genres2.0": 'Drama'
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genres2: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    startYear: {$gte: 1930, $lte: 1960},
    "genres2.0": 'Thriller'
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genres2: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    genres2: {$size: 3}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genres2: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    $expr: {$gte: [{$size: '$genres2'}, 3]}
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genres2: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: '^The man Who knew too', $options: 'i'},
    titleType: 'movie',
    "genres2.2": {$exists: true}, // element #2 exists
}).projection({
    primaryTitle: 1,
    startYear: 1,
    name: "$director.name",
    genres2: 1,
    _id: 0
})

db.titles2.find({
    primaryTitle: {$regex: 'Matrix'},
    startYear: {$ne: null}
}).sort({
    startYear: 1,
    primaryTitle: 1
})

db.titles2.find({
    primaryTitle: {$regex: 'Matrix'},
    startYear: {$ne: null}
}).count()

db.titles2.find({
    primaryTitle: {$regex: 'Matrix'},
    titleType: 'movie',
    startYear: {$ne: null}
}).count()

db.titles2.count() // deprecated since ??
db.titles2.countDocuments()

db.titles2.distinct("titleType")


