import express, { Request, Response } from 'express';
import cors from 'cors'
import { checkConnection } from './dbConfig';
import router from './Routes/routes';
import { app as myApp } from "./Services/services" 


const app = express();

const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded())

app.use('/api',router)

app.get('/',(req:Request,res:Response)=>{
    res.json('this is / route')
})


app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    checkConnection();

})
myApp.start();