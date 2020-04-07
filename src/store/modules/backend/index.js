import actions from './actions'
import mutations from './mutations'

const state = {
  availableImages: [],
  projectFilePath: '',
  annotationFilePath: ''
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
