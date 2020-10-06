module.exports = function(err, body){
    for(field in err.errors){
        switch(field){
            case "username" : body["usernameValidationError"] = err.errors["username"].message;
            break;
            case "email" : body["emailValidationError"] = err.errors["email"].message;
            break;
            case "password" : body["passwordValidationError"] = err.errors["password"].message;
            break;
            case "recipie" : body["recipieNameValidationError"] = err.errors["recipie"].message;
            break;
            case "description" : body["descriptionValidationError"] = err.errors["description"].message;
            break;
            case "keywords" : body["keywordValidationError"] = err.errors["keywords"].message;
            break;
            case "category" : body["categoryValidationError"] = err.errors["category"].message;
            break;
            case "procedure" : body["procedureValidationError"] = err.errors["procedure"].message;
            break;
            case "recipieImage" : body["fileError"] = err.errors["recipieImage"].message;
            break;
        }
    }
}