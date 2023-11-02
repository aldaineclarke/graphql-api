const User = require('../../schema/user');
const JsonResponse = require('../../helpers/JsonResponse.helper');
const HttpStatusCode = require('../../helpers/StatusCodes.helper');
const { ValidationChain, body, validationResult } = require('express-validator');

class UserController{
    

    static async getAllUsers(req, res){
        const users = await User.find();
        return JsonResponse.success(res, "Successfully retrieved users", {users});
    }
    static getUserById(req, res){
        let id = req.params.id;
        
        
    }
    static updateUserData(req, res){


    }
    static DeleteUser(req, res){
        let id = req.params.id;
        


    }
}

module.exports = UserController;