var request = require("request");
var db = require("../models");


// function to construct URL passed for API
function constructURL(paramObject){
    
    if (paramObject.foods){
        var queryURL = "http://api.edamam.com/search?app_id=adc6f730&app_key=1c36192c8df25e1cdb4a6f66853b9236&q=";
        var foods = paramObject.foods.toString();
        queryURL += foods;
        if (paramObject.calories){
            var calories = parseInt(paramObject.calories);
            if(calories){
                queryURL += "&calories=";
                queryURL += "lte " + calories;
            }else{
                throw "calorie needs to be an integer";
            }
        }
        if (paramObject.health){
            if (typeof paramObject.health !== "string"){
                throw "health needs to be a String";
            }else{
                queryURL += "&health=";
                queryURL += paramObject.health;
            }
        }

        if (paramObject.recipeCount){
            var recipeCount = parseInt(paramObject.recipeCount);
            if (recipeCount){
                queryURL += "&to=";
                queryURL += recipeCount;
            }else{
                throw "recipeCount needs to be an integer";
            }
        }
        return queryURL;
    }else{
        throw "foods property is required"
    }
}


module.exports = function(app){
    // Grabs object passed and calls edamam api
    /* Object being passed will have property foods (required), calories, recipeCount, health
    */
    app.post("/api/recipesearch", async(req, res)=>{
        try{
            const queryUrl = constructURL(req.body)

            app.get(queryUrl, function (error, response, body) {
                if (error) {console.log('error:', error);} // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                if (JSON.parse(body).count === 0){
                    res.send("No Recipes Found");
                }else{
                    res.send(JSON.parse(body).hits);
                }
            });
        }catch (err){
            res.send(err);
        }
    });

}