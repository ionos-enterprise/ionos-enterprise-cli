var pbclient = require('libionosenterprise')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processK8S

function processK8S(params) {
    switch (params.k8s) {
        case 'list':
            pbclient.listK8SClusters(helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }
            
            pbclient.getK8SCluster(params.k8sclusterid, helpers.printInfo)
            break
        case 'create':
            if (!params.k8sclustername || params.k8sclustername == true) {
                console.error("k8sclustername is a required field.")
                process.exit(code = 5)
            }
    
            pbclient.createK8SCluster(params.k8sclustername, helpers.printInfo)
            break

        case 'update':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }
    

            if (!params.k8sclustername || params.k8sclustername == true) {
                console.error("k8sclustername is a required field.")
                process.exit(code = 5)
            }
    
            pbclient.updateK8SCluster(params.k8sclusterid, params.k8sclustername, helpers.printInfo)
            break

        case 'delete':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }
            
            pbclient.deleteK8SCluster(params.k8sclusterid, helpers.printInfo)
            break

        case 'config':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }
            
            pbclient.getK8SClusterConfig(params.k8sclusterid, function(error, response, body) {
                try {
                    var cluster_config = JSON.parse(body)['properties']['kubeconfig'];
                    console.log(cluster_config);
                } catch (err) {
                    console.log('Could not retrieve the config!')
                }
            })
            break

        case 'list-nodepools':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }
            
            pbclient.listK8SClusterNodePools(params.k8sclusterid, helpers.printInfo)
            break
        
        case 'get-nodepool':
        case 'show-nodepool':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }

            if (!params.k8snodepoolid || params.k8snodepoolid == true) {
                console.error("k8snodepoolid is a required field.")
                process.exit(code = 5)
            }

            pbclient.getK8SClusterNodePool(params.k8sclusterid, params.k8snodepoolid, helpers.printInfo)
            break
    
        case 'create-nodepool':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }

            if (!params.k8snodepoolname || params.k8snodepoolname == true) {
                console.error("k8snodepoolname is a required field.")
                process.exit(code = 5)
            }

            if (!params.datacenterid || params.datacenterid == true) {
                console.error("datacenterid is a required field.")
                process.exit(code = 5)
            }

            if (!params.nodeCount || params.nodeCount == true) {
                console.error("nodeCount is a required field.")
                process.exit(code = 5)
            }

            var cpufamily = 'AMD_OPTERON';
            if (params.cpufamily && params.cpufamily != true) {
                cpufamily = params.cpufamily;
            }

            if (!params.cores || params.cores == true) {
                console.error("cores is a required field.")
                process.exit(code = 5)
            }

            if (!params.ram || params.ram == true) {
                console.error("ram is a required field.")
                process.exit(code = 5)
            }

            if (!params.availabilityzone || params.availabilityzone == true) {
                console.error("availabilityzone is a required field.")
                process.exit(code = 5)
            }

            if (!params.storageType || params.storageType == true) {
                console.error("storageType is a required field.")
                process.exit(code = 5)
            }

            if (!params.storageSize || params.storageSize == true) {
                console.error("storageSize is a required field.")
                process.exit(code = 5)
            }

            var req_body = {
                "properties": {
                    "name": params.k8snodepoolname,
                    "datacenterId": params.datacenterid,
                    "nodeCount": params.nodeCount,
                    "cpuFamily": cpufamily,
                    "coresCount": params.cores,
                    "ramSize": params.ram,
                    "availabilityZone": params.availabilityzone,
                    "storageType": params.storageType,
                    "storageSize": params.storageSize
                }
            }
                
            pbclient.createK8SClusterNodePool(params.k8sclusterid, req_body, helpers.printInfo)
            break
            
        case 'delete-nodepool':
            if (!params.k8sclusterid || params.k8sclusterid == true) {
                console.error("k8sclusterid is a required field.")
                process.exit(code = 5)
            }

            if (!params.k8snodepoolid || params.k8snodepoolid == true) {
                console.error("k8snodepoolid is a required field.")
                process.exit(code = 5)
            }

            pbclient.deleteK8SClusterNodePool(params.k8sclusterid, params.k8snodepoolid, helpers.printInfo)
            break
        
        default:
            params.outputHelp()
            break
    }
}
