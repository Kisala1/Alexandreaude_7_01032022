import { RecipesModel } from './recipes/recipes.model.js'
import { RecipesController } from './recipes/recipes.controller.js'
import { RecipesView } from './recipes/recipes.view.js'

function main() {
  const model = new RecipesModel()
  const view = new RecipesView()
  const controller = new RecipesController(model, view)
  controller.load()
}
main()