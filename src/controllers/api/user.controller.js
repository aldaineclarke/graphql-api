import {User, userStatusMap} from '../../schema/user.js';
import JsonResponse from '../../helpers/JsonResponse.helper.js';
import HttpStatusCode from '../../helpers/StatusCodes.helper.js';
import log from '../../middlewares/log.js';
import { getKeyByValue } from '../../helpers/Utility.helper.js';

export default class UserController{
    

    static getAllUsers = async (req, res)=>{
        const users = await User.find({isDeleted: {$ne: true}});
        let parsedUser = users.map((user)=>user.parseUserData());
        return JsonResponse.success(res, "Successfully retrieved users", {user:parsedUser});
    }
    static getUserById = async (req, res)=>{
        let id = req.params.id;
        try{
            let user = await User.findById(id).where({isDeleted:false});
            if(!user){
                return JsonResponse.error(res, "No matching records found",HttpStatusCode.NOT_FOUND)
            }
            return JsonResponse.success(res, "Successfully retrieved user", {user: user.parseUserData()})
        }catch(e){
            log.error(e);
            return JsonResponse.error(res, "Something went wrong", HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        
    }
    static updateUserData = async(req, res)=>{
        let id = req.params.id;
        try{
            let user = await User.findById(id).where({isDeleted:false});
            // Don't see a need to check if the body is empty since this will be done in the UserRequest class
            if(!user){
                return JsonResponse.error(res, "No matching records found", HttpStatusCode.NOT_FOUND)
            }
            let updatedUser = await User.findByIdAndUpdate(id, req.body, {new:true}); // returns the updated user document.
            // Should have a function that manages the response sent to the user. For example removing the password field.

            return JsonResponse.success(res, "Successfully updated user", {user: updatedUser.parseUserData()})
        }catch(e){
            log.error(e);
            return JsonResponse.error(res, "Something went wrong", [e], HttpStatusCode.INTERNAL_SERVER_ERROR);
        }

    }
    static deleteUser = async (req, res)=>{
        let id = req.params.id;
        try{
            let user = await User.findById(id).where({isDeleted:false});
            if(!user){
                return JsonResponse.error(res, "No Matching records found", HttpStatusCode.NOT_FOUND)
            }
            let updatedUser = await User.findByIdAndUpdate(id, {isDeleted: true});
            return JsonResponse.success(res, "Successfully deleted user");
        }catch(e){
            log.error(e);
            return JsonResponse.error(res, "Something went wrong", HttpStatusCode.INTERNAL_SERVER_ERROR);

        }


    }
}
