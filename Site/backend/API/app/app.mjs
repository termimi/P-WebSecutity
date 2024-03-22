import express from "express";


const app = express();
const port = 8080;


app.get("/", (req, res) => {
    res.send("API REST of a eShopWebsite !");
});


// Démarrage du serveur
app.listen(port, () => {
    console.log('Server running on port 8080');
});

