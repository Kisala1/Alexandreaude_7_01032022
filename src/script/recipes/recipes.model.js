import { EventEmitter } from '../util/event-emitter.js'
import { tiny } from '../util/utils.js'

export class RecipesModel extends EventEmitter {
  constructor() {
    super()
    this.allRecipes = []
    this.filteredRecipes = []
    this.mainSearch = undefined

    this.filters = { ingredients: [], appliances: [], ustensils: [] }
  }

  setRecipes(recipes) {
    this.allRecipes = recipes
    this.filter()
  }
  addFilter(type, name, container) {
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
      this.filter()
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
      this.filter()
    }
  }
  
 
  

  filterTagByInput(all, value, type) {
    const results = all.filter((el) => el.includes(value))
    this.emit('changeFilter', { type, values: results })
  }

  filter() {
    this.filteredRecipes = this.allRecipes.filter((recipe) => {
      // Filter main search
      if (this.mainSearch) {
        if (false) {
          // TODO
          return false
        }
      }

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
    })

    this.emit('change', {
      recipes: this.filteredRecipes,
      filters: this.filters
    })
  }
}
