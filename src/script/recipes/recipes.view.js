import { EventEmitter } from '../util/event-emitter.js'

export class RecipesView extends EventEmitter {
  constructor() {
    super()
    this.recipesElem = document.getElementById('card-recipe')
    this.ingredientsUl = document.getElementById('tags-ingredients')
    /*
    this.appliancesUl = document.getElementById('tags-appliances')
    this.ustensilsUl = document.getElementById('tags-ustensils')
    this.tags = document.getElementById('tagSelector')
    */
    // this.controller.model.addObserver(this)
  }

  render({ recipes, filters }) {
    let allIngredients = new Set()
    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        allIngredients.add(ingredient.ingredient)
      }
      // TODO: Collect appliances
      // TODO: Collect ustensils
    }
    allIngredients = [...allIngredients].sort()

    // Render recipes cards
    this.recipesElem.innerHTML = ''
    for (const recipe of recipes) {
      this.recipesElem.appendChild(this.createRecipe(recipe))
    }
    
    // Render ingredients dropdown
    this.ingredientsUl.innerHTML = ''
    for (const ingredientName of allIngredients) {
      this.ingredientsUl.appendChild(this.createIngredientLi(ingredientName))
    }

    // Render tags
    // console.log(filters)
  }

  createRecipe(recipe) {
    const recipesElementTemplate = document.getElementById(
      'card-recipe-element'
    )
    const elem = document.importNode(recipesElementTemplate.content, true)

    // TODO: Edit template
    // Title
    elem.querySelector('.card-title').textContent = recipe.name

    

    return elem
  }

  createIngredientLi(ingredientName) {
    const liElem = document.createElement('li')
    liElem.classList.add('dropdown-item')
    liElem.textContent = ingredientName
    liElem.addEventListener('click', () => {
      this.emit('addFilter', { type: 'ingredient', name: ingredientName })
    })
    return liElem
  }

  /*
  update(model) {
    console.log("XX hey pourquoi tu t'affiches pas")
    this.recipes = this.displayRecipes(model.recipes)
    // this.ingredientsUl.textContent = this.displayTagsDropdown(model.ingredients)
    // this.appliancesUl.textContent = this.displayTagsDropdown(model.appliances)
    // this.ustensilsUl.textContent = this.displayTagsDropdown(model.ustensils)
  }

  displayRecipes(recipes) {
    return recipes.map((recipe) => {
      console.log(recipe)
      const recipesElementTemplate = document.getElementById(
        'card-recipe-element'
      )
      const el = document.importNode(recipesElementTemplate.content, true)
      el.querySelector('div.card').dataset.id = recipe.id

      el.querySelector('h5').textContent = recipe.name
      el.querySelector('strong').textContent = recipe.time + ' min'
      const containerIngredients = el.querySelector('ul')

      const ingredientElm = document.createElement('li')
      ingredientElm.textContent =
        elm.ingredient + ' : ' + elm.quantity + ' ' + elm.unit

      if (elm.unit === 'gramme' || elm.unit === 'grammes') {
        ingredientElm.textContent =
          elm.ingredient + ' : ' + elm.quantity + ' ' + 'gr'
        if (elm.ingredient === 'Viande hachée 1% de matière grasse') {
          ingredientElm.textContent =
            'Viande hachée' + ' : ' + elm.quantity + ' ' + 'gr'
        }
      }
      if (elm.unit === 'cuillères à soupe' || elm.unit === 'cuillère à soupe') {
        ingredientElm.textContent =
          elm.ingredient + ' : ' + elm.quantity + ' ' + 'CaS'
      }

      if (elm.unit === undefined) {
        ingredientElm.textContent = elm.ingredient + ' : ' + elm.quantity
        if (elm.ingredient === 'Saucisse bretonne ou de toulouse') {
          ingredientElm.textContent = 'Saucisses' + ' : ' + elm.quantity
        }
        if (elm.quantity === undefined) {
          ingredientElm.textContent = elm.ingredient
        }
      }

      containerIngredients.appendChild(ingredientElm)

      el.querySelector('p').textContent = recipe.description

      recipes.appendChild(el)
    })
  }
  */

  // getUstensilTags() {
  //   const tagsUstensils = []
  //   for (const recipe of this.recipes) {
  //     for (const ustensil of recipe.ustensils) {
  //       if (!tagsUstensils.includes(ustensil)) {
  //         tagsUstensils.push(ustensil)
  //       }
  //     }
  //   }
  //   return tagsUstensils
  // }

  // getApplianceTags() {
  //   const tagsAppliance = []
  //   for (const recipe of this.recipes) {
  //     if (!tagsAppliance.includes(recipe.appliance)) {
  //       tagsAppliance.push(recipe.appliance)
  //     }
  //   }
  //   return tagsAppliance
  // }

  // getIngredientsTags() {
  //   const tagsIngredients = []
  //   for (const recipe of this.recipes) {
  //     for (const ingredient of recipe.ingredients) {
  //       if (!tagsIngredients.includes(ingredient.ingredient)) {
  //         tagsIngredients.push(ingredient.ingredient)
  //       }
  //     }
  //   }
  //   return tagsIngredients
  // }

  // displayTagsDropdown() {
  //   const ingredientsList = getIngredientsTags()
  //   for (const ingredients of ingredientsList) {
  //     const liIngredient = document.createElement('li')
  //     liIngredient.classList.add('dropdown-item')
  //     liIngredient.textContent = ingredients
  //     this.ingredientsUl.appendChild(liIngredient)
  //   }

  //   const applianceList = getApplianceTags()
  //   for (const appliances of applianceList) {
  //     const liAppliance = document.createElement('li')
  //     liAppliance.classList.add('dropdown-item')
  //     liAppliance.textContent = appliances
  //     this.appliancesUl.appendChild(liAppliance)
  //   }

  //   const ustansilList = getUstensilTags()
  //   for (const ustensils of ustansilList) {
  //     const liUstensil = document.createElement('li')
  //     liUstensil.classList.add('dropdown-item')
  //     liUstensil.textContent = ustensils
  //     this.ustensilsUl.appendChild(liUstensil)
  //   }
  // }
}
