import AWS from 'aws-sdk';
import locals from '../providers/locals.js';

export default new class AWSStorage{
    S3;
    constructor(){
        // Create S3 service object
        AWS.config.update({
          region: 'us-west-2',
          accessKeyId: locals.config().amzS3AccessKey,
          secretAccessKey: locals.config().amzS3SecretKey,
          maxRetries:5,
          apiVersion: '2006-03-01'
        });
        

        this.S3 = new AWS.S3({
            region: locals.config().amzS3Region
        })
    }

    /**
     * @description Uploads a file to the AWS S3.
     * @param {File} file 
     * @returns {Promise<string | Error> }  the location of the file or an error if the file is not able to be uploaded to S3

     */
    async uploadFile(file){
        // call S3 to retrieve upload file to specified bucket
        let uploadParams = {
                Bucket: locals.config().amzS3Bucket, 
                Body: file.data
            };
        uploadParams.Key = `${new Date().toISOString()}-${file.name}`;

        // call S3 to retrieve upload file to specified bucket
        return new Promise((resolve, reject)=>{
          this.S3.upload(uploadParams, function (err, data){
            if (err) {
              reject(err);
           } if (data) {
              resolve(data.Location);
           }
          })
        })
    }

    /**
     * @description Deletes a file object from the s3 bucket.
     * @param {string} filename 
     * @returns {Promises<string | Error>}
     */
    async deleteFile (filename){
      let bucketParams = {
        Bucket: locals.config().amzS3Bucket, 
        Body: file.data
      };

      return new Promise((resolve, reject)=>{
        this.S3.deleteObject(bucketParams, function(err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data);
          }
        });
      })

    }

    /**
     * @description Creates a bucket with the name passed in as a parameter.
     * @param {string} bucketName 
     * @returns {Promise<string | Error>}
     */
    async createBucket (bucketName){
      let bucketParams = {
        Bucket: bucketName, 
      };

      return new Promise((resolve, reject)=>{

        // call S3 to create the bucket
        this.createBucket(bucketParams, function(err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data);
          }
        })
      })

    }
}