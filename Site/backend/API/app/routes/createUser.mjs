import {dbConnection} from "../db/dbConnexion.mjs";
import express from "express";
import { databaseConnection } from "../db/dbConnexion.mjs";
import crypto from 'crypto';
const router = express();
router.post('/',databaseConnection,async(req,res) =>{
    console.log(typeof crypto);
    let { username, password } = req.body;
    password = crypto.createHash('sha256').update(password).digest('hex');
    // vérifie si l'utilisateur existe
    const authenticationString = 'INSERT INTO t_users (useNickName, usePassWord) VALUES (?,?);'
    try{
        const [dbResponse] = await req.connectionToDB.execute(authenticationString, [username, password]);
        res.send(`Nouvelle utilisateur: ${username} créée`);
    }
    catch(error){
        console.error("Impossible de créer l'utilisateur " + username,error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;