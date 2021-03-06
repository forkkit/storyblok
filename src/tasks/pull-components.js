const fs = require('fs')
const chalk = require('chalk')

/**
 * @method getNameFromComponentGroups
 * @param  {Array<Object>} groups
 * @param  {String} uuid
 * @return {String}
 */
const getNameFromComponentGroups = (groups, uuid) => {
  const exists = groups.filter(group => group.uuid === uuid)

  if (exists.length) {
    return exists[0].name
  }

  return ''
}

/**
 * @method pullComponents
 * @param  {Object} api
 * @param  {Object} options { space: Number }
 * @return {Promise<Object>}
 */
const pullComponents = async (api, options) => {
  const { space } = options

  try {
    const componentGroups = await api.getComponentGroups()

    const components = await api.getComponents()

    components.forEach(component => {
      const groupUuid = component.component_group_uuid
      if (groupUuid) {
        const group = getNameFromComponentGroups(componentGroups, groupUuid)
        component.component_group_name = group
      }
    })

    const file = `components.${space}.json`
    const data = JSON.stringify({ components }, null, 2)

    console.log(`${chalk.green('✓')} We've saved your components in the file: ${file}`)

    fs.writeFile(`./${file}`, data, err => {
      if (err) {
        Promise.reject(err)
        return
      }

      Promise.resolve(file)
    })
  } catch (e) {
    console.error(`${chalk.red('X')} An error ocurred in pull-components task when load components data`)
    return Promise.reject(new Error(e))
  }
}

module.exports = pullComponents
