const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//Connect DataBase
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Define Routes

app.use('/api/users', require('./route/users'));
app.use('/api/contacts', require('./route/contacts'));
app.use('/api/auth', require('./route/auth'));

// Serve static assets in production

if (process.env.NODE_ENV === 'production') {
  //Set static folder

  app.use(express.static('client/build'));

  app.get('*', (res, req) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
