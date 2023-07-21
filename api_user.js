//
// app.put('/user', async (req, res) => {...});
//
// Inserts a new user into the database, or if the
// user already exists (based on email) then the
// user's data is updated (name and bucket folder).
// Returns the user's userid in the database.
//
const dbConnection = require('./database.js')

exports.put_user = async (req, res) => {

  console.log("call to /user...");

  try {

    var data = req.body;  // data => JS object

    var check_sql = `
      SELECT *
      FROM users
      WHERE email = ?;
    `;

    var insert_sql = `
      INSERT INTO 
      users(email, lastname, firstname, bucketfolder)
      values(?, ?, ?, ?);
      `;
    var insert_params = [data.email, data.lastname, data.firstname, data.bucketfolder]
    dbConnection.query(check_sql, [data.email], async (err, check_results, _) => {
      if (err) {
        throw new Error("Error occured in checking database");
      }
      console.log("Before if check");
      if (check_results.length == 0) {
        // call database to insert new entry
        dbConnection.query(insert_sql, insert_params, async (insert_err, results, _) => {
          if (err) {
            console.log("Return 400 because issue occured in insert");
            console.log(insert_err.message);
            res.status(400).json({
              "message": insert_err.message,
              "userid": -1
            });
            return;
          }
          console.log("Return inserted message");
          console.log(results.insertId);
          console.log(results);
          res.json({
            "message": "inserted",
            "userid": results.insertId
          });
          return;
        });
        return;
      }


      var update_sql = `
        UPDATE users
        SET 
          lastname = ?,
          firstname = ?,
          bucketfolder = ?
        WHERE email = ?;

        SELECT userid FROM users WHERE email = ?;
      `;
      var update_params = [data.lastname, data.firstname, data.bucketfolder, data.email, data.email]
      // call database to update
      dbConnection.query(update_sql, update_params, async (err, results, _) => {
        if (err) {
          throw new Error("Error occured in updating database");
        }
        console.log("Returning Updated Json");
        console.log(results[1][0].userid);
        res.json({
          "message": "updated",
          "userid": results[1][0].userid
        });
        return;
      });
    });

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "userid": -1
    });
  }//catch

}//put
