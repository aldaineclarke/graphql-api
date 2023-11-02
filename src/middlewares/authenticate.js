const { JsonResponse } = require("../helpers/JsonResponse.helper");
const HttpStatusCode = require("../helpers/StatusCodes.helper");
const jwt = require('jsonwebtoken');
module.exports.isAuthorized = (req, res, next)=>{
        const token = req.headers.authorization?.split(' ')[1]; // this will come over as 'Bearer `token-sent-by-user` we just need the token'
      
        if (!token) {
          return JsonResponse.error(res, "Unauthorized access attempted", ['No token provided'], HttpStatusCode.UNAUTHORIZED);
        }
        try{
            const decodedToken = jwt.verify(token, res.locals.app.appSecret);
            if(!decodedToken){
                return JsonResponse.error(res, "Unauthroized access attempted", ["Failed to authenticate token"], HttpStatusCode.UNAUTHORIZED);
            }
            req.user = decodedToken; // Attach user information to the request

        }catch(error){
            return JsonResponse.error(res, "Unable to process request", [error], HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
      
        next();
};