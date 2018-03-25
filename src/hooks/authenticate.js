const { authenticate } = require('@feathersjs/authentication').hooks
const { NotAuthenticated } = require('@feathersjs/errors')
const verifyIdentity = authenticate('jwt')

function hasToken(hook) {
  if (hook.params.headers == undefined) return false
  if (hook.data.accessToken == undefined) return false
  return hook.params.headers.authorization || hook.data.accessToken
}

module.exports = async function authenticate(hook) {
  try {
    console.log(hook);
    return await verifyIdentity(hook)
  } catch (error) {
    if (error instanceof NotAuthenticated && !hasToken(hook)) {
      return hook
    }

    throw error
  }
}
