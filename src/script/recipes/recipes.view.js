import { EventEmitter } from '../util/event-emitter.js'
import { capitalize, tiny, compareIgnoreCase, match } from '../util/utils.js'

export class RecipesView extends EventEmitter {
  constructor() {
    super()
    this.recipesElem = document.getElementById('card-recipe')

    this.ingredientsUl = document.getElementById('tags-ingredients')
    this.appliancesUl = document.getElementById('tags-appliances')
    this.ustensilsUl = document.getElementById('tags-ustensils')

    this.mainSearch = document.getElementById('main-search')
    this.ingredientSearch = document.getElementById('input-ingredients')
    this.applianceSearch = document.getElementById('input-appliances')
    this.ustensilSearch = document.getElementById('input-ustensils')

    this.tags = document.getElementById('tagSelector')

    this.registerListener()
  }

  registerListener() {
    this.mainSearch.addEventListener('input', () => {
      const mainSearchValue = tiny(this.mainSearch.value)
      this.emit('searchContent', { value: mainSearchValue })
    })

    // Ingredients dropdown
    this.ingredientSearch.addEventListener('input', () => {
      const valueInputIngt = this.ingredientSearch.value
      this.emit('searchFilter', {
        value: valueInputIngt,
        type: 'ingredients'
      })
    })

    // Appliances dropdown
    this.applianceSearch.addEventListener('input', () => {
      const valueInputApp = this.applianceSearch.value
      this.emit('searchFilter', {
        value: valueInputApp,
        type: 'appliances'
      })
    })

    // Ustensils dropdown
    this.ustensilSearch.addEventListener('input', () => {
      const valueInputUst = this.ustensilSearch.value
      this.emit('searchFilter', {
        value: valueInputUst,
        type: 'ustensils'
      })
    })
  }

  render({ recipes, filters, filtersSearch }) {
    let allIngredients = new Set()
    let allAppliances = new Set()
    let allUstensils = new Set()

    for (const recipe of recipes) {
      // Collect ingredients
      for (const ingredient of recipe.ingredients) {
        allIngredients.add(tiny(ingredient.ingredient))
      }

      // Collect appliances
      allAppliances.add(tiny(recipe.appliance))

      // Collect ustensils
      for (const ustensil of recipe.ustensils) {
        allUstensils.add(tiny(ustensil))
      }
    }

    // Ranger par ordre alphabétique
    allIngredients = [...allIngredients].sort(compareIgnoreCase)
    allAppliances = [...allAppliances].sort(compareIgnoreCase)
    allUstensils = [...allUstensils].sort(compareIgnoreCase)

    // Render recipes cards
    this.recipesElem.innerHTML = ''
    for (const recipe of recipes) {
      this.recipesElem.appendChild(this.createRecipe(recipe))
    }

    // Render ingredients dropdown
    this.ingredientsUl.innerHTML = ''
    for (const ingredientName of allIngredients) {
      if (match(ingredientName, filtersSearch.ingredients)) {
        this.ingredientsUl.appendChild(
          this.createDropdownLi('ingredient', ingredientName)
        )
      }
    }

    // Render appliances dropdown
    this.appliancesUl.innerHTML = ''
    for (const applianceName of allAppliances) {
      if (match(applianceName, filtersSearch.appliances)) {
        this.appliancesUl.appendChild(
          this.createDropdownLi('appliance', applianceName)
        )
      }
    }

    // Render ustensils dropdown
    this.ustensilsUl.innerHTML = ''
    for (const ustensilName of allUstensils) {
      if (match(ustensilName, filtersSearch.ustensils)) {
        this.ustensilsUl.appendChild(
          this.createDropdownLi('ustensil', ustensilName)
        )
      }
    }

    // Render tags
    this.tags.innerHTML = ''
    for (const ingredient of filters.ingredients) {
      this.tags.appendChild(this.createTag('ingredient', ingredient))
    }
    for (const appliance of filters.appliances) {
      this.tags.appendChild(this.createTag('appliance', appliance))
    }
    for (const ustensil of filters.ustensils) {
      this.tags.appendChild(this.createTag('ustensil', ustensil))
    }
  }

  // Créer card Recette
  createRecipe(recipe) {
    const recipesElementTemplate = document.getElementById(
      'card-recipe-element'
    )
    const elem = document.importNode(recipesElementTemplate.content, true)

    elem.querySelector('div.card').dataset.id = recipe.id
    elem.querySelector('.card-title').textContent = recipe.name
    elem.querySelector('.time-recipe').textContent = recipe.time + ' min'

    const containerIngredients = elem.querySelector('ul.ingredients-recipe')
    for (const { ingredient, quantity, unit } of recipe.ingredients) {
      const ingredientElm = document.createElement('li')
      ingredientElm.classList.add('ingredient-recipe')
      ingredientElm.textContent = ingredient + ' : ' + quantity + ' ' + unit

      if (unit === 'gramme' || unit === 'grammes') {
        ingredientElm.textContent = ingredient + ' : ' + quantity + ' ' + 'gr'
        if (ingredient === 'Viande hachée 1% de matière grasse') {
          ingredientElm.textContent =
            'Viande hachée' + ' : ' + quantity + ' ' + 'gr'
        }
      }
      if (unit === 'cuillères à soupe' || unit === 'cuillère à soupe') {
        ingredientElm.textContent = ingredient + ' : ' + quantity + ' ' + 'CaS'
      }

      if (unit === undefined) {
        ingredientElm.textContent = ingredient + ' : ' + quantity
        if (ingredient === 'Saucisse bretonne ou de toulouse') {
          ingredientElm.textContent = 'Saucisses' + ' : ' + quantity
        }
        if (quantity === undefined) {
          ingredientElm.textContent = ingredient
        }
      }
      containerIngredients.appendChild(ingredientElm)
    }

    elem.querySelector('p.description').textContent = recipe.description

    return elem
  }

  // Fonctions pour créer les li : Ingredient, Appliance, Ustensil

  createDropdownLi(type, name) {
    const liElem = document.createElement('li')
    liElem.tabIndex = 0
    liElem.classList.add('tag-item')
    liElem.textContent = capitalize(name)
    liElem.addEventListener('click', (e) => {
      e.preventDefault() // prevent focus
      this.emit('addFilter', { type, name })
    })
    liElem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.emit('addFilter', { type, name })
      }
    })
    return liElem
  }

  // Créer tag
  createTag(type, tag) {
    const tagElem = document.createElement('span')
    tagElem.classList.add('tag')
    tagElem.classList.add(type)
    tagElem.textContent = capitalize(tag)

    const closeSymbol = document.createElement('i')
    closeSymbol.classList.add('bi', 'bi-x-circle', 'close-tag')

    closeSymbol.addEventListener('click', () => {
      this.emit('removeFilter', { type: type, name: tag })
    })

    tagElem.appendChild(closeSymbol)
    return tagElem
  }
}
