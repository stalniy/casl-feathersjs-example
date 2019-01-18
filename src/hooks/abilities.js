const { AbilityBuilder, Ability } = require('@casl/ability')
const { toMongoQuery } = require('@casl/mongoose')
const { Forbidden } = require('@feathersjs/errors')
const TYPE_KEY = Symbol.for('type')

Ability.addAlias('update', 'patch')
Ability.addAlias('read', ['get', 'find'])
Ability.addAlias('delete', 'remove')

function subjectName(subject) {
  if (!subject || typeof subject === 'string') {
    return subject
  }

  return subject[TYPE_KEY]
}

function defineAbilitiesFor(user) {
  const { rules, can } = AbilityBuilder.extract()

  can('create',['users'])
  can('read', ['posts', 'comments'])

  if (user) {
    can('manage', ['posts', 'comments'], { author: user._id })
    can(['read', 'update'], 'users', { _id: user._id })
  }

  if (process.env.NODE_ENV !== 'production') {
    can('create', ['users'])
  }

  return new Ability(rules, { subjectName })
}

function canReadQuery(query) {
  return query !== null
}

module.exports = function authorize(name = null) {
  return async function(hook) {
    const action = hook.method
    const service = name ? hook.app.service(name) : hook.service
    const serviceName = name || hook.path
    const ability = defineAbilitiesFor(hook.params.user)
    const throwUnlessCan = (action, resource) => {
      if (ability.cannot(action, resource)) {
        throw new Forbidden(`You are not allowed to ${action} ${serviceName}`)
      }
    }

    hook.params.ability = ability

    if (hook.method === 'create') {
      if (Array.isArray(ctx.data) && ctx.data[0]) {
        ctx.data[0][TYPE_KEY] = ctx.path
        throwUnlessCan('create', ctx.data[0])
        delete ctx.data[0][TYPE_KEY]
      } else {
        ctx.data[TYPE_KEY] = ctx.path
        throwUnlessCan('create', ctx.data)
        delete ctx.data[TYPE_KEY]
      }
    }

    if (!hook.id) {
      let query = toMongoQuery(ability, serviceName, action)
        
      // query optimization [https://github.com/stalniy/casl/issues/30]
      // if there only one condition don't use $or
      if (
        query
        && typeof query === 'object'
        && !Array.isArray(query)
        && Object.keys(query).length === 1
        && Array.isArray(query.$or)
        && query.$or.length === 1
      ) {
        [query] = query.$or
      }

      if (canReadQuery(query)) {
        Object.assign(hook.params.query, query)
      } else {
        hook.result = {}
      }

      return hook
    }

    // TODO: make sure if params.query.$select is defined
    // it should include fields defined in the rule, orherwise it won't work proparly 
    const params = Object.assign({}, hook.params, { provider: null })
    const result = await service.get(hook.id, params)

    result[TYPE_KEY] = serviceName
    throwUnlessCan(action, result)

    if (action === 'get') {
      delete result[TYPE_KEY]
      hook.result = result
    }

    return hook
  }
}
