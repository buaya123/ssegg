const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
var mysql = require('mysql');

//app.use(cors);
app.use(cors())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization, X-Requested-With");

    next();
  });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// var con = mysql.createConnection({
//   connectionLimit : 20,
//   host: "db4free.net",
//   user: "kimmers",
//   password: "imongmama",
//   database : "ssegg123",
// });

var pool  = mysql.createPool({
  connectionLimit : 10,
  host: "db4free.net",
  user: "kimmers",
  password: "imongmama",
  database : "ssegg123"
});

// pool.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });


app.get('/', (req, res) => {
    res.send('Hello World!')
  })


app.post('/postpeople', (req, res,next) => {
  var sql = "INSERT INTO people VALUES (NULL,'"+req.body.fname+"','"+req.body.sname+"',"+req.body.aux+",'"+req.body.wishlist+"')";
  pool.query(sql, function (error, results) {
    if (error) {
        return res.status(500).json(error);
    }
    res.status(200).json("Form Submission Successful");
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})