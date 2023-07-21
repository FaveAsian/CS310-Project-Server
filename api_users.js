//
// app.get('/users', async (req, res) => {...});
//
// Return all the users from the database:
//
const dbConnection = require('./database.js')

exports.get_users = async (req, res) => {

  console.log("call to /users...");

  try {
    var sql = `
      Select * 
      From users
      ORDER BY userid ASC;
      `;

    dbConnection.query(sql, (err, results, _) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("/users query done");
      console.log("/users done, sending response...");
      console.log(results)
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
