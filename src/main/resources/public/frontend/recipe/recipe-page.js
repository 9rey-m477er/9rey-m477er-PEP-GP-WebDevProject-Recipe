/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const recipeAddInput = document.getElementById("add-recipe-name-input");
    const recipeAddText = document.getElementById("add-recipe-instructions-input");
    const recipeUpdateInput = document.getElementById("update-recipe-name-input");
    const recipeUpdateText = document.getElementById("update-recipe-instructions-input");
    const recipeDeleteInput = document.getElementById("delete-recipe-name-input");
    const recipeList = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logout = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const recipeAddSubmit = document.getElementById("add-recipe-submit-input");
    const recipeUpdateSubmit = document.getElementById("update-recipe-submit-input");
    const recipeDeleteSubmit = document.getElementById("delete-recipe-submit-input");

    if(sessionStorage.getItem("auth-token")){
        logout.hidden = false;
    }

    if(sessionStorage.getItem("is-admin") === "true"){
        adminLink.hidden = false;
    }

    recipeAddSubmit.onclick = addRecipe;
    recipeDeleteSubmit.onclick = deleteRecipe;
    recipeUpdateSubmit.onclick = updateRecipe;
    searchButton.onclick = searchRecipes;
    logout.onclick = processLogout;

    getRecipes();

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const search = searchInput.value;
        try{
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
            const response = await fetch(`${BASE_URL}/recipes?name=${search}`, responseOptions);
            const results = await response.json();
            refreshRecipeList();
        }catch(error) {
            console.log(error);
            alert("An error occurred");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const addedName = recipeAddInput.value;
        const addedInstructions = recipeAddText.value;

        if(addedName == "" || addedInstructions == ""){
            alert("Missing either name or instructions");
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
                body: JSON.stringify({name: addedName, instructions: addedInstructions})
            }
            const response = await fetch(`${BASE_URL}/recipes`, responseOptions);
            recipeAddInput.value = "";
            recipeAddText.value = "";
            getRecipes();
        } catch(error) {
            console.log(error);
            alert("An error occurred");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const updatedName = recipeUpdateInput.value;
        const updatedInstructions = recipeUpdateText.value;

        if(updatedName == "" || updatedInstructions == ""){
            alert("Missing either name or instructions");
            return;
        }

        try {
            const target = recipes.find(r => r.name === updatedName);
            if(!target){
                alert("Recipe not found");
                return;
            }
            const id = target.id;

            const responseOptions = {
                method: "PUT",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({name: updatedName, instructions: updatedInstructions})
            }
            const response = await fetch(`${BASE_URL}/recipes/${id}`, responseOptions);
            recipeUpdateInput.value = "";
            recipeUpdateText.value = "";
            getRecipes();
        } catch(error) {
            console.log(error);
            alert("An error occurred");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const recipeName = recipeDeleteInput.value;

        try {
            const target = recipes.find(r => r.name === recipeName);
            if(!target){
                alert("Recipe not found");
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
            const response = await fetch(`${BASE_URL}/recipes/${id}`, responseOptions);
            recipeDeleteInput.value = "";
            getRecipes();
        } catch(error) {
            console.log(error);
            alert("An error occurred");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
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
            const response = await fetch(`${BASE_URL}/recipes`, responseOptions);
            const results = await response.json();
            recipes = results;
            refreshRecipeList();
        } catch(error) {
            console.log(error);
            alert("An error occurred");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        //recipes.length = 0;
        recipes.forEach(recipe => {
            let li = document.createElement("li");
            li.innerText = recipe.name + " - " + recipe.instructions;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
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
            }
            const response = await fetch(`${BASE_URL}/logout`, responseOptions);
            if(response.ok){
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else {
                alert("Logout failed");
            }
        } catch(error) {
            console.log(error);
            alert("An error occurred");
        }
    }

});
