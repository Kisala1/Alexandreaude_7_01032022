// Récupérer recettes
// Extraire les différents tags : ingredient (tableau d'objets),
//ustensils (chaîne de caractères), appliance (tableaux)

// Remplir les dropdown

// Gérer l'affichage des recettes

// Eventlistener sur tags, afficher le tag au-dessus du dropdown, filtrer les recettes
// Faire une variable des recettes filtrées
// Reprendre les tags des recettes filtrer et reremplir les dropdown
// Gérer l'affichage des recettes

// EventListener pour supprimer le tag
// faire une boucle qui check les tags restants et afficher les recettes

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
function getRandomNb() {
  return String(Math.floor(Math.random(1) * 10000))
}

function displayTagsDropdown(recipes) {
  const listIngredientUl = document.getElementById('tags-ingredients')
  const ingredientsList = getIngredientsTags(recipes)
  for (const ingredients of ingredientsList) {
    const liIngredient = document.createElement('li')
    liIngredient.setAttribute('id', 'igdts-' + getRandomNb())
    liIngredient.classList.add('dropdown-item')
    liIngredient.textContent = ingredients
    listIngredientUl.appendChild(liIngredient)
  }

  const listAppliancetUl = document.getElementById('tags-appliances')
  const applianceList = getApplianceTags(recipes)
  for (const appliances of applianceList) {
    const liAppliance = document.createElement('li')
    liAppliance.classList.add('dropdown-item')
    liAppliance.setAttribute('id', 'app-' + getRandomNb())
    liAppliance.textContent = appliances
    listAppliancetUl.appendChild(liAppliance)
  }

  const listUstensilUl = document.getElementById('tags-ustensils')
  const ustansilList = getUstensilTags(recipes)
  for (const ustensils of ustansilList) {
    const liUstensil = document.createElement('li')
    liUstensil.classList.add('dropdown-item')
    liUstensil.setAttribute('id', 'usl-' + getRandomNb())
    liUstensil.textContent = ustensils
    listUstensilUl.appendChild(liUstensil)
  }
  listUstensilUl.firstChild.setAttribute('id', 'tag1')
}

// fonction affichage recette

function displayRecipes(recipes) {
  for (const recipe of recipes) {
    const recipesList = document.getElementById('card-recipe')
    const recipesElementTemplate = document.getElementById(
      'card-recipe-element'
    )
    const el = document.importNode(recipesElementTemplate.content, true)
    el.getElementById('card').dataset.id = recipe.id
    el.querySelector('h5').textContent = recipe.name
    el.querySelector('strong').textContent = recipe.time + ' min'
    const containerIngredients = el.querySelector('ul')

    for (const elm of recipe.ingredients) {
      const ingredientElm = document.createElement('li')
      ingredientElm.classList.add('ingredient-recipe')

      ingredientElm.textContent =
        elm.ingredient + ': ' + elm.quantity + ' ' + elm.unit
      if (elm.unit === undefined) {
        ingredientElm.textContent = elm.ingredient + ': ' + elm.quantity
      }
      if (elm.quantity === undefined) {
        ingredientElm.textContent = elm.ingredient
      }
      containerIngredients.appendChild(ingredientElm)
    }

    el.querySelector('p').textContent = recipe.description

    recipesList.appendChild(el)
  }
}

// Fonction pour afficher le tag au-dessus des dropdowns

function displayTagsOnClick(recipes) {
  const tagSelector = document.getElementById('tagSelector')
  const tagsElts = document.getElementsByClassName('dropdown-item')
  for (const elt of tagsElts) {
    elt.addEventListener('click', (e) => {
      const tagEl = document.createElement('span')
      tagEl.classList.add('tag')
      tagEl.textContent = e.target.textContent
      const closeSymbol = document.createElement('i')
      closeSymbol.classList.add('bi', 'bi-x-circle')
      tagEl.appendChild(closeSymbol)
      tagSelector.appendChild(tagEl)

      
      closeTag(tagEl, closeSymbol)
    
      const target = e.target
      registerFilterWithTags(recipes, target)
    })
  }
}

// Enlever tag

function closeTag(tagEl, closeSymbol) {
  closeSymbol.addEventListener('click', () => {
    console.log('clic')
    tagEl.classList.add('tagClose')
  })
}

// Fonction pour filtrer les recettes par tag

function registerFilterWithTags(recipes, target) {
  const containerRecipes = document.getElementById('card-recipe')
  const tagsIngredients = document.getElementById('tags-ingredients')
  const tagsAppliances = document.getElementById('tags-appliances')
  const tagsUstensils = document.getElementById('tags-ustensils')
  const dropdownClosestOfTag = target.closest('ul').getAttribute('id')
  const dropdownClosestOfTagSplit = String(dropdownClosestOfTag.split())

  if (dropdownClosestOfTagSplit === 'tags-ingredients') {
    const recipeFilter = recipes.filter((el) =>
      el.ingredients.find((el) => el.ingredient === target.textContent)
    )

    refresh(containerRecipes, recipeFilter, tagsIngredients)
  }

  if (dropdownClosestOfTagSplit === 'tags-appliances') {
    const recipeFilter = recipes.filter((el) =>
      el.appliance.includes(target.textContent)
    )

    refresh(containerRecipes, recipeFilter, tagsAppliances)
  }

  if (dropdownClosestOfTagSplit === 'tags-ustensils') {
    const recipeFilter = recipes.filter((el) =>
      el.ustensils.includes(target.textContent)
    )

    refresh(containerRecipes, recipeFilter, tagsUstensils)
  }
}

// Fonction pour raffréchir recettes + tags des dropdowns

function refresh(containerRecipes, recipeFilter, listTags) {
  containerRecipes.innerHTML = ''
  displayRecipes(recipeFilter)
  listTags.innerHTML = ''
  displayTagsDropdown(recipeFilter)
}
// ajouter addeventlistener pour supprimer les tags
// Inclure champs de recherche dans dropdowns
// Faire la recherche
