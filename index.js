/**
 * app02 - how to listen to events
 */
let config = {
  channel: 'channel1',
  cc: 'sacc2',
  userName: 'app02user-mars.morgen.net',
  ccpPath: './marsConnection.yaml'
}

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, config.ccpPath);

// get the key from the post request
let queryKey = 'msg';

let args = process.argv.slice(2);
if(args.length === 1){
  queryKey = args[0];
}

async function init() {
  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), './identityManagement/wallet');
  const wallet = new FileSystemWallet(walletPath);

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccpPath, { 
    wallet, 
    identity: config.userName, 
    discovery: { enabled: true, asLocalhost: false } });

  // Get the network (channel) our contract is deployed to.
  const network = await gateway.getNetwork(config.channel);

  // Get the contract from the network.
  const contract = network.getContract(config.cc);

  // Evaluate the specified transaction.
  try {
    let result = await contract.evaluateTransaction('query',queryKey);
    
    // Disconnect from the gateway.
    await gateway.disconnect();
  
    // finale object
    let r = {
      key:queryKey,
      value:result.toString()
    };
    console.log(r);
  } catch(e){
    console.log(e)
  }
}

init();