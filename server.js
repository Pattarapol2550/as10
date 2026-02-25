const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

const expressMongoSanitize  = require('@exortek/express-mongo-sanitize');
const helmet = require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp = require('hpp');
const cors=require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//Route files
const hospitals = require('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

//LOad env vars
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();


const app = express();

//Body Parser
app.use(express.json());
app.set('query parser','extended');
//Cookie Parser
app.use(cookieParser());

app.use(expressMongoSanitize());
app.use(helmet());
app.use(xss());

const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
});

app.use(hpp());
app.use(cors());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },servers:[
            {
                url : 'http://localhost:5000/api/v1'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/appointments',appointments);
app.use('/api/v1/auth' , auth);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    // Close server & exit process
    server.close(() => process.exit(1));
});
