import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import studentRouter from './routes/student.route.js';
import professortRouter from './routes/professor.route.js';
import projectRouter from './routes/project.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('DB is connected');
}).catch((err)=>{
    console.log(err);
});

const app = express();


app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

app.use(express.json());
app.use(cors());

app.use('/api/auth',userRouter)
app.use('/api/student',studentRouter)
app.use('/api/professor',professortRouter)
app.use('/api/project',projectRouter)