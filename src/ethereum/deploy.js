const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFixedSupplyToken = require('./build/FixedSupplyToken.json');

const provider = new HDWalletProvider('candy clip enlist runway inquiry wood cable flush board matrix rain lawn', 'https://rinkeby.infura.io/fmYYH0aPRKNF5MFSuVNH');
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFixedSupplyToken.interface))
    .deploy({ data: '0x'+compiledFixedSupplyToken.bytecode })
    .send({gas: '1000000', from: accounts[0]});

  console.log('Contract deployed to', result.options.address);
};

deploy();