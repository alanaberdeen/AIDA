import ActionsFactory from './actions'
import mutations from './mutations'

const state = {
  signedIn: false,
  user: {
    username: 'default',
    tokens: {
      IdToken: '', // in JWT format
      RefreshToken: '', // in JWT format
      AccessToken: '' // in JWT format
    },
    attributes: {}
  }
}

export default class CognitoAuth {
  constructor (config) {
    this.state = state
    this.actions = new ActionsFactory(config)
    this.mutations = mutations
  }
}
