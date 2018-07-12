// Function that reads in the old data schema object and returns the equivalent
// in the new schema documented here: https://aida.gitbook.io/docs/api-reference

// Export
export default readOldSchema

function readOldSchema (oldData) {
  let newData = {}

  // -----
  // Translate annotation data
  // Don't worry about old string format
  newData['annotation'] = oldData.annotation

  // -----
  // Translate editor data
  // Initialise
  newData['editor'] = {
    type: 'dzi',
    activeChannel: 0,
    activeLayer: 0,
    activeStep: 0,
    steps: []
  }

  // Steps
  for (let i in oldData.steps) {
    let oldStep = oldData.steps[i]

    newData.editor.steps.push({
      ROI: oldStep.ROI,
      specificLayer: oldStep.id - 1,
      id: oldStep.id,
      instruction: oldStep.instruction,
      tools: oldStep.tools,
      color: {
        fill: oldStep.color.fill,
        stroke: oldStep.color.stroke
      }
    })
  }

  // -----
  // Translate image data
  // Initialise
  newData['images'] = []

  // Images
  for (let i in oldData.channels) {
    let oldImage = oldData.channels[i]

    newData.images.push({
      name: oldImage.name,
      source: oldImage.url,
      type: 'dzi'
    })
  }

  return newData
}
