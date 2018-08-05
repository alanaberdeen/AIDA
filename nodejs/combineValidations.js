const fs = require('fs')

function combineValidations () {
  let args = process.argv.slice(2)
  let directoryToMegaPredictions = './' + String(args[0])

  let validations = {}

  fs.readdir(directoryToMegaPredictions, validations, (err, files) => {
    files.forEach(file => {
      validations = addValidationData((directoryToMegaPredictions + '/' + file), validations)
    })

    if (err) {
      console.log('Could not read all files. Returned error: ' + err)
    }

    saveOutput(validations)
  })
}

function addValidationData (newValidationPath, currentValidations) {
  let newValidations = require(newValidationPath)

  // Extract the user from the filename, this is super fragile
  let user = newValidationPath.replace(/^.*[_]/, '').slice(0, -5)

  // Add the user's name to each of their validations and filter the 0s
  newValidations.annotation.layers[0].items.map(item => {
    item.data.validations = item.data.validations.filter(validation => validation !== 0)
    item.data.validations.map(validation => {
      validation['user'] = user
    })
  })

  if (!('annotation' in currentValidations)) {
    return newValidations
  } else {
    newValidations.annotation.layers[0].items.map((item, index) => {
      currentValidations.annotation.layers[0].items[index].data.validations.push(...item.data.validations)
    })

    return currentValidations
  }
}

function saveOutput (data) {
  let outputFileName = 'test_validation.json'
  fs.writeFile(outputFileName, JSON.stringify(data, null, 2), 'utf8', () => {
    console.log('Created: ' + outputFileName)
  })
}

if (require.main === module) {
  combineValidations()
}
