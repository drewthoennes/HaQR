require('module-alias/register');
const mocks = require('@t/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);

const configController = proxyquire('@b/controllers/config', {
    '@b/models': {
    }
});

describe('The config controller should work as expected', () => {
    afterEach(() => {
        sinon.restore();
    });
});
