const express = require ('express');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const pg = require('pg');
const wikiRouter = require('./routes/route');

const models = require('./models');

const app = express();

//Morgan 
app.use(morgan('dev'));

//bodyPaerser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Static Middleware
app.use(express.static(path.join(__dirname, '/public')));

//Nunjucks Comfig
const env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);


app.use('/wiki', wikiRouter);

//Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
})

// SYNC MODELS
models.db.sync()
.then( () => {
    console.log('All Tables Created!');
     app.listen('3000', () => {
        console.log('Server is Listening On Port 3000!!!');
    });
})
.catch(console.error.bind(console));