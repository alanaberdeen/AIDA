const fs = require('fs')

function timeToValidate () {
  let args = process.argv.slice(2)
  let directoryToMegaPredictions = './' + String(args[0])

  fs.readdir(directoryToMegaPredictions, (err, files) => {
    let userDecisionTimes = {
      alan: [],
      gareth: [],
      gabi: []
    }

    files.forEach(file => {
      console.log('File: ' + file)
      let userImageDecisionTimes = recordDecisionTimes(directoryToMegaPredictions + '/' + file)

      let alan = sumAndAverage(userImageDecisionTimes.alan)
      let gareth = sumAndAverage(userImageDecisionTimes.gareth)
      let gabi = sumAndAverage(userImageDecisionTimes.gabi)

      console.log('alan: ' + alan.avg)
      console.log('gareth: ' + gareth.avg)
      console.log('gabi: ' + gabi.avg + '\n')

      if (alan.avg !== -1) {
        userDecisionTimes.alan.push(alan.avg)
      }
      if (gareth.avg !== -1) {
        userDecisionTimes.gareth.push(gareth.avg)
      }
      if (gabi.avg !== -1) {
        userDecisionTimes.gabi.push(gabi.avg)
      }
    })

    console.log(userDecisionTimes.alan)
    console.log('\n Alan average: ' + sumAndAverage(userDecisionTimes.alan).avg)
    console.log('\n gareth average: ' + sumAndAverage(userDecisionTimes.gareth).avg)
    console.log('\n gabi average: ' + sumAndAverage(userDecisionTimes.gabi).avg)

    if (err) {
      console.log('Could not read all files. Returned error: ' + err)
    }
  })
}

function sumAndAverage (arr) {
  if (arr.length) {
    let sum = arr.reduce(function (a, b) {
      return a + b
    })
    let avg = sum / arr.length

    return {
      sum,
      avg
    }
  } else {
    return {
      sum: -1,
      avg: -1
    }
  }
}

function recordDecisionTimes (validatedMegasPath) {
  let validatedMegas = require(validatedMegasPath)

  let users = {
    alan: [],
    gareth: [],
    gabi: []
  }

  // Add the user's name to each of their validations and filter the 0s
  validatedMegas.annotation.layers[0].items.map(item => {
    let alanItemTotal = 0
    let garethItemTotal = 0
    let gabiItemTotal = 0

    if (item.data.hasOwnProperty('validations')) {
      item.data.validations.map(validation => {
        if (validation.user === 'Gareth') {
          garethItemTotal = garethItemTotal + validation.decisionTimeInMs
        } else if (validation.user === 'Gabrielle') {
          gabiItemTotal = gabiItemTotal + validation.decisionTimeInMs
        } else if (validation.user === 'Alan') {
          alanItemTotal = alanItemTotal + validation.decisionTimeInMs
        }
      })

      if (alanItemTotal !== 0) {
        users.alan.push(alanItemTotal)
      }

      if (gabiItemTotal !== 0) {
        users.gabi.push(gabiItemTotal)
      }

      if (garethItemTotal !== 0) {
        users.gareth.push(garethItemTotal)
      }
    }
  })
  return users
}

if (require.main === module) {
  timeToValidate()
}
