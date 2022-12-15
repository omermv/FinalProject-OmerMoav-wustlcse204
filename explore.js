let apiKey = "804dbeff69ea4e25a1051ae9714d9e63";
let searchForm = document.getElementById("search-form")
let searchFormInput = document.getElementById("search-box")
let maxResultsNumber = 50;
let searchResultsSection = document.getElementById("search-results-section")
let favoritesMealsButton = document.getElementById("favorites-meals");
let favoritesCloseButton = document.getElementById("close-favorites-btn")
let favoritesMeals = {}

searchForm.addEventListener("submit", SearchAPI)
favoritesMealsButton.addEventListener("click", handleFavoritesClick)
favoritesCloseButton.addEventListener("click", handleCloseFavorites)

function SearchAPI(event) {
    event.preventDefault();
    let keyword = searchFormInput.value
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var searchResultsObj = JSON.parse(this.responseText);
            console.log(searchResultsObj);
            renderSearchResults(searchResultsObj)
        }
    };
    xhttp.open("GET", "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + apiKey + "&query=" + keyword + "&number=" + maxResultsNumber);
    xhttp.send();
}

function renderSearchResults(searchResultsObj) {
    if (searchResultsObj.totalResults == 0) {
        window.alert("No results found... Try a different keyword!")
    }
    else {
        searchResultsSection.innerHTML = "";
        let resultsArray = searchResultsObj.results;
        let searchResultsGrid = "<ul class=\"search-results-grid\">";
        let currentResultHtml;
        let currentResultID;
        let currentResultName;
        let currentResultImage;
        for (i = 0; i < resultsArray.length; i++) {
            currentResultID = resultsArray[i].id;
            currentResultName = resultsArray[i].title;
            currentResultImage = resultsArray[i].image;
            currentResultHtml =
                "<li class=\"recipe-box\">" +
                "<a id=" + currentResultID + " class=meal-link href=\"#\">" + currentResultName + "</a>" + "<span class=favorite-star>&nbsp;&nbsp;" + ((favoritesMeals[currentResultID] == null) ? "&star;" : "&starf;") + "</span>" +
                "<img src=" + currentResultImage + " alt=\"\">" +
                "</li>"
            searchResultsGrid += currentResultHtml;
        }
        searchResultsGrid += "</ul>";
        searchResultsSection.innerHTML = searchResultsGrid;

        let mealsLinksArray = document.getElementsByClassName("meal-link");
        for (i = 0; i < mealsLinksArray.length; i++) {
            mealsLinksArray[i].addEventListener("click", HandleMealClick)
        }

        let mealsFavoriteStarsArray = document.getElementsByClassName("favorite-star")
        for (i = 0; i < mealsFavoriteStarsArray.length; i++) {
            mealsFavoriteStarsArray[i].addEventListener("click", HandleFavoriteStarClick)
        }
    }
}

function HandleMealClick(event) {
    let mealID = event.target.id;
    if (mealID.charAt(0) == "#") {
        mealID = mealID.slice(1);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var mealDataObj = JSON.parse(this.responseText);
            if (mealDataObj.spoonacularSourceUrl == null) {
                if (mealDataObj.sourceUrl == null) {
                    window.alert("Meal page is under construction :( Please try again later...")
                }
                else {
                    window.open(mealDataObj.sourceUrl, '_blank');
                }
            }
            else {
                window.open(mealDataObj.spoonacularSourceUrl, '_blank');
            }
        }
    };
    xhttp.open("GET", "https://api.spoonacular.com/recipes/" + mealID + "/information?apiKey=" + apiKey);
    xhttp.send();
}

function HandleFavoriteStarClick(event) {
    let favoritesList = document.getElementById("favorites-list");
    let currentMealID = event.target.previousSibling.id;
    let currentMealName = event.target.previousSibling.innerHTML;
    let currentMealLinkHTML = "<a id=#" + currentMealID + " class=meal-link href=\"#\" onClick=HandleMealClick(event)>" + currentMealName + "</a>"
    if (favoritesMeals[currentMealID] == null) {
        favoritesList.innerHTML += currentMealLinkHTML;
        favoritesMeals[currentMealID] = currentMealLinkHTML;
        event.target.innerHTML = "&nbsp;&nbsp;&starf;"
    }
    else {
        // console.log(document.querySelector("#favorites-list #" + currentMealID))
        let currentMealNode = document.getElementById("#" + currentMealID)
        console.log(currentMealNode)
        console.log(favoritesList)
        favoritesList.removeChild(currentMealNode)
        console.log(favoritesList)
        favoritesMeals[currentMealID] = null;
        event.target.innerHTML = "&nbsp;&nbsp;&star;"
    }
}

function handleFavoritesClick() {
    let favoritesContainer = document.getElementById("favorites-container");
    favoritesContainer.style.display = "block";
}

function handleCloseFavorites() {
    let favoritesContainer = document.getElementById("favorites-container");
    favoritesContainer.style.display = "none";
}