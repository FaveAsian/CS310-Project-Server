//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database:
//
const dbConnection = require('./database.js')

exports.get_assets = async (req, res) => {

  console.log("call to /assets...");

  try {
    var sql = `
      Select * 
      From assets
      ORDER BY assetid ASC;
      `;

    dbConnection.query(sql, (err, results, _) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("/users query done");
      console.log("/users done, sending response...");

      res.json({
        "message": "success",
        "data": results
      });
    });
  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
