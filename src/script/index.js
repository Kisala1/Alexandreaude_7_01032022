// Faire une variable des recettes filtrées
// Reprendre les tags des recettes filtrer et reremplir les dropdown
// Gérer l'affichage des recettes

// EventListener pour supprimer le tag
// faire une boucle qui check les tags restants et afficher les recettes

import { displayTagsOnClick } from './tag.js'
fetch('./../../data/recipes.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status)
    }
    return response.json()
  })
  .then((data) => {
    const recipes = data.recipes
    displayTagsDropdown(recipes)
    displayRecipes(recipes)
    displayTagsOnClick(recipes)
  })
  .catch((error) => {
    console.error(error)
  })

function getUstensilTags(recipes) {
  const tagsUstensils = []
  for (const recipe of recipes) {
    for (const ustensil of recipe.ustensils) {
      if (!tagsUstensils.includes(ustensil)) {
        tagsUstensils.push(ustensil)
      }
    }
  }
  return tagsUstensils
}
function getApplianceTags(recipes) {
  const tagsAppliance = []
  for (const recipe of recipes) {
    if (!tagsAppliance.includes(recipe.appliance)) {
      tagsAppliance.push(recipe.appliance)
    }
  }
  return tagsAppliance
}
function getIngredientsTags(recipes) {
  const tagsIngredients = []
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      if (!tagsIngredients.includes(ingredient.ingredient)) {
        tagsIngredients.push(ingredient.ingredient)
      }
    }
  }
  return tagsIngredients
}

// Fonction remplir dropdowns

export function displayTagsDropdown(recipes) {
  const listIngredientUl = document.getElementById('tags-ingredients')
  const ingredientsList = getIngredientsTags(recipes)
  for (const ingredients of ingredientsList) {
    const liIngredient = document.createElement('li')
    liIngredient.classList.add('dropdown-item')
    liIngredient.textContent = ingredients
    listIngredientUl.appendChild(liIngredient)
  }

  const listAppliancetUl = document.getElementById('tags-appliances')
  const applianceList = getApplianceTags(recipes)
  for (const appliances of applianceList) {
    const liAppliance = document.createElement('li')
    liAppliance.classList.add('dropdown-item')
    liAppliance.textContent = appliances
    listAppliancetUl.appendChild(liAppliance)
  }

  const listUstensilUl = document.getElementById('tags-ustensils')
  const ustansilList = getUstensilTags(recipes)
  for (const ustensils of ustansilList) {
    const liUstensil = document.createElement('li')
    liUstensil.classList.add('dropdown-item')
    liUstensil.textContent = ustensils
    listUstensilUl.appendChild(liUstensil)
  }
}

// fonction affichage recette

export function displayRecipes(recipes) {
  for (const recipe of recipes) {
    const recipesList = document.getElementById('card-recipe')
    const recipesElementTemplate = document.getElementById(
      'card-recipe-element'
    )
    const el = document.importNode(recipesElementTemplate.content, true)

    // el.getElementsByClassName('card').dataset.id = recipe.id

    el.querySelector('h5').textContent = recipe.name
    el.querySelector('strong').textContent = recipe.time + ' min'
    const containerIngredients = el.querySelector('ul')

    for (const elm of recipe.ingredients) {
      const ingredientElm = document.createElement('li')
      ingredientElm.classList.add('ingredient-recipe')

      ingredientElm.textContent =
        elm.ingredient + ' : ' + elm.quantity + ' ' + elm.unit

      if (elm.unit === 'gramme' || elm.unit === 'grammes') {
        ingredientElm.textContent =
          elm.ingredient + ' : ' + elm.quantity + ' ' + 'gr'
      }
      if (elm.unit === 'cuillères à soupe' || elm.unit === 'cuillère à soupe') {
        ingredientElm.textContent =
          elm.ingredient + ' : ' + elm.quantity + ' ' + 'CaS'
      }
      if (elm.unit === undefined) {
        ingredientElm.textContent = elm.ingredient + ' : ' + elm.quantity
      }
      if (elm.quantity === undefined && elm.unit === undefined) {
        ingredientElm.textContent = elm.ingredient
      }

      if (elm.ingredient === 'Viande hachée 1% de matière grasse') {
        ingredientElm.textContent =
          'Viande hachée' + ' : ' + elm.quantity + ' ' + 'gr'
      }
      if (elm.ingredient === 'Saucisse bretonne ou de toulouse') {
        ingredientElm.textContent =
          'Saucisse' + ' : ' + elm.quantity 
      }

      containerIngredients.appendChild(ingredientElm)
    }

    el.querySelector('p').textContent = recipe.description

    recipesList.appendChild(el)
  }
}

// Inclure champs de recherche dans dropdowns
// Faire la recherche
