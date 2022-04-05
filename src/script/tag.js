import { displayTagsDropdown, displayRecipes } from './index.js'

// Fonction pour afficher le tag au-dessus des dropdowns

export function displayTagsOnClick(recipes) {
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
  const ulsDropdowns = [tagsIngredients, tagsAppliances, tagsUstensils]

  if (dropdownClosestOfTagSplit === 'tags-ingredients') {
    const recipeFilter = recipes.filter((el) =>
      el.ingredients.find((el) => el.ingredient === target.textContent)
    )

    refresh(containerRecipes, recipeFilter, ulsDropdowns)
  }

  if (dropdownClosestOfTagSplit === 'tags-appliances') {
    const recipeFilter = recipes.filter((el) =>
      el.appliance.includes(target.textContent)
    )

    refresh(containerRecipes, recipeFilter, ulsDropdowns)
  }

  if (dropdownClosestOfTagSplit === 'tags-ustensils') {
    const recipeFilter = recipes.filter((el) =>
      el.ustensils.includes(target.textContent)
    )

    refresh(containerRecipes, recipeFilter, ulsDropdowns)
  }
}

function refresh(containerRecipes, recipeFilter, ulsDropdowns) {
  containerRecipes.innerHTML = ''
  displayRecipes(recipeFilter)

  for (const ul of ulsDropdowns) {
    ul.innerHTML = ''
  }

  displayTagsDropdown(recipeFilter)
  displayTagsOnClick(recipeFilter)
}
