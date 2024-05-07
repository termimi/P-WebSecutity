import express from "express";
import authRouter from "./routes/auth.mjs";
import createRouter from "./routes/createUser.mjs"
import userRouter from "./routes/users.mjs"


const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
    res.send("API REST of a eShopWebsite !");
});
app.use('/auth',authRouter);
app.use('/create',createRouter);
app.use('/users',userRouter);

// Démarrage du serveur
app.listen(port, () => {
    console.log('Server running on port 8080');
});

