const express = require('express');

const app = express();

// app.get('/', (req, res) => res.json({ msg: 'Welcome to contactKeeper API' }));

//Define Routes

app.use('/api/users', require('./route/users'));
app.use('/api/contacts', require('./route/contacts'));
app.use('/api/auth', require('./route/auth'));

PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
