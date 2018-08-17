import web3 from './web3';
import attendancecoin from './build/FixedSupplyToken.json';

//const instance = new web3.eth.Contract(JSON.parse(attendancecoin.interface), "0x05e710afeebe27972e45f75aca2d16ec2c698f45"); // - Michael
const instance = new web3.eth.Contract(JSON.parse(attendancecoin.interface), "0x9ba8af7183b04f5a6d5a6f23ddc8370bc215de02"); // - Vutsal

export default instance;
