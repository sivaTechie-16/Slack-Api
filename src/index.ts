import express, { Request, Response } from 'express';
import cors from 'cors'
import { checkConnection } from './dbConfig';

const app = express();

const port = 3000;

app.use(express.json());
app.use(cors())

app.get('/',(req:Request,res:Response)=>{
    res.json('this is / route')
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    checkConnection();
})