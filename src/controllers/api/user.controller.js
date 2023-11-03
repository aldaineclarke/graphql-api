import {User} from '../../schema/user.js';
import JsonResponse from '../../helpers/JsonResponse.helper.js';
import HttpStatusCode from '../../helpers/StatusCodes.helper.js';
import pkg from 'express-validator';
const { ValidationChain, body, validationResult } = pkg;

export default class UserController{
    

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
