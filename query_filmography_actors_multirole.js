db.titles3.aggregate(
[
    {
      $match:
        {
          titleType: "movie",
          startYear: {
            $ne: null
          }
        }
    },
    {
      $unwind:
        {
          path: "$actors"
        }
    },
    {
      $match:
        {
          "actors.imdbId": {
            $in: [
              "nm0000142",              // clint
              "nm0000241",              // jcvd
              "nm0000552",              // eddie
              "nm0000226",              // will
              "nm0000460"               // jeremy
            ]
          }
        }
    },
    {
      $sort:
        {
          "actors.imdbId": 1
        }
    },
    {
      $unwind: {
        path: "$actors.characters",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          actorImdbId: "$actors.imdbId",
          actorName: "$actors.primaryName",
          movieTitle: "$primaryTitle",
          movieYear: "$startYear",
          character: "$actors.characters"
        },
        roleCount: {
          $count: {}
        },
        genresByMovie: {
          $first: "$genres"
        }
      }
    },
    {
      $group: {
        _id: {
          actorImdbId: "$_id.actorImdbId",
          actorName: "$_id.actorName",
          movieTitle: "$_id.movieTitle",
          movieYear: "$_id.movieYear"
        },
        roleCount: {
          $sum: "$roleCount"
        },
        genresByMovie: {
          $first: "$genresByMovie"
        },
        characters: {
          $push: "$_id.character"
        }
      }
    },
    {
      $group: {
        _id: {
          actorImdbId: "$_id.actorImdbId",
          actorName: "$_id.actorName"
        },
        roleCount: {
          $sum: "$roleCount"
        },
        genres: {
          $addToSet: "$genresByMovie"
        },
        firstYear: {
          $min: "$_id.movieYear"
        },
        lastYear: {
          $max: "$_id.movieYear"
        },
        filmography: {
          $push: {
            year: "$_id.movieYear",
            title: "$_id.movieTitle",
            characters: "$characters"
          }
        }
      }
    },
    {
      $unwind: {
        path: "$genres",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$genres",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          actorImdbId: "$_id.actorImdbId",
          actorName: "$_id.actorName"
        },
        roleCount: {
          $first: "$roleCount"
        },
        genres: {
          $addToSet: "$genres"
        },
        firstYear: {
          $first: "$firstYear"
        },
        lastYear: {
          $first: "$lastYear"
        },
        filmography: {
          $first: "$filmography"
        }
      }
    },
    {
      $project: {
        roleCount: 1,
        movieCount: {
          $size: "$filmography"
        },
        genres: {
          $sortArray: {
            input: "$genres",
            sortBy: 1
          }
        },
        firstYear: 1,
        lastYear: 1,
        filmography: {
          $sortArray: {
            input: "$filmography",
            sortBy: {
              year: -1,
              title: 1
            }
          }
        }
      }
    },
    {
      $sort: {
        movieCount: -1
      }
    }
])