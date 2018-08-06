export default {
  // Get an array specifying the tools included in the current step.
  getStepTools: state => {
    if (state.steps && state.steps[state.activeStep].tools) {
      return state.steps[state.activeStep].tools
    } else {
      return ['pan', 'circle', 'rectangle', 'path', 'pencil', 'move', 'node', 'count', 'delete', 'megas', 'filter']
    }
  }
}
