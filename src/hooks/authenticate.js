const { authenticate } = require('feathers-authentication').hooks
const { NotAuthenticated } = require('feathers-errors')
const verifyIdentity = authenticate('jwt')

function hasToken(hook) {
  return hook.params.headers.authorization || hook.data.accessToken
}

module.exports = async function authenticate(hook) {
  try {
    return await verifyIdentity(hook)
  } catch (error) {
    if (error instanceof NotAuthenticated && !hasToken(hook)) {
      return hook
    }

    throw error
  }
}
