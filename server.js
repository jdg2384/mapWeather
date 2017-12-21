const express =require('express')
const app = express()
const bodyParser = require('body-parser')
const pg = require('pg')
const axios = require('axios')
const knex = require('./knex')
var bcrypt = require('bcrypt');
const path = require('path');
//const router = express.Router()
const port = process.env.PORT || 3005
//app.use('/', router);

app.use(express.static(path.join(__dirname, 'public')));

//body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// API URL's
const url = 'https://api.darksky.net/forecast/cdc6e842c75d9dc583e4f67a41d1fc5d/'
const flickrurl = 'https://api.flickr.com/services/rest/?api_key=85c64fd80ed5f1d883727b4d72afa0a7&method=flickr.photos.search&bbox=';
// +flickr+"&safe_search=1&per_page=20"


app.get('/', (req, res, next) => {
    res.status(200).send(data)
})

// user info route
app.get('/user', (req, res, next) => {
    knex('info').then(data=>{
        res.status(200).send(data)
    })
})

//post sign up route
app.post('/signup', function(req, res, next){
    var salt = bcrypt.genSaltSync(4)
    var hash = bcrypt.hashSync(req.body.password, salt);
    knex('info').insert({
        first:req.body.first,
        last:req.body.last,
        email:req.body.email,
        password:hash,
        salt:salt
    },'*') 
    .then(user=>{
        res.status(204).send({id:user[0].id})
    })
})

//Log in route
app.post('/login', function (req, res) {
    knex('info').where({
    email: req.body.email
    }).first()
    .then(user=>{
        console.log(user);
        bcrypt.compare(req.body.password, user.password, function(err, ver) {
            ver ? res.status(200).send({id:user.id}): res.sendStatus(401)
        })
    })
})

// Weather api route
app.get('/api/weather/:latlng',(req, res, next) =>{
    //console.log(req.params.latlng)
    axios.get(url+req.params.latlng)
    .then(function (response) {
        //console.log(response);
        res.json({ data: JSON.stringify(response.data) });
    })
    .catch(function (error) {
        console.log(error);
    });
})

//Flickr api route
app.get('/api/flickrurl/:location',(req, res, next) =>{
    //console.log(flickrurl+req.params.location)
    axios.get(flickrurl+req.params.location)
    .then(function (response) {
        //console.log(response);
        res.json({ data: JSON.stringify(response.data) });
    })
    .catch(function (error) {
        console.log(error);
    });
})

// Error 
app.use((err, req, res, next) => {
    const status = err.status || 404
    res.status(status).json({ error: err })
})
  
app.use((req, res, next) => {
    res.status(404).json({ error: { status: 404, message: 'Not found' }})
})

const listener = () => `Listening on port ${port}!`
app.listen(port, listener)
    
