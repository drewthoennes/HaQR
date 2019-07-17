require('module-alias/register');
const mocks = require('@/test/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);

const hackerController = proxyquire('@b/controllers/hacker', {
    '@b/models': {
        Hacker: mocks.models.hacker
    }
});

describe('The hacker controller should work as expected', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('getAllHackers should work as expected', () => {
        let hackers = [mocks.hacker(), mocks.hacker()];
        let hackersStub = sinon
            .stub(mocks.models.hacker, 'find')
            .returns(mocks.mongooseStub(sinon, ['select', 'exec'], mocks.promise.resolve(hackers)));

        return expect(hackerController.getAllHackers()).to.eventually.be.fulfilled.then(result => {
            expect(result).to.eql(hackers);
            sinon.assert.calledOnce(hackersStub);
        });
    });

    it('getHacker should work as expected', () => {
        let hacker = mocks.hacker();
        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['select', 'exec'], mocks.promise.resolve(hacker)));

        return expect(hackerController.getHacker(hacker.qr)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.eql(hacker);
            sinon.assert.calledOnce(hackerStub);
        });
    });

    it('createHacker should work as expected', () => {
        let hacker = mocks.hacker();
        let saveStub = sinon
            .stub(mocks.models.hacker.prototype, 'save')
            .returns(mocks.promise.resolve());

        return expect(hackerController.createHacker(hacker.name, hacker.email, hacker.qr, hacker.fields)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.be.undefined;
            sinon.assert.calledOnce(saveStub);
        });
    });

    it('updateHacker should work as expected', () => {
        let hacker = mocks.hacker();
        let updateStub = sinon
            .stub(mocks.models.hacker, 'findOneAndUpdate')
            .returns(mocks.mongooseStub(sinon, ['exec'], mocks.promise.resolve()));

        return expect(hackerController.updateHacker(hacker.qr, hacker.fields)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.be.undefined;
            sinon.assert.calledOnce(updateStub);
        });
    });
});