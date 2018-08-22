import web3 from './web3';
import attendancecoin from './build/FixedSupplyToken.json';
import attendancecoin_lastID from './build/AttendanceCoin_Members.json';
import attendancecoin_faucet from './build/AttendanceCoin_Faucet.json';

export const AttendanceCoin = new web3.eth.Contract(JSON.parse(attendancecoin.interface), "0x05e710afeebe27972e45f75aca2d16ec2c698f45"); // - Michael
export const AttendanceCoin_lastID = new web3.eth.Contract(JSON.parse(attendancecoin_lastID.interface), "0xc4911c1323d89369503254cef1d3922cf896ecaa"); // - Michael lastID
export const AttendanceCoin_Faucet = new web3.eth.Contract(JSON.parse(attendancecoin_faucet.interface), "0xbec1ad77ab0dca72224f47bb94ee64a610045c79"); // - AC faucet
//export const AttendanceCoin = new web3.eth.Contract(JSON.parse(attendancecoin.interface), "0x9ba8af7183b04f5a6d5a6f23ddc8370bc215de02"); // - Vutsal
//export const AttendanceCoin_extension1 = new web3.eth.Contract(JSON.parse(attendancecoin.interface), "0xE50Ca5a10E3c8cdbF815e2712928dFd50e5b72D7"); // - Extension1


/*

0x8B8ba03Ed61Ad1CB0E9bEFD0D02ECB444834887D

*/