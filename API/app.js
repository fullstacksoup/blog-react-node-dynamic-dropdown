const express = require('express');
const app = express();
const port = 44410;
const cors = require('cors');

var sqlite3 = require("sqlite3"),
    TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;

const DBSOURCE = "vehicledb.sqlite";

var db = new TransactionDatabase(
    new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 

  })
);

module.exports = db

app.use(
    express.urlencoded(),
    cors()
);

app.get('/', (req, res) => res.send('API Root'));

// G E T   A L L
app.get("/api/makes", async (req, res, next) => {
    
    try {              
        var sql = "SELECT DISTINCT MakeId, Make FROM VehicleMakeModel_LU"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
               res.status(400).json({"error":err.message});
               return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
        });
    } catch (err) {
        console.log(err);
    }  
});

app.get("/api/models/:id", async (req, res, next) => {
    
    var params = []         

    try {              
        var sql = "SELECT DISTINCT MakeId, Model FROM VehicleMakeModel_LU WHERE MakeId = ?"
        var params = [req.params.id]
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error":err.message});
            return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
        });
    } catch (err) {
        console.log(err);
    }  

});

app.listen(port, () => console.log(`API listening on port ${port}!`));