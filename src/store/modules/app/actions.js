import './mutations'

export default {

  // TurnToolbarOff
  toolbarOff: ({
    commit
  }) => {
    commit('toolbarOff')
  },

  // TurnToolbarOn
  toolbarOn: ({
    commit
  }) => {
    commit('toolbarOn')
  }
}
