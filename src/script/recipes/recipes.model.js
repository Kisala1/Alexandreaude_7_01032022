import { EventEmitter } from '../util/event-emitter.js'
import { match, tiny } from '../util/utils.js'

export class RecipesModel extends EventEmitter {
  constructor() {
    super()
    this.allRecipes = []
    this.filteredRecipes = []

    this.search = ''
    this.filters = { ingredients: [], appliances: [], ustensils: [] }
    this.filtersSearch = { ingredients: '', appliances: '', ustensils: '' }
  }

  setRecipes(recipes) {
    this.allRecipes = recipes
    this.updateFilter()
  }

  addFilter(type, name) {
    let subFilters
    if (type === 'ingredient') {
      subFilters = this.filters.ingredients
    } else if (type === 'appliance') {
      subFilters = this.filters.appliances
    } else if (type === 'ustensil') {
      subFilters = this.filters.ustensils
    } else {
      return
    }

    if (subFilters.indexOf(name) === -1) {
      subFilters.push(name)
      this.updateFilter()
    }
  }

  removeFilter(type, name) {
    let subFilters
    if (type === 'ingredient') {
      subFilters = this.filters.ingredients
    } else if (type === 'appliance') {
      subFilters = this.filters.appliances
    } else if (type === 'ustensil') {
      subFilters = this.filters.ustensils
    } else {
      return
    }

    const removedIndex = subFilters.indexOf(name)
    if (removedIndex !== -1) {
      subFilters.splice(removedIndex, 1)
      this.updateFilter()
    }
  }

  searchContent(value) {
    this.search = tiny(value.trim())
    this.updateFilter()
  }

  searchFilter(value, type) {
    this.filtersSearch[type] = tiny(value.trim())
    this.emitChange()
  }

  updateFilter() {
    this.filteredRecipes = this.allRecipes.filter((recipe) => {
      return this.matchSearch(recipe) && this.matchFilters(recipe)
    })

    this.emitChange()
  }

  matchSearch(recipe) {
    if (this.search.length <= 2) {
      // No need to search
      return true
    }

    // Search name
    if (match(tiny(recipe.name), this.search)) {
      return true
    }

    // Search description
    if (match(tiny(recipe.description), this.search)) {
      return true
    }

    // Search ingredients
    if (
      recipe.ingredients.some((ingredient) =>
        match(tiny(ingredient.ingredient), this.search)
      )
    ) {
      return true
    }

    // Search appliance
    if (match(tiny(recipe.appliance), this.search)) {
      return true
    }

    // Search ustensils
    if (recipe.ustensils.some((ustensil) => match(tiny(ustensil), this.search))) {
      return true
    }

    return false
  }

  matchFilters(recipe) {
    // Filter ingredients
    for (const ingredientFilter of this.filters.ingredients) {
      if (
        recipe.ingredients.findIndex(
          (el) => tiny(el.ingredient) === ingredientFilter
        ) === -1
      ) {
        return false
      }
    }

    // Filter appliances
    for (const applianceFilter of this.filters.appliances) {
      if (tiny(recipe.appliance) !== applianceFilter) {
        return false
      }
    }

    // Filter ustensils
    for (const ustensilFilter of this.filters.ustensils) {
      if (
        recipe.ustensils.findIndex(
          (ustensil) => tiny(ustensil) === ustensilFilter
        ) === -1
      ) {
        return false
      }
    }

    return true
  }

  emitChange() {
    this.emit('change', {
      recipes: this.filteredRecipes,
      filters: this.filters,
      filtersSearch: this.filtersSearch
    })
  }
}
