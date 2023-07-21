//
// app.get('/bucket?startafter=bucketkey', async (req, res) => {...});
//
// Retrieves the contents of the S3 bucket and returns the 
// information about each asset to the client. Note that it
// returns 12 at a time, use startafter query parameter to pass
// the last bucketkey and get the next set of 12, and so on.
//
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_bucket = async (req, res) => {

  console.log("call to /bucket...");
  var bucketkey = ""
  if (req.query.startafter) {
    bucketkey = req.query.startafter;
  }

  try {
    //
    // TODO: remember, 12 at a time...  Do not try to cache them here, instead 
    // request them 12 at a time from S3
    //
    // AWS:
    //   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/listobjectsv2command.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
    //

    //
    // build input object with request parameters:
    //
    var input = {
      Bucket: s3_bucket_name,
      MaxKeys: "12",
      StartAfter: bucketkey
    };

    const command = new ListObjectsV2Command(input);
    const response = await s3.send(command);

    if (response["KeyCount"] == 0) {
      res.json({
        "message": "success",
        "data": []
      });
    }
    else {
      res.json({
        "message": "success",
        "data": response["Contents"]
      });
    }

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
