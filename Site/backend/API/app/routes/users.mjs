import express from "express";
import { databaseConnection } from "../db/dbConnexion.mjs";
import { getPublicKeyFromFolder } from "./auth.mjs";
import jwt from "jsonwebtoken";

const router = express();

const decodedTokenFromHeader =(givenHeader)=>{
    const publicKey = getPublicKeyFromFolder();
    const givenToken = givenHeader.split(" ");
    const decodedToken = jwt.verify(givenToken[1], publicKey,{algorithm: 'RS256'});
    return decodedToken;
}
router.get('/:name',databaseConnection,async(req,res) =>{
    let nameOfUser = req.params.name
    const givenHeader = req.headers.authorization;
    const decodedToken = decodedTokenFromHeader(givenHeader);
    const tokenUserName = decodedToken.useNickName;
    const adminUserToken = decodedToken.useAdmin;
    console.log("adminnnn " + adminUserToken);
    if(tokenUserName != nameOfUser && adminUserToken != 1){
        res.status(403).json({ error: "Vous n'avez pas les permission d'accéder à cette ressource" });
    }
    else{
        const infoOfUserString = 'SELECT * FROM t_users WHERE useNickName = ?'
        try{
            const [dbResponse] = await req.connectionToDB.execute(infoOfUserString, [nameOfUser]);
            // affiche les donnée de l'utilisateur
            res.status(200).send(`Information de l'utilisateur ${nameOfUser} : ${JSON.stringify(dbResponse[0])} `);
        }
        catch(error){
            console.error(`Impossible de récupérer les informations de l'utilisateur  ${nameOfUser}`  + error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
export default router;

