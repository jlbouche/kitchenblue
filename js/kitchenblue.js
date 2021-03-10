// This function is called automatically after the web page is done loading

$(document).ready(function() {
    // add an event listener (performSearch) to the form
    $("#query-form").submit(function(event) { performSearch(event); });
});
  
// These websites no longer work but are still returned by the recipe puppy
  
var defunctDomains = [
    "kraftfoods.com",
    "cookeatshare.com",
    "find.myrecipes.com"
];

// This function checks to see if a URL contains the domain of any of the
// defunctDomains above

function isADefunctSite(sampleSite) {

    let found = false;
  
    defunctDomains.forEach(
      function (item, index) {
        if (sampleSite.includes(item)) { found = true; }
      }
    );
  
    return found;
  
}

// This function turns the results that is returned into HTML elements
// to display on the web page

function formatSearchResults(jsonResults) {

    let jsonObject = JSON.parse(jsonResults);
    let siteCount = 0;
  
    if (jsonObject.results.length == 0) { 
      setNotFoundMessages(); 
    } 
    else { 
  
      $("#search-results-heading").text("Search Results");
      let formatedText = "";
  
      jsonObject.results.forEach(
        function(item, index) {
  
          if (isADefunctSite(item.href)) { return; } 
          siteCount++; 
  
          let thumbnail = item.thumbnail;
          if (thumbnail == "") { thumbnail = "https://www.nicepng.com/png/detail/304-3040148_foodtong-chef-icon-epens-box-tentara-pelajar.png"; }  // Task 5, Part 3, display images/generic_dish.jpg if thumbnail is empty
  
          const href = item.href;
  
          formatedText += "<div class='dish-image-div'><a " + " href='" + href + "' target='_blank'><img class='dish-image' width='80' src='" + thumbnail + "' alt='recipe picture, link to recipe page'></a></div>";
          formatedText += "<div " + "class='dish-title-div'><a href='" + href + "' target='_blank'>" + item.title + "</a></div>";
          formatedText += "<div class='dish-ingredients-div'>Main ingredients: " + item.ingredients + "</div>";
        }
      );
  
      if (siteCount > 0) { 
        $("#results").html(formatedText);
        } 
      else { 
        setNotFoundMessages(); 
      } 
    } 
  
}

// This functions handles sending off the search request as well as
// error and success handling when the request calls back

function performSearch(event) {

    // Variable to hold request
    let request;
  
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();
  
    // Abort any pending request
    if (request) {
        request.abort();
    }
    // setup some local variables
    let $form = $(this);
  
    // disable the inputs and buttons for the duration of the request.
    setFormDisabledProps(true);
  
    $("#search-results-heading").text("Searching ...");
    $("#results").text("");
  
    // Send the request

    request = $.ajax({
        url: "https://skycors.skyroute66.com/?target=" + "http://www.recipepuppy.com/api/",
        type: "GET",
        data: { i: $("#ingredients").val(), q: $("#contains").val() }
    });

  // Callback handler for success

  request.done(function (response, textStatus, jqXHR){
    formatSearchResults(response);
});

// Callback handler for failure

request.fail(function (jqXHR, textStatus, errorThrown){
    $("#search-results-heading").text("An error occurred. Please try again.");
    $("#results").text("");
});

// Callback handler that will be called in any case

request.always(function () {
    // Reenable the inputs
    setFormDisabledProps(false);
});

}

// This function clears the search results and the heading "Search Results"

function resetResults() {
  $("#search-results-heading").text("");
  $("#results").text("");
}

// This function checks the user input fields for any unacceptable characters
// and removes them if found

function sanitizeInputs() {
    let str = $("#ingredients").val();
    str = str.replace(/[^a-zA-Z,]/gim, "");
    str = str.trim();
    $("#ingredients").val(str);

    str = $("#contains").val();
    str = str.replace(/[^a-zA-Z]/gim, "");
    str = str.trim();
    $("#contains").val(str);
}

// This function disables the text fields and the two buttons

function setFormDisabledProps(statusToSet) {
  document.getElementById("ingredients").disabled = statusToSet;
  document.getElementById("contains").disabled = statusToSet;
  document.getElementById("resetButton").disabled = statusToSet;
  document.getElementById("searchButton").disabled = statusToSet;
}

// This function sets the result heading to "no recipes found" and clear the
// existing search results, if there are any

function setNotFoundMessages() {
$("#search-results-heading").text("No recipes found, please change search criteria.");
$("#results").text("");
}

// Copyright (C) Coursera 2020 Harrison Kong