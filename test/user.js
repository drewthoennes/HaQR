require('module-alias/register');
const mocks = require('@/test/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);

const hackerController = proxyquire('@b/controllers/user', {
    '@b/models': {
    }
});

describe('The hacker controller should work as expected', () => {
    afterEach(() => {
        sinon.restore();
    });
});