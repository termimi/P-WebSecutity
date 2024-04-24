import mysql from "mysql2/promise";

const dbConfig = {
    host: 'db',
    user:'root',
    password:'root',
    database:'db_webSecurity'
};

export const dbConnection = async() => {
    try{
        const connect = await mysql.createConnection(dbConfig);
        console.log("Connexion établie")
        return connect;
    }
    catch(error){
        console.error("Impossoble de se connecter à la connexion", error);
        throw error;
    }
};
