import { EventEmitter } from '../util/event-emitter.js'
import { capitalize, tiny, compareIgnoreCase } from '../util/utils.js'

export class RecipesView extends EventEmitter {
  constructor() {
    super()
    this.recipesElem = document.getElementById('card-recipe')
    this.ingredientsUl = document.getElementById('tags-ingredients')
    this.appliancesUl = document.getElementById('tags-appliances')
    this.ustensilsUl = document.getElementById('tags-ustensils')
    this.ingredientSearch = document.getElementById('input-ingredient')
    this.applianceSearch = document.getElementById('input-appliance')
    this.ustensilSearch = document.getElementById('input-ustensil')
    this.mainSearch = document.getElementById('main-search')

    this.tags = document.getElementById('tagSelector')
  }

  render({ recipes, filters }) {
    let allIngredients = new Set()
    let allAppliances = new Set()
    let allUstensils = new Set()

    for (const recipe of recipes) {
      // Collect ingredients
      for (const ingredient of recipe.ingredients) {
        if (!allIngredients.has(ingredient)) {
          allIngredients.add(tiny(ingredient.ingredient))
        }
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
    this.mainSearch.addEventListener('keyup', () => {
      const mainSearchValue = tiny(this.mainSearch.value)
      this.emit('filterByMainSearch', { value: mainSearchValue })
    })
    // Render ingredients accordion
    this.ingredientsUl.innerHTML = ''
    for (const ingredientName of allIngredients) {
      this.ingredientsUl.appendChild(this.createIngredientLi(ingredientName))
    }

    // Render appliances accordion
    this.appliancesUl.innerHTML = ''
    for (const applianceName of allAppliances) {
      this.appliancesUl.appendChild(this.createApplianceLi(applianceName))
    }

    // Render ustensils accordion
    this.ustensilsUl.innerHTML = ''
    for (const ustensilName of allUstensils) {
      this.ustensilsUl.appendChild(this.createUstensilLi(ustensilName))
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

    // Render accordions after input
    // Ingredients accordion
    this.ingredientSearch.addEventListener('keyup', () => {
      const valueInputIngt = this.ingredientSearch.value

      this.emit('keyupInAccordions', {
        all: allIngredients,
        value: valueInputIngt,
        type: 'ingredient'
      })
    })
    // Appliances accordion
    this.applianceSearch.addEventListener('keyup', () => {
      const valueInputApp = this.applianceSearch.value
      this.emit('keyupInAccordions', {
        all: allAppliances,
        value: valueInputApp,
        type: 'appliance'
      })
    })
    // Ustensils accordion
    this.ustensilSearch.addEventListener('keyup', () => {
      const valueInputUst = this.ustensilSearch.value
      this.emit('keyupInAccordions', {
        all: allUstensils,
        value: valueInputUst,
        type: 'ustensil'
      })
    })

    // Modifie placeholder
    const accordion = document.getElementById('accordion')
    accordion.addEventListener('click', () => {
      const accordionIngt = document.getElementById('accordion-item-ingt')
      if (accordionIngt.click) {
        const inputIngt = document.getElementById('input-ingredient')
        if (
          !document
            .getElementById('accordion-button-ingt')
            .classList.contains('collapsed')
        ) {
          inputIngt.setAttribute('placeholder', 'Rechercher un ingrédient')
          inputIngt.closest('.accordion-item').classList.add('half-width')
        } else {
          inputIngt.setAttribute('placeholder', 'Ingrédients')
          inputIngt.closest('.accordion-item').classList.remove('half-width')
        }
      }
      const accordionApp = document.getElementById('accordion-item-app')
      if (accordionApp.click) {
        const inputApp = document.getElementById('input-appliance')
        if (
          !document
            .getElementById('accordion-button-app')
            .classList.contains('collapsed')
        ) {
          inputApp.setAttribute('placeholder', 'Rechercher un appareil')
          inputApp.closest('.accordion-item').classList.add('half-width')
        } else {
          inputApp.setAttribute('placeholder', 'Appareils')
          inputApp.closest('.accordion-item').classList.remove('half-width')
        }
      }
      const accordionUst = document.getElementById('accordion-item-ust')
      if (accordionUst.click) {
        const inputUst = document.getElementById('input-ustensil')
        if (
          !document
            .getElementById('accordion-button-ust')
            .classList.contains('collapsed')
        ) {
          inputUst.setAttribute('placeholder', 'Rechercher un ustensile')
          inputUst.closest('.accordion-item').classList.add('half-width')
        } else {
          inputUst.setAttribute('placeholder', 'Ustensiles')
          inputUst.closest('.accordion-item').classList.remove('half-width')
        }
      }
    })
  }

  // Créer les li dans accordions après avoir sélectionné un tag
  renderAccordion(type, values) {
    let node
    let createEl
    switch (type) {
      case 'ingredient':
        node = this.ingredientsUl
        createEl = this.createIngredientLi
        break
      case 'appliance':
        node = this.appliancesUl
        createEl = this.createApplianceLi
        break
      case 'ustensil':
        node = this.ustensilsUl
        createEl = this.createUstensilLi
        break
    }
    node.innerHTML = ''

    for (const value of values) {
      node.appendChild(createEl(value))
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

  createIngredientLi(ingredientName) {
    const liElem = document.createElement('li')
    liElem.classList.add('tag-item')
    liElem.textContent = capitalize(ingredientName)
    liElem.addEventListener('click', () => {
      this.emit('addFilter', {
        type: 'ingredient',
        name: ingredientName
      })
    })
    return liElem
  }

  createApplianceLi(applianceName) {
    const liElem = document.createElement('li')
    liElem.classList.add('tag-item')
    liElem.textContent = capitalize(applianceName)
    liElem.addEventListener('click', () => {
      this.emit('addFilter', { type: 'appliance', name: applianceName })
    })
    return liElem
  }

  createUstensilLi(ustensilName) {
    const liElem = document.createElement('li')
    liElem.classList.add('tag-item')
    liElem.textContent = capitalize(ustensilName)
    liElem.addEventListener('click', () => {
      this.emit('addFilter', { type: 'ustensil', name: ustensilName })
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
