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
    getUstensilTags(recipes)
    getApplianceTags(recipes)
    getIngredientsTags(recipes)
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
  // console.log(tagsUstensils)
}
function getApplianceTags(recipes) {
  const tagsAppliance = []
  for (const recipe of recipes) {
    if (!tagsAppliance.includes(recipe.appliance)) {
      tagsAppliance.push(recipe.appliance)
    }
  }
  // console.log(tagsAppliance)
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
  // console.log(tagsIngredients)
}
