import { RecipesModel } from './recipes.model.js'
import { RecipesView } from './recipes.view.js'

export class RecipesController {
  /**
   * @param {RecipesModel} model
   * @param {RecipesView} view
   */
  constructor(model, view) {
    this.model = model
    this.view = view

    model.on('change', (data) => view.render(data))

    view.on('addFilter', ({ type, name }) => model.addFilter(type, name))
    view.on('removeFilter', ({ type, name }) => model.removeFilter(type, name))
  }

  load() {
    fetch('../data/recipes.json')
      .then((res) => res.json())
      .then(({ recipes }) => {
        this.model.setRecipes(recipes)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
