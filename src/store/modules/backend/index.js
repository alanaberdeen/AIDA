import actions from './actions'
import mutations from './mutations'

const state = {
  images: [],
  fileName: '',
  imageType: ''
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
