import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

const userSchema = Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
        //비밀번호를 암호화시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
    
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567  ==  암호화된 비밀번호 ??
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.genToken = async function(cb) {
    let user = this;

    //jwt로 토큰 생성하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    await user.save()
        .then((user) => cb(null, user))
        .catch(err => cb(err))
}

const User = model('User', userSchema);

export default  User ;
