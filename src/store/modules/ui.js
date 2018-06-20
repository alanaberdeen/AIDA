// This file handles the management of the state for the ui.
// This is for storing and dynamically updating the global ui state.

const state = {
  signInDialog: false
}

const actions = {
  toggleSignInDialog: ({
    commit
  }) => {
    commit('toggleSignInDialog')
  }
}

const mutations = {
  toggleSignInDialog: (state) => {
    state.signInDialog = !state.signInDialog
  }
}

// Export all of the relevant logic so that it can be combined with the complete
// store and all other module logic.
export default {
  state,
  actions,
  mutations
}
