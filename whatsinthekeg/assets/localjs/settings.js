var beers;
initializePage();

function initializePage(){
    getAllBeers();
    powerAllDropdowns();
}

//Get all beers
function getAllBeers(){
    $.ajax({
        url: window.apiURL,
        type: 'get',
        async: false,
        success: function(data) {
            beers = data;
        } 
    });
}

//Power dropdowns
function powerAllDropdowns(){
    powerOptions(techBeerOptions);
    powerOptions(editBeerOptions);
    powerOptions(jtBeerOptions);
    powerOptions(deleteBeerOptions);
}

function powerOptions(dropdown){
    clearCurrentOptions(dropdown);
    var i = 0;
    while(i < beers.length){
        var $option = $("<option>", {id: beers[i].id});
        $option.html(beers[i].name);
        addOptionTo(dropdown, $option);
        
        if (dropdown != deleteBeerOptions){
            checkIfCurrent(dropdown, beers[i]);
        }

        i++;
    }
}
//Function for clearing the current options of a dropdown
function clearCurrentOptions(dropdown){
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }
}
//Function for adding onto dropdown
function addOptionTo(location, option){
    $(location).append(option);
    return false;
}
//Function for selecting current option by default
function checkIfCurrent(dropdown, beer){
    if (dropdown == techBeerOptions){
        if(beer.currentTechBeer == "true"){
            $(dropdown).val(beer.name);
        }
    }
    if (dropdown == editBeerOptions){
        if(beer.currentEditBeer == "true"){
            $(dropdown).val(beer.name);
        }
    }
    if (dropdown == jtBeerOptions){
        if(beer.currentJtBeer == "true"){
            $(dropdown).val(beer.name);
        }
    }
}


//Create new beers
$('#createNewBeer').click(function(){
    var name = $('#newBeerName').val();
    var imgurl = $('#newBeerImage').val();
    var website = $('#newBeerWebsite').val();
    $.ajax({
        url: window.apiURL+'/create/?name='+name+'&imgurl='+imgurl+'&website='+website+'&lastOnTap=never',
        type: 'get',
        async: false,
        success: function(data) {
            console.log(data);
            $('#newBeerAdded').fadeIn();
            $('#newBeerName').val('');
            $('#newBeerImage').val('');
            $('#newBeerWebsite').val('');
            initializePage();
        },
        error: function(data){
            $('#newBeerFailed').fadeIn();
            $('#newBeerName').val('');
            $('#newBeerImage').val('');
            $('#newBeerWebsite').val('');
        } 
    });    
});

//Delete beers
$('#deleteBeer').click(function(){
    var beerID = $('#deleteBeerOptions').children(":selected").attr("id");
    $.ajax({
        url: window.apiURL+'/destroy/'+beerID,
        type: 'get',
        async: false,
        success: function(data) {
            $('#deleteBeerConfirmed').fadeIn();
            initializePage();
        },
        error: function(data){
            $('#deleteBeerFailed').fadeIn();
        } 
    });    
});

//Update Beers!
$('#updateTechBeer').click(function(){
    removeCurrentBeer("tech");
    var beerID = $('#techBeerOptions').children(":selected").attr("id");
    $.ajax({
        url: window.apiURL+'/update/'+beerID+'?currentTechBeer=true',
        type: 'get',
        async: false,
        success: function(data) {
            $('#techBeerUpdated').fadeIn();
        },
        error: function(data) {
            $('#techBeerUpdateFailed').fadeIn();
            console.log(data);
        }
    });
});
$('#updateEditBeer').click(function(){
    removeCurrentBeer("edit");
    var beerID = $('#editBeerOptions').children(":selected").attr("id");
    $.ajax({
        url: window.apiURL+'/update/'+beerID+'?currentEditBeer=true',
        type: 'get',
        async: false,
        success: function(data) {
            $('#editBeerUpdated').fadeIn();
        },
        error: function(data) {
            $('#editBeerUpdateFailed').fadeIn();
        }
    });
});
$('#updateJtBeer').click(function(){
    removeCurrentBeer("jt");
    var beerID = $('#jtBeerOptions').children(":selected").attr("id");
    $.ajax({
        url: window.apiURL+'/update/'+beerID+'?currentJtBeer=true',
        type: 'get',
        async: false,
        success: function(data) {
            $('#jtBeerUpdated').fadeIn();
        },
        error: function(data) {
            $('#jtBeerUpdateFailed').fadeIn();
        }
    });
});

//Remove the current beer to make way for the new one to get set
function removeCurrentBeer(floor){
    var i = 0;
    while(i < beers.length){
        if (floor == "tech" && beers[i].currentTechBeer == "true"){
            setCurrentToFalse(floor, beers[i].id);
        }
        else if(floor == "edit" && beers[i].currentEditBeer == "true"){
            setCurrentToFalse(floor, beers[i].id);
        }
        else if(floor == "jt" && beers[i].currentJtBeer == "true"){
            setCurrentToFalse(floor, beers[i].id);
        }
        i++;
    }
    function setCurrentToFalse(floor, currentBeerID){
        var updateURL = "";

        if (floor == "tech"){
            updateURL = window.apiURL+'/update/'+currentBeerID+'?currentTechBeer=false';
        }

        else if (floor == "edit"){
            updateURL = window.apiURL+'/update/'+currentBeerID+'?currentEditBeer=false';
        }

        else if (floor == "jt"){
            updateURL = window.apiURL+'/update/'+currentBeerID+'?currentJtBeer=false';
        }

        $.ajax({
            url: updateURL,
            type: 'get',
            async: false,
            success: function(data) {
                setLastOnTapForPreviousBeer(data.id, data.updatedAt);
            } 
        });
    }
    function setLastOnTapForPreviousBeer(previousBeerID, dateRemovedFromKeg){
        $.ajax({
            url: window.apiURL+'/update/'+previousBeerID+'?lastOnTap='+dateRemovedFromKeg,
            type: 'get',
            async: false,
            success: function(data) {
                console.log(data);
            } 
        });
    }
}


//sorts in alphabetical order
function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}