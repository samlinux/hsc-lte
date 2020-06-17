/**
 * app02 - how to listen to events - custom chaincode event
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

  await contract.addContractListener('my-contract-listener', 'setEvent', (err, event, blockNumber, transactionId, status) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
    console.log(event.payload.toString('utf8'))
  })
}

init();

/** 
 * 
  peer chaincode invoke -n sacc2 -c '{"Args":["set", "msg5","hello C"]}' -C channel1  --tls --cafile /tmp/hyperledger/mars.morgen.net/peers/peer0/tls-msp/tlscacerts/tls-ca-tls-morgen-net-7052.pem
 
  peer chaincode query -n sacc2 -c '{"Args":["query","msg4"]}' -C channel1 --tls --cafile /tmp/hyperledger/mars.morgen.net/peers/peer0/tls-msp/tlscacerts/tls-ca-tls-morgen-net-7052.pem
 */