// Given a list of predicted Megakaryocytes, create a schema that describes an
// AIDA instance for user validation.

// Require the necessary stuff
const fs = require('fs')

/**
 * @function createMegaValidationSchema
 * @param {string} predictedMegasFile - JSON file containing of predicted megas.Formatted in the AIDA schema.
 */
function createMegaValidationSchema (predictedMegasFile) {
  // Get the command line arguments
  let args = process.argv.slice(2)

  // predictedMegas path
  let predictedMegasPath = './' + String(args[0])

  // read the file
  let predictedMegas = require(predictedMegasPath)

  // Define the base schema
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
      source: 'https://s3-eu-west-1.amazonaws.com/aida-example/SampleKi67.dzi',
      type: 'dzi'
    }]
  }

  // Merge the predicted Megas list with the default schema
  predictedMegas.map(mega => {
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
        validation: []
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
  })

  // Add the required image data
  baseSchema.images[0].name = String(args[0]).slice(0, -5)

  // Write data to a file
  fs.writeFile('test.json', JSON.stringify(baseSchema), 'utf8', () => {
    console.log('Done')
  })
}

// Run the function from the command line
if (require.main === module) {
  createMegaValidationSchema()
}
