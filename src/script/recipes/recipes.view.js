import { EventEmitter } from '../util/event-emitter.js'

export class RecipesView extends EventEmitter {
  constructor() {
    super()
    this.recipesElem = document.getElementById('card-recipe')
    this.ingredientsUl = document.getElementById('tags-ingredients')
    this.appliancesUl = document.getElementById('tags-appliances')
    this.ustensilsUl = document.getElementById('tags-ustensils')
    /*
    this.tags = document.getElementById('tagSelector')
    */
  }

  render({ recipes, filters }) {
    let allIngredients = new Set()
    let allAppliances = new Set()
    let allUstensils = new Set()

    for (const recipe of recipes) {
      // Collect ingredients
      for (const ingredient of recipe.ingredients) {
        if (!allIngredients.has(ingredient)) {
          allIngredients.add(ingredient.ingredient)
        }
      }

      // Collect appliances
      allAppliances.add(recipe.appliance)

      // Collect ustensils
      for (const ustensil of recipe.ustensils) {
        allUstensils.add(ustensil.charAt(0).toUpperCase() + ustensil.slice(1))
      }
    }

    allIngredients = [...allIngredients].sort()
    allAppliances = [...allAppliances].sort()
    allUstensils = [...allUstensils].sort()

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

    // Render appliances dropdown
    this.appliancesUl.innerHTML = ''
    for (const applianceName of allAppliances) {
      this.appliancesUl.appendChild(this.createApplianceLi(applianceName))
    }

    // Render ustensils dropdown
    this.ustensilsUl.innerHTML = ''
    for (const ustensilName of allUstensils) {
      this.ustensilsUl.appendChild(this.createUstensilLi(ustensilName))
    }
    // Render tags
    // console.log(filters)
  }

  createRecipe(recipe) {
    const recipesElementTemplate = document.getElementById(
      'card-recipe-element'
    )
    const elem = document.importNode(recipesElementTemplate.content, true)

    // Title
    elem.querySelector('.card-title').textContent = recipe.name
    elem.querySelector('div.card').dataset.id = recipe.id
    elem.querySelector('.time-recipe').textContent = recipe.time + ' min'

    const containerIngredients = elem.querySelector('ul.ingredients-recipe')
    for (const elm of recipe.ingredients) {
      const ingredientElm = document.createElement('li')
      ingredientElm.classList.add('ingredient-recipe')
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
    }

    elem.querySelector('p.description').textContent = recipe.description

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

  createApplianceLi(applianceName) {
    const liElem = document.createElement('li')
    liElem.classList.add('dropdown-item')
    liElem.textContent = applianceName
    liElem.addEventListener('click', () => {
      this.emit('addFilter', { type: 'appliance', name: applianceName })
    })
    return liElem
  }

  createUstensilLi(ustensilName) {
    const liElem = document.createElement('li')
    liElem.classList.add('dropdown-item')
    liElem.textContent = ustensilName
    liElem.addEventListener('click', () => {
      this.emit('addFilter', { type: 'ustensil', name: ustensilName })
    })
    return liElem
  }
}
