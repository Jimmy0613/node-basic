import express from 'express';
import pkg from 'body-parser';
import MONGO_URI from './config/key.js';
import { connect } from 'mongoose';
import User from './models/User.js';

const { urlencoded, json } = pkg;

const app = express()
const port = 5000
const mongoUri = MONGO_URI;

//application/x-www-form-urlencoded
app.use(urlencoded({extended: true}));

//application/json
app.use(json());

connect(mongoUri, {}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! Hi~~')
})

app.post('/register', async (req, res) => {

    // 회원가입에 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);

    await user.save()
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch((err)=>{
            res.json({ success: false, err })
        })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})