import {User, userGenderMap, userRoleMap, userStatusMap} from '../../schema/user.js';
import JsonResponse from '../../helpers/JsonResponse.helper.js';
import HttpStatusCode from '../../helpers/StatusCodes.helper.js';
import log from '../../middlewares/log.js';
import { getKeyByValue } from '../../helpers/Utility.helper.js';
import AWSStorage from "../../providers/storage.js";
export default class UserController{
    
    
    static getAllUsers = async (req, res)=>{
        // User should pass over role or status as the String instead of the key/id
        let status = req.query.status;
        let role = req.query.role;
        let{page = 1, limit = 10} = req.query;
        let sortField = req.query.sortField || "_id";
        let sortOrder = req.query.sortOrder || "des";
        const sortObj = {};
        sortObj[sortField] = sortOrder === "asc" ? 1 : -1;
        status = (status && typeof(status) == 'string') ? status.toUpperCase() : undefined;
        role = (role && typeof(role) == 'string') ? role.toUpperCase() : undefined;
        status = getKeyByValue(userStatusMap, status); // returns the key or undefined. 
        role = getKeyByValue(userRoleMap, role);
        const searchQuery = {
            first_name : req.query.first_name,
            last_name: req.query.last_name,
            email: req.query.email,
            role: req.query.role,
            status:req.query.status,

        };

        let searchCriterias = [];
        //remove the params without a value.
        Object.keys(searchQuery).forEach((item)=>{
            if(searchQuery[item] == undefined || searchQuery[item] == ""){
                delete searchQuery[item]
            }
            // boolean cannot do regex operations, hence the need to format this differently
            if(searchQuery[item] == "true" || searchQuery[item] == "false"){
                searchCriterias.push({[item]: searchQuery[item]});
                delete searchQuery[item];
            }
        });
        //formata fhte query for partial search of the database
        Object.keys(searchQuery).forEach((search)=>{
            if(search == "role"){
                searchCriterias.push({"role": {$eq: searchQuery[search]}})
            }else if(search == "status"){
                searchCriterias.push({"status": {$eq: searchQuery[search]}})
            }else{
                searchCriterias.push({
                    [search]: {$regex: searchQuery[search], $options: "i"}
                })
            }
        })
        let $facet = {
            metadata: [
                {$count: "total"},
                {$addFields: {current_page: page}}
            ],
            users: [
                {$sort: sortObj},
                {$skip: (page - 1) * limit},
                {$limit: limit},
                {$project: {password: 0}}
            ]

        }
        let pipeline = [];
        if(searchCriterias.length > 0){
            pipeline = [
                ...searchCriterias.map((result)=>{
                    return {$match: result}
                }),
                {$match: {isDeleted: {$ne: true}}},
                {$facet: $facet}
            ]
        }else{
            pipeline = [
                {$match: {isDeleted: {$ne: true}}},
                {$facet: $facet}
            ]
        }

        const aggregatedUsers = await User.aggregate(pipeline);
        aggregatedUsers[0].users = this.parseUsers(aggregatedUsers[0].users)
        return JsonResponse.success(res, "Successfully retrieved users", {...aggregatedUsers[0]});
    }
    static getUserById = async (req, res, next)=>{
        let id = req.params.id;
        try{
            let user = await User.findById(id).where({isDeleted:false});
            if(!user){
                return JsonResponse.error(res, "No matching records found",HttpStatusCode.NOT_FOUND)
            }
            return JsonResponse.success(res, "Successfully retrieved user", {user: user.parseUserData()})
        }catch(e){
            next(e);
        }
        
    }
    static updateUserData = async(req, res, next)=>{
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
            next(e);
        }
    }
    static deleteUser = async (req, res,next)=>{
        let id = req.params.id;
        try{
            let user = await User.findById(id).where({isDeleted:false});
            if(!user){
                return JsonResponse.error(res, "No Matching records found", HttpStatusCode.NOT_FOUND)
            }
            let updatedUser = await User.findByIdAndUpdate(id, {isDeleted: true});
            return JsonResponse.success(res, "Successfully deleted user");
        }catch(e){
            next(e);
        }

    }
    static updateUserPhoto = async(req, res, next)=>{
        let photo = req.files.profile_image;
        let userId = req.body.user_id;
        try{
            let user = await User.findById(userId).where({isDeleted:{$ne:true}});
            if(!user){
                return JsonResponse.error(res, "No matching records found", ["Unable to update user profile image, user does not exist"],HttpStatusCode.NOT_FOUND)
            }
            // gets the previous image location on AWS to delete.
            // let prevImage = user.profile_image;
            // This line will assign location of file to the profile image of the user if it's success.
            // user.profile_image = await AWSStorage.uploadFile(photo);
            // Deletes the previous image of the user that was set. 
            // await AWSStorage.deleteFile(user.profile_image);
            return JsonResponse.success(res, "Successfully update profile");

        }catch(e){
            next(e);
        }
    }
    static parseUsers = (userList = [])=>{
        return userList.map((userObj) =>{
            let status = userStatusMap.get(userObj.status);
			let role = userRoleMap.get(userObj.role_id);
			userObj.role_id = undefined;
			userObj.password = undefined;
			userObj.isDeleted = undefined;
			let gender = userGenderMap.get(userObj.gender);
			return userObj = {
				...userObj,
				role,
				status,
				gender
			}
        });
    }


}
