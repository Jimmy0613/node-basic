import express from 'express';
import { connect } from 'mongoose';
import pkg from 'body-parser';
import cookieParser from 'cookieparser';

import MONGO_URI from './config/key.js';
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


app.post('/login', async (req, res) => {
    //요청된 이메일을 데이터베이스에서 찾는다.
    await User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.json({
                    loginSuccess: false,
                    message: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }

            //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) {
                    return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
                }

                //비밀번호까지 맞다면 Token을 생성한다.
                user.genToken((err, user) => {
                    if (err) return res.status(400).send(err);

                    //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, ...
                    res.cookie('x_auth', user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
                })
            })
            
        })
        .catch(err => res.json({loginSuccess: false, err}))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})