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

    validations = scoreValidations(validations)
    validations = colorByScore(validations)

    validations.editor.studioDrawer = true
    validations.editor.toolsDrawer = true
    validations.editor.steps[0].tools = ['pan', 'circle', 'rectangle', 'path', 'pencil', 'move', 'node', 'count', 'delete', 'megas', 'filter']

    saveOutput(validations)
  })
}

function scoreValidations (validations) {
  validations.annotation.layers[0].items.map(item => {
    let users = new Set()
    let labels = {}

    item.data.validations.map(validation => {
      if (users.has(validation.user)) {
        if (validation.timeStamp > labels[validation.user].timeStamp) {
          labels[validation.user] = validation
        }
      } else {
        users.add(validation.user)
        labels[validation.user] = validation
      }
    })

    let score = 0
    Object.keys(labels).forEach(key => {
      if (labels[key].decision === 'correct') {
        score++
      } else if (labels[key].decision === 'incorrect') {
        score--
      }
    })

    item.data.validationWeight = score / users.size
  })

  return validations
}

function colorByScore (validations) {
  let colors = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']

  validations.annotation.layers[0].items.map(item => {
    let colorIndex = Math.round(((item.data.validationWeight + 1) / 2) * (8))
    item.color.fill = colors[colorIndex]
    item.color.stroke = colors[colorIndex]
  })

  return validations
}

function colorByMajorityVote (validations) {
  validations.annotation.layers[0].items.map(item => {
    let labels = []
    item.data.validations.map(validation => {
      labels.push(validation.decision)
    })

    let labelsMode = mode(labels)

    if (labelsMode === 'incorrect') {
      item.color = {
        fill: {
          alpha: 0.2,
          hue: 0,
          lightness: 0.6607843137254902,
          saturation: 1
        },
        stroke: {
          alpha: 1,
          hue: 0,
          lightness: 0.6607843137254902,
          saturation: 1
        }
      }
    } else if (labelsMode === 'flag') {
      item.color = {
        fill: {
          alpha: 0.2,
          hue: 45,
          lightness: 0.5137254901960784,
          saturation: 1
        },
        stroke: {
          alpha: 1,
          hue: 45,
          lightness: 0.5137254901960784,
          saturation: 1
        }
      }
    } else if (labelsMode === 'correct') {
      item.color = {
        fill: {
          alpha: 0.2,
          hue: 122.42424242424241,
          lightness: 0.49215686274509807,
          saturation: 0.3944223107569721
        },
        stroke: {
          alpha: 1,
          hue: 122.42424242424241,
          lightness: 0.49215686274509807,
          saturation: 0.3944223107569721
        }
      }
    }
  })

  return validations
}

function mode (arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length -
    arr.filter(v => v === b).length
  ).pop()
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
  let outputFileName = 'combined_validation.json'
  fs.writeFile(outputFileName, JSON.stringify(data, null, 2), 'utf8', () => {
    console.log('Created: ' + outputFileName)
  })
}

if (require.main === module) {
  combineValidations()
}
