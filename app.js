const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

//gunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Irgi',
            email: 'Irgi Adit Pratama@gmail.com'
        },
        {
            nama: 'Dirman',
            email: 'Sudirman@gmail.com'
        },
        {
            nama: 'aan',
            email: 'Saipul Anwar@gmail.com'
        },
    ]
  res.render('index', { 
    nama: 'Irgi',
    title: 'Halaman Home',
    mahasiswa,
    layout: 'layouts/main-layout'
   });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        layout: 'layouts/main-layout',
        title: 'Halaman About'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact'
    });
});

app.get('/product/:id', (req, res) => {
    res.send(`Product ID : ${req.params.id} <br> Category : ${req.query.category}`);
});

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
