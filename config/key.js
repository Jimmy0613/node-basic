import mongoURI_dev from './dev.js';
import mongoURI_prod from './prod.js';

let MONGO_URI;

if (process.env.NODE_ENV === 'production') {
    MONGO_URI = mongoURI_prod;
} else {
    MONGO_URI = mongoURI_dev;
}

export default MONGO_URI;