const { AbilityBuilder, Ability, toMongoQuery } = require('casl')
const { Forbidden } = require('feathers-errors')
const TYPE_KEY = Symbol.for('type')

Ability.addAlias('update', 'patch')
Ability.addAlias('read', ['get', 'find'])
Ability.addAlias('remove', 'delete')

function subjectName(subject) {
  if (!subject || typeof subject === 'string') {
    return subject
  }

  return subject[TYPE_KEY]
}

function defineAbilitiesFor(user) {
  const { rules, can } = AbilityBuilder.extract()

  can('read', ['posts', 'comments'])

  if (user) {
    can('manage', ['posts', 'comments'], { author: user._id })
    can(['read', 'update'], 'users', { _id: user._id })
  }

  return new Ability(rules, { subjectName })
}

module.exports = function authorize(name = null) {
  return async function(hook) {
    const action = hook.method
    const service = name ? hook.app.service(name) : hook.service
    const serviceName = name || hook.path

    hook.params.ability = defineAbilitiesFor(hook.params.user)

    if (!hook.id) {
      const rules = hook.params.ability.rulesFor(action, serviceName)
      Object.assign(hook.params.query, toMongoQuery(rules))
      return hook
    }

    const params = Object.assign({}, hook.params, { provider: null })
    const result = await service.get(hook.id, params)

    result[TYPE_KEY] = serviceName

    if (hook.params.ability.cannot(action, result)) {
      throw new Forbidden(`You are not allowed to ${action} ${serviceName}`)
    }

    if (action === 'get') {
      hook.result = result
    }

    return hook
  }
}
