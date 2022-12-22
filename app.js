const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
var mysql = require('mysql');
var shuffle = require('shuffle-array');

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

app.get('/reshuffletanan',async (req,res)=>{
  var arr = [];
  var sql_arr = [];
  var sql = "SELECT * FROM people WHERE id > 73"
   pool.query(sql , (err, results)=>{
    if(err){
      return res.status(500).json("There was something wrong with the shuffle")
    }

    results.forEach(element => {
      arr.push(element.id)
    });

    arr = shuffle(arr)
    console.log(arr)
    
    for(var i = 0 ; i < arr.length-1 ; i ++){
      sql_arr.push([arr[i],arr[i+1]])
    }
      sql_arr.push([arr[i],arr[0]]);
      var values = sql_arr;

    var sql = "INSERT INTO exchange (exchange_from,exchange_to) VALUES ?";
    pool.query(sql, [sql_arr], (err)=>{
      if(err){
        return res.status(500).json("There was something wrong with the shuffle 2")
      }
      res.status(200).json(sql_arr)
    })

   
  })
})

app.get('/getexchange',(req,res)=>{
  var sql = "SELECT sname,exchange.exchange_to FROM people LEFT JOIN exchange ON exchange.exchange_from = people.id"

  pool.query(sql,(err,results)=>{
    if (err){
      return res.status(500).json("There's something wrong with Santa's list")
    }

    res.status(200).json(results)
  })
})

app.get('/getsamaritan/:id',(req,res)=>{
  var sql = "SELECT sname,wishlist FROM people WHERE id="+req.params.id;

  pool.query(sql,(err, result)=>{
    if(err) return res.status(500).json("There's something wrong with Santa's List")

    res.status(200).json(result)

  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})