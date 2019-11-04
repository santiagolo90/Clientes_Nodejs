var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017"
const dbName = 'clientes'
const client = new MongoClient(url, {useUnifiedTopology: true});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use((req,res,next)=>{
    client.connect(function(err){
        const db = client.db(dbName);
        req.db = db;

        next();
    })
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


app.get('/api/clientes', (req,res) => {
    // res.json({
    //     cliente:'aaaa'
    // })
    let clientes = req.db.collection("clientes");

    clientes.find({}).toArray(function(err,docs){
        console.log(docs);
        res.json(docs);
        
    })
})

app.post('/api/clientes', (req,res) => {
    // console.log(req.body); 
    // res.send(req.body); 
    let clientes = req.db.collection("clientes");
    clientes.insert(req.body, (err, result) => {
    if (err){
        res.send('Error al insertar');
    }
    else{
        res.send(result);
    }
    });
})

app.get('/api/cliente/:id', (req,res) => {
    var o_id = new ObjectId(req.params.id);
    let clientes = req.db.collection("clientes");

    clientes.find({"_id":ObjectId(o_id)}).toArray(function(err,docs){
        console.log(docs);
        res.json(docs);  
    })

})

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname,'public/index.html' ))
})

module.exports = app;
