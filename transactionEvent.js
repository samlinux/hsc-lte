/**
 * app02 - how to listen to events - commitEvents
 */
let config = {
  channel: 'channel1',
  cc:'sacc2',
  userName: 'app02user-mars.morgen.net',
  ccpPath: './marsConnection.yaml'
}

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, config.ccpPath);
const util = require('util');

async function init() {

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), './identityManagement/wallet');
  const wallet = new FileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccpPath, { 
    wallet, 
    identity: config.userName, 
    discovery: { enabled: true, asLocalhost: false } });

  const network = await gateway.getNetwork(config.channel);
  const contract = network.getContract(config.cc);

  // ------------------------------------
  // listen to a transaction event
  // ------------------------------------

  let transaction = contract.createTransaction('set');
  
  await transaction.addCommitListener((err, txId, status, blockHeight) => {
    if (err) {
      console.log(err)
      return
    }

    if (status === 'VALID') {
      console.log('transaction committed');
      console.log('>> txId: ', util.inspect(txId, {showHidden: false, depth: 5}))
      console.log('>> status: ', util.inspect(status, {showHidden: false, depth: 5}))
      console.log('>> blockHeight: ',util.inspect(blockHeight, {showHidden: false, depth: 5}))
      console.log('transaction committed end');
    } else {
      console.log('err transaction failed');
      console.log(status);
    }
  })

  await transaction.submit('msg4', 'aber gerne '+ new Date().toISOString());
  // Disconnect from the gateway.
  gateway.disconnect();
}

init();
