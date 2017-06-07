var oracledb = require('oracledb');
var bodyParser = require('body-parser')
var express = require('express')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var connectionData = {
  user: "hugo",
  password: "oracle",
  connectString: "127.0.0.1:49161/xe"
}

app.post('/', function(req, res){
  oracledb.getConnection(connectionData, function(err, connection){
    if (err) {
      console.error(err.message)
      return
    }

    var insertStmt = "INSERT INTO EMPLOYEE VALUES (:id, :name, :rut, :dv, :type_id)"

    var data = [
      req.body.id,
      req.body.name,
      req.body.rut,
      req.body.dv,
      req.body.type_id
    ]

    connection.execute(insertStmt, data,
      { autoCommit: true },
      function(err, result){
        if (err) {
          res.status(500).send('Error on server')
          return;
        }
        console.log('insertion successfully')
        res.status(200).send('Insert successful')
        connection.close()
      })
  })
})

app.put('/', function(req, res){
  oracledb.getConnection(connectionData, function(err, connection){
    if (err) {
      console.error(err.message)
      return
    }

    var updateStmt = "UPDATE EMPLOYEE SET NAME = :name, RUT = :rut, DV = :dv, TYPE_ID = :type_id where ID = :id"
    
    var data = [
      req.body.name,
      req.body.rut,
      req.body.dv,
      req.body.type_id,
      req.body.id
    ]

    connection.execute(updateStmt, data, { autoCommit: true }, function(err, result){
      if (err) {
        res.send(500).send('Error on server')
        return
      }
      console.log('updating successful')
      res.status(200).send('update successful')
      connection.close()
    })
  })
})

app.listen(9000)