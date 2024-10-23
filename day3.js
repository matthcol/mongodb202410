db.titles3.find({_id: ObjectId('67177a883849651457c227a6')})
db.titles3.find(ObjectId('67177a883849651457c227a6'))
db.titles3.find(ObjectId('67177a883849651457c227a6')).explain("executionStats")

// Index sur key imddb
db.titles3.createIndex({tconst: 1, unique: 1})
db.names.createIndex({imdbId:1, unique: 1})
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

db.titles3.find({'director.imdbId': 'nm0000142'})
db.titles3.find({actors: {$elemMatch: {imdbId: 'nm0000142'}}})
