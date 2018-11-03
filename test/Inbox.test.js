const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');

const web3 = new Web3(ganache.provider());


let accounts; 
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    
    accounts = await web3.eth.getAccounts();

    //Use one of them to deploy application
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['test']})
        .send( { from: accounts[0], gas: '1000000'});

});

describe('Inbox tests', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });
    it('has initial message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'test');
    });
    it('changed initial message', async () => {
        await inbox.methods.setMessage('new test').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'new test');
    });
});