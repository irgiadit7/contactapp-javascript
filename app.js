const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;
const {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts} = require('./utils/contacts');
const {body, validationResult, check} = require ('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//gunakan ejs
app.set('view engine', 'ejs');

app.use(expressLayouts); //third-party middleware
app.use(express.static('public')); //built-in middleware
app.use(express.urlencoded({extended: true}));

//konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000,
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    }
}));

app.use(flash());

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
    const contacts = loadContact(); 
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact',
        contacts,
        msg: req.flash('msg'),
    });
});

//halaman form tambah data contact
app.get('/contact/add', (req, res)=> {
    res.render('add-contact', {
        title: 'form tambah data contact',
        layout: 'layouts/main-layout',
    })
});

//prosess data contact
app.post('/contact', [
    body('nama').custom((value)=>{
        const duplikat = cekDuplikat(value);
        if(duplikat) {
            throw new Error ('Sudah terdaftar!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(), 
    check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')
    ], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()});
        res.render('add-contact', {
            title: 'form tambah data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
         }
        else{
             addContact(req.body);
             //kirimkan flash massage
             req.flash('msg', 'Data contact berhasil ditambahkan!');
            res.redirect('/contact');
        }
});


//prosess delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    //jika contact tidak ada
    if(!contact) {
        res.status(404);
        res.send('<h1>404</h1>');
    } else {
       deleteContact(req.params.nama);
        req.flash('msg', 'Data contact berhasil dihapus!');
            res.redirect('/contact');
    }
});

//halaman form ubah data contact
app.get('/contact/edit/:nama', (req, res)=> {
    const contact = findContact(req.params.nama);

    res.render('edit-contact', {
        title: 'form ubah data contact',
        layout: 'layouts/main-layout',
        contact,
    })
});

//prosess ubah data
app.post('/contact/update', [
    body('nama').custom((value, {req})=>{
        const duplikat = cekDuplikat(value);
        if(value !== req.body.oldNama && duplikat) {
            throw new Error ('Sudah terdaftar!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(), 
    check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')
    ], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()});
        res.render('edit-contact', {
            title: 'form ubah data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        });
         }
        else{
             updateContacts(req.body);
             //kirimkan flash massage
             req.flash('msg', 'Data contact berhasil diubah!');
            res.redirect('/contact');
        }
});

//halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama); 
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail Contact',
        contact,
    });
});

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
