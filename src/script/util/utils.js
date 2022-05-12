export function capitalize(str) {
  if (!str) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.substring(1)
}

export function tiny(str) {
  if (!str) {
    return str
  }
  return str.toLowerCase()
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
export function compareIgnoreCase(a, b) {
  return a.localeCompare(b, 'fr', { ignorePunctuation: true })
}

export function match(value, search) {
  if (search === '') {
    return true
  }
  return value.includes(search)
}
