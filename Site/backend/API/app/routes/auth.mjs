import {dbConnection} from "../db/dbConnexion.mjs";
import express from "express";
import { databaseConnection } from "../db/dbConnexion.mjs";
const router = express();
import crypto from 'crypto';


router.post('/', databaseConnection, async (req,res) =>{
    // prend les infos du body
    let { username, password } = req.body;
    // hashage du mot de passe pour le déchifrage
    password = crypto.createHash('sha256').update(password).digest('hex');
    // vérifie si l'utilisateur existe
    const authenticationString = 'SELECT * FROM t_users WHERE useNickName = ? AND usePassWord = ?'
    try{
        const [dbResponse] = await req.connectionToDB.execute(authenticationString, [username, password]);
        if(dbResponse.length > 0){
            res.send(`Utilisateur: ${username} connecté`);
        }
        else{
            console.log(`Erreur lors de la connexion`);
            res.status(401).json({message:"Le nom d'utilisateur ou le mot de passe sont incorrect"});
        }
    }
    catch(error){
        console.error("Une erreur d'authentification est survenue",error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;