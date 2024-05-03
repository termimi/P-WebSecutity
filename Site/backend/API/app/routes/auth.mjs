import {dbConnection} from "../db/dbConnexion.mjs";
import express from "express";
import { databaseConnection } from "../db/dbConnexion.mjs";
const router = express();
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";


const getPrivateKeyFromFolder =() =>{
    // obtient le dossier ou se trouve l'app
    const _fileName = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_fileName);
    // obtient le chemin du dossier
    const folderPath = path.join(_dirname, '../keys');
    // obtient le chemin du fichier
    const filePath = path.join(folderPath,"/privkey.pem");
    // lis le fichier
    const privateKey = fs.readFileSync(filePath);
    return privateKey;
}

const getPublicKeyFromFolder =() =>{
    // obtient le dossier ou se trouve l'app
    const _fileName = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_fileName);
    // obtient le chemin du dossier
    const folderPath = path.join(_dirname, '../keys');
    // obtient le chemin du fichier
    const filePath = path.join(folderPath,"/pubkey.pem");
    // lis le fichier
    const publicKey = fs.readFileSync(filePath);
    return publicKey;
}
router.post('/', databaseConnection, async (req,res) =>{
    // prend les infos du body
    let { username, password } = req.body;
    // récupère la clef privée
    const privateKey = getPrivateKeyFromFolder();
    //recuperation du sel de l'utilisateur
    const getSaltString = 'SELECT useSalt FROM t_users WHERE useNickName = ?'
    try{
        // obtention du sel de l'utilisateur
        const [UserSalt] = await req.connectionToDB.execute(getSaltString, [username]);
        if(UserSalt[0].useSalt === undefined || UserSalt[0].useSalt === null){
            res.status(401).json({message:"L'utilisateur n'est pas enregistré"});
        }
        let salt = UserSalt[0].useSalt;
        // hashage du mot de passe pour le déchifrage
        password = crypto.createHmac('sha256',salt).update(password).digest('hex');
    }
    catch(error){
        console.error("Impossible de recuperer le sel",error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
    // vérifie si les informations de l'utilisateur sont correct
    const authenticationString = 'SELECT * FROM t_users WHERE useNickName = ? AND usePassWord = ?'
    try{
        const [dbResponse] = await req.connectionToDB.execute(authenticationString, [username, password]);
        if(dbResponse.length > 0){
            // todo ajouter admin dans le payload
            //Token
            const token = jwt.sign({userName: dbResponse[0].useNickName, admin: dbResponse[0].useAdmin },privateKey,{ algorithm: 'RS256' },{ expiresIn: 60 * 60 });
            res.status(200).json({message:"authentification réuissie" ,token: token});
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