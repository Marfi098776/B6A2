import express, { Request, Response } from "express"
import config from "./config";
const app = express();
const port = config.port;



app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Batch-6 Assignment-12 !')
})

app.post("/", (req: Request, res: Response)=> {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "API is working",
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
