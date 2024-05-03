import express from "express";
import { databaseConnection } from "../db/dbConnexion.mjs";
import crypto from 'crypto';
const router = express();

const getSalt =(lengthOfSalt) =>{
    return crypto.randomBytes(Math.ceil(lengthOfSalt / 2))
        .toString('hex')
        .slice(0, lengthOfSalt);
}
const getLengthOfSalt =() =>{
    return Math.floor(Math.random() * 25);
}
router.post('/',databaseConnection,async(req,res) =>{
    // récupère les infos du body
    let { username, password,admin } = req.body;
    const lengthOfSalt = getLengthOfSalt();
    const salt = getSalt(lengthOfSalt);
    // création d'un utilisateur non admin dans le cas ou le champs n'est pas définis
    if(admin === undefined){
        admin = 0;
    }
    if(admin > 1){
        res.status(500).json({ error: "La valeur de admin ne peut pas dépasser 1" });
    }
    password = crypto.createHmac('sha256',salt).update(password).digest('hex');
    // vérifie si l'utilisateur existe
    const authenticationString = 'INSERT INTO t_users (useNickName, usePassWord,useAdmin,useSalt) VALUES (?,?,?,?);'
    try{
        const [dbResponse] = await req.connectionToDB.execute(authenticationString, [username, password,admin,salt]);
        res.send(`Nouvelle utilisateur: ${username} créée`);
    }
    catch(error){
        console.error("Impossible de créer l'utilisateur " + username,error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;