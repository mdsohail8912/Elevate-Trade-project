import express  from "express";
import { PORT } from "./config.js";
const Link = ''
import mongoose from 'mongoose';
import router from "./routes/routes.js";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (request, response)=> {
    console.log(request)
    return response.status(200).send('hello');
});

app.use('/product', router);

mongoose
    .connect(Link)
    .then(()=>{
        console.log("connected")
        app.listen(PORT, ()=> {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });
