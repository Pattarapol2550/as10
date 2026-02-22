const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
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
