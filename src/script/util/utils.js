export function capitalize(str) {
  if (!str) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.substring(1)
}

/**
 * @param {string} a 
 * @param {string} b 
 * @returns {string}
 */
export function compareIgnoreCase(a, b) {
  return a.localeCompare(b, 'fr', {ignorePunctuation: true})
}
