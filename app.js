const express = require('express');
const path = require('path');
 
const app = express();
 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/admin/dashboard', (req, res) => res.render('dashboard'));
 
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));