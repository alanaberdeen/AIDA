export default {
  // Get an array specifying the tools included in the current step.
  getStepTools: state => {
    if (state.steps) {
      return state.steps[state.activeStep].tools
    } else {
      return ['pan', 'circle', 'rectangle', 'pen', 'pencil', 'move', 'node', 'count', 'delete', 'faces']
    }
  }
}
