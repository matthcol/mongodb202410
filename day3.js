db.titles3.find({_id: ObjectId('67177a883849651457c227a6')})
db.titles3.find(ObjectId('67177a883849651457c227a6'))
db.titles3.find(ObjectId('67177a883849651457c227a6')).explain("executionStats")

// Index sur key imddb
db.titles3.createIndex({tconst: 1}, {unique: true})
db.names.createIndex({imdbId: 1}, {unique: true})
db.names.createIndex({primaryName:1})

db.titles3.getIndexes()
db.titles3.dropIndex('tconst_1')

db.names.find({primaryName:'Steve McQueen'})
db.names.find({primaryName:'steve mcqueen'})
{primaryName: /^steve mcqueen$/i} // index mal exploité
{primaryName: /^Steve Mc/} // index mal exploité
{primaryName: /^S/} // index mal exploité
db.names.dropIndex('primaryName_1')
db.names.createIndex(
    {primaryName:1}, 
    {
        name: 'idx_names_ci_ai',
        collation:{
            locale: 'en',
            strength: 1
        }
    }
)
db.names.createIndex(
    {primaryName:1}, 
    {
        name: 'idx_names',
    }
)
db.names.getIndexes()

// utilise l'index: idx_names_ci_ai
db.names.find({primaryName:'steve mcqueen'}).collation({locale: 'en', strength: 1})

// utilise l'index: idx_names
db.names.find({primaryName: /^Steve Mc/})

// utilise l'index: idx_names (full scan): pas efficace
db.names.find({primaryName: /^steve mc/i})

// NB: search full text: only in Atlas version

// Clint Eastwood: nm0000142
db.titles3.find({'director.imdbId': 'nm0000142'})
db.titles3.find({actors: {$elemMatch: {imdbId: 'nm0000142'}}})
db.titles3.find({'actors.imdbId': 'nm0000142'})

// index sur director.imdbId
db.titles3.createIndex(
    {
        'director.imdbId': 1
    },
    {
        name: 'idx_titles_director'
    }
)
// index sur actors.imdbId (array)
db.titles3.createIndex(
    {
        'actors.imdbId': 1
    },
    {
        name: 'idx_titles_actors'
    }
)

// exemple avec Hint
db.titles3.find({'director.imdbId': 'nm0000142'}).hint({'director.imdbId':1})

// views
db.createView("titles_movie", "titles3", [
    {$match: {titleType: 'movie'}}
])

// or 
db.createCollection(
    "director_actor_same_movie",
    {
       viewOn: "titles3",
       pipeline: [
        {
          $match: {
            titleType: "movie",
            director: {
              $ne: null
            }
          }
        },
        {
          $unwind: {
            path: "$actors"
          }
        },
        {
          $match: {
            $expr: {
              $eq: [
                "$actors.imdbId",
                "$director.imdbId"
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              imdbId: "$director.imdbId",
              name: "$director.name"
            },
            movies: {
              $addToSet: {
                title: "$primaryTitle",
                year: "$startYear"
              }
            }
          }
        }
      ],
    }
)

// other version
db.createCollection(
    "director_actor_same_movie2",
    {
       viewOn: "titles3",
       pipeline: [
        {
          $match: {
            titleType: "movie",
            director: {
              $ne: null
            },
            actors: {
              $ne: null
            },
            $expr: {
              $in: [
                "$director.imdbId",
                "$actors.imdbId"
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              imdbId: "$director.imdbId",
              name: "$director.name"
            },
            movies: {
              $addToSet: {
                title: "$primaryTitle",
                year: "$startYear"
              }
            }
          }
        }
      ],
    }
)


db.director_actor_same_movie.aggregate([
    { $addFields: { movieCount: {$size: "$movies"}}},
    { $match: {movieCount: {$gt: 10}}},
    { $sort: {movieCount: -1}}
])


// Fail insert
db.names.insertOne({
    imdbId: "nm000000000000000000000001",
    primaryName: "Marguerite Bertsch",
    birthYear: null,
    deathYear: 1967
})

db.names.insertOne({
    imdbId: "nm000000000000000000000001",
    primaryName: "Marguerite Bertsch",
    deathYear: 1967
})

// unicity: index unique imdbId
db.names.insertOne({
    imdbId: "nm000000000000000000000001",
    primaryName: "Marguerite Bertsch",
    deathYear: 1967
})

db.names.insertOne({
    imdbId: "nm000000000000000000000002",
    primaryName: "Marguerite Bertschclsd",
    deathYear: 1967,
    isAdult: true
})

db.names.insertOne({
    imdbId: "nm000000000000000000000004",
    primaryName: "Marguerite Bertschclsd",
    deathYear: 1967,
    isAdult: true
})
// schemaRulesNotSatisfied: [
//     {
//       operatorName: 'additionalProperties',
//       specifiedAs: { additionalProperties: false },
//       additionalProperties: [ 'isAdult' ]
//     }



//References utiles:
// * JSON Schema
https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/
// * BSON Types:
https://www.mongodb.com/docs/manual/reference/bson-types/
// * Date, ISODate
https://www.mongodb.com/docs/manual/reference/method/Date/
db.cakeSales.find( { orderDate: { $lt: ISODate("2021-02-25T10:03:46.000Z") } } )