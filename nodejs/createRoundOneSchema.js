const fs = require('fs')

function createRoundOneSchema () {
  let args = process.argv.slice(2)
  let directoryToMegaPredictions = './' + String(args[0])

  fs.readdir(directoryToMegaPredictions, (err, files) => {
    files.forEach(file => {
      createMegaValidationSchema(directoryToMegaPredictions + '/' + file)
    })

    if (err) {
      console.log('Could not read all files. Returned error: ' + err)
    }
  })
}

function createMegaValidationSchema (predictedMegasPath) {
  let predictedMegas = require(predictedMegasPath)

  let baseSchema = {
    annotation: {
      layers: [{
        items: [],
        name: 'Megas',
        opacity: 1
      }],
      name: 'Validation of predicted Megakaryocytes'
    },
    editor: {
      activeChannel: 0,
      activeLayer: 0,
      activeStep: 0,
      toolsDrawer: false,
      studioDrawer: false,
      steps: [{
        ROI: false,
        color: {
          fill: {
            alpha: 0.4,
            hue: 170,
            lightness: 0.5,
            saturation: 0.7
          },
          stroke: {
            alpha: 1,
            hue: 170,
            lightness: 0.5,
            saturation: 0.7
          }
        },
        id: 1,
        instruction: 'Cycle through each of the predicted Megakaryocyte classifications and verify whether the prediction is correct or incorrect. In cases where you are not certain, flag the prediction for review.',
        specificLayer: 0,
        tools: ['pan'],
        type: 'validate'
      }],
      'type': 'dzi'
    },
    images: [{
      name: '',
      source: '',
      type: 'dzi'
    }]
  }

  // Merge the predicted Megas list with the default schema
  predictedMegas.map(mega => {
    if (mega.class === 'megakaryocyte' || (mega.class === 'negative' && mega.score < 0.6)) {
      baseSchema.annotation.layers[0].items.push({
        class: mega.class,
        color: {
          stroke: {
            alpha: 1,
            hue: 170,
            lightness: 0.5,
            saturation: 0.7
          }
        },
        data: {
          score: mega.score,
          validations: [0]
        },
        from: {
          x: mega.x_min,
          y: mega.y_min
        },
        to: {
          x: mega.x_max,
          y: mega.y_max
        },
        type: 'rectangle'
      })
    }
  })

  // let lowScoreNegative = baseSchema.annotation.layers[0].items.filter(item =>
  //   item.class === 'negative' && item.data.score > 0.6
  // )
  // console.log(
  //   lowScoreNegative.length
  // )

  // Add the required image data
  let imageName = predictedMegasPath.split('\\').pop().split('/').pop().slice(0, -5)
  baseSchema.images[0].name = 'Mega Prediction Validation Image'

  let outputFileName = imageName + '_validation.json'
  fs.writeFile(outputFileName, JSON.stringify(baseSchema, null, 2), 'utf8', () => {
    console.log('Created: ' + outputFileName)
  })
}

if (require.main === module) {
  createRoundOneSchema()
}
