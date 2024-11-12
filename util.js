const express = require("express")
const { sign, verify } = require("jsonwebtoken")


/**
 * 
 * verifies the token and return null if anythin bad happen or return the token content
 * @param {express.Request} req 
 * @param {Array<Number>} allowedAuthories 
 * @returns token content or null
 */
function checkAuthority(req,allowedAuthories) {
    let retVal = new Object()
    try {


        if (req.headers.authorization.length < 1)
            throw "invalid token or no token at all"
        else {
            verify(req.headers.authorization, process.env.password, (e, d) => {
                console.log(d);
                if (e)
                    throw "invalid token"
                else retVal = d

            })

            if(allowedAuthories.includes(Number(retVal.l))){
                return retVal;
            }else{
                return null;
            }

        }

    } catch (error) {

        return null
    }

}


module.exports={

    "checkAuthority":checkAuthority
}