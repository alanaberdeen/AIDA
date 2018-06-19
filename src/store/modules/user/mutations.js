import * as types from './mutation-types'

export default {
  [types.AUTHENTICATE] (state, payload) {
    state.user = payload
    state.signedIn = true
  },
  [types.SIGNOUT] (state) {
    state.user = null
    state.signedIn = false
  },
  [types.ATTRIBUTES] (state, payload) {
    state.user.attributes = payload
  }
}
