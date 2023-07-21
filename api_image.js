//
// app.post('/image/:userid', async (req, res) => {...});
//
// Uploads an image to the bucket and updates the database,
// returning the asset id assigned to this image.
//
const dbConnection = require('./database.js')
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

const uuid = require('uuid');

exports.post_image = async (req, res) => {

  console.log("call to /image...");

  var userid = req.params.userid;

  try {

    var data = req.body;  // data => JS object
    var check_sql = `
      SELECT *
      FROM users
      WHERE userid = ?;
    `;

    dbConnection.query(check_sql, [userid], async (err, check_results, _) => {
      if (err) {
        throw new Error("Error occured in check");
      }

      if (check_results.length == 0) {
        res.json({
          "message": "no such user...",
          "assetid": -1
        });
        return;
      }
      var byte = Buffer.from(data.data, "base64");
      new_key = check_results[0].bucketfolder + "/" + uuid.v4() + ".jpg"
      const command = new PutObjectCommand({
        ACL: "public-read",
        Bucket: s3_bucket_name,
        Key: new_key,
        Body: byte,
      });

      const response = await s3.send(command);
      console.log(response);
      
      var insert_sql = `
      INSERT INTO 
      assets(userid, assetname, bucketkey)
      values(?, ?, ?);
    `;

      var insert_param = [userid, data.assetname, new_key]
      dbConnection.query(insert_sql, insert_param, async (err, results, _) => {
        if (err) {
          throw new Error("Error occured in insert");
        }

        res.json({
          "message": "success",
          "assetid": results.insertId
        });

      });
    });

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "assetid": -1
    });
  }//catch

}//post
