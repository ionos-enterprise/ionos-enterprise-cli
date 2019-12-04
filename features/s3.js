var pbclient = require('libionosenterprise')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processS3

function processS3(params) {
    if (!params.userid || params.userid == true) {
        console.error("User Id is a required field. (--userid UUID)")
        process.exit(code = 5)
    }

    switch (params.s3) {
        case 'list':
            pbclient.listS3Keys(params.userid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.s3keyid || params.s3keyid == true) {
                console.error("S3 key Id is a required field. (--s3keyid ...)")
                process.exit(code = 5)
            }
            
            pbclient.getS3Key(params.userid, params.s3keyid, helpers.printInfo)
            break
        case 'create':
            pbclient.createS3Key(params.userid, helpers.printInfo)
            break
        case 'enable':
            if (!params.s3keyid || params.s3keyid == true) {
                console.error("S3 key Id is a required field. (--s3keyid ...)")
                process.exit(code = 5)
            }
    
            pbclient.enableS3Key(params.userid, params.s3keyid, helpers.printInfo)
            break

        case 'disable':
            if (!params.s3keyid || params.s3keyid == true) {
                console.error("S3 key Id is a required field. (--s3keyid ...)")
                process.exit(code = 5)
            }
    
            pbclient.disableS3Key(params.userid, params.s3keyid, helpers.printInfo)
            break
                    
        case 'delete':
            if (!params.s3keyid || params.s3keyid == true) {
                console.error("S3 key Id is a required field. (--s3keyid ...)")
                process.exit(code = 5)
            }
    
            pbclient.deleteS3Key(params.userid, params.s3keyid, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}
