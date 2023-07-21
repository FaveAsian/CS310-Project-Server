//
// app.get('/download/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_download = async (req, res) => {

  console.log("call to /download...");
  assetid = req.params.assetid

  try {
    //
    // TODO
    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    // AWS:
    //   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
    //

    sql = `
    SELECT *
    FROM assets
    WHERE assetid = ?;
    `;

    dbConnection.query(sql, [assetid], async (err, results, _) => {
      if (err) {
        res.status(400).json({
          "message": err.message,
          "user_id": -1,
          "asset_name": "?",
          "bucket_key": "?",
          "data": []
        });
        return;
      }

      // if assetid does not exist
      if (results.length == 0) {
        res.json({
          "message": "no such asset...",
          "user_id": -1,
          "asset_name": "?",
          "bucket_key": "?",
          "data": []
        });
        return;
      }

      row = results[0];

      var input = new GetObjectCommand({
        Bucket: s3_bucket_name,
        Key: row["bucketkey"]  
      });

      var s3_result = await s3.send(input);
      var datastr = await s3_result.Body.transformToString("base64");
      // not empty
      res.json({
        "message": "success",
        "user_id": row["userid"],
        "asset_name": row["assetname"],
        "bucket_key": row["bucketkey"],
        "data": datastr
      });
    });
  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
      "user_id": -1,
      "asset_name": "?",
      "bucket_key": "?",
      "data": []
    });
  }//catch

}//get