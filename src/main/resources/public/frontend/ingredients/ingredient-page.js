/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const addIngredientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const addedName = addIngredientNameInput.value;

    if(addedName == ""){
        alert("Missing ingredient name");
        return;
    }

    try {
        const responseOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({name: addedName})
        }
        const response = await fetch(`${BASE_URL}/ingredients`, responseOptions);
        addIngredientNameInput.value = "";
        getIngredients();
    } catch(error) {
        console.log(error);
        alert("An error occurred");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const responseOptions = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }
        const response = await fetch(`${BASE_URL}/ingredients`, responseOptions);
        const results = await response.json();
        ingredients = results;
        refreshIngredientList();
    } catch(error) {
        console.log(error);
        alert("An error occurred");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete logic here
    const ingredient = deleteIngredientNameInput.value;
    try {
        const target = ingredients.find(i => i.name === ingredient);
        if(!target){
            alert("Ingredient not found");
            return;
        }
        const id = target.id;

        const responseOptions = {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }
        const response = await fetch(`${BASE_URL}/ingredients/${id}`, responseOptions);
        deleteIngredientNameInput.value = "";
        getIngredients();
    } catch(error) {
        console.log(error);
        alert("An error occurred");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    ingredients.forEach(ingredients => {
        let li = document.createElement("li");
        li.innerText = ingredients.name;
        ingredientListContainer.appendChild(li);
    });
}
