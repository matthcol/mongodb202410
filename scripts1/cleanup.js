// cleanup dataset titles3

db.titles3.updateMany(
    { runtimeMinutes: {$regex: "[^0-9]"} }, // filter
    { $set: {runtimeMinutes: null}} // update operator
)

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



db.titles3.deleteMany({
    isAdult: 1
})
// { acknowledged: true, deletedCount: 358373 }

// NB: use convert if errors can occur (null is not an error)
db.titles3.updateMany(
    {},
    [  // Important: les operateurs d'agregations ne marchent qu'en mode pipeline !
        { $set: {runtimeMinutes: {$toInt: "$runtimeMinutes"}}}
    ]
)
