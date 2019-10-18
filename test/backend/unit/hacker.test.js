require('module-alias/register');
const mocks = require('@t/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);

const hackerController = proxyquire('@b/controllers/hacker', {
    '@b/models': {
        Hacker: mocks.models.hacker,
        Role: mocks.models.role
    }
});

describe('The hacker controller should work as expected', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('getAllHackers should work as expected', () => {
        let hackers = [mocks.stubs.hacker(), mocks.stubs.hacker()];
        let hackersStub = sinon
            .stub(mocks.models.hacker, 'find')
            .returns(mocks.mongooseStub(sinon, ['select', 'exec'], mocks.promise.resolve(hackers)));

        return expect(hackerController.getAllHackers()).to.eventually.be.fulfilled.then(result => {
            expect(result).to.eql(hackers);
            sinon.assert.calledOnce(hackersStub);
        });
    });

    it('getHacker should work as expected', () => {
        let hacker = mocks.stubs.hacker();
        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['select', 'exec'], mocks.promise.resolve(hacker)));

        return expect(hackerController.getHacker(hacker.qr)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.eql(hacker);
            sinon.assert.calledOnce(hackerStub);
        });
    });

    it('createHacker should reject if a hacker with the same qr code already exists', () => {
        let hacker = mocks.stubs.hacker();
        let role = mocks.stubs.role();

        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['lean'], mocks.promise.resolve(hacker)));

        return expect(hackerController.createHacker(hacker.name, hacker.email, hacker.qr, mocks.objectId())).to.eventually.be.rejected.then(() => {
            sinon.assert.calledOnce(hackerStub);
        });
    });

    it('createHacker should reject if the provided role does not exist', () => {
        let hacker = mocks.stubs.hacker();
        let role = mocks.stubs.role();

        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['lean'], mocks.promise.resolve()));

        let roleStub = sinon
            .stub(mocks.models.role, 'findById')
            .returns(mocks.mongooseStub(sinon, ['lean', 'exec']), mocks.promise.resolve());

        return expect(hackerController.createHacker(hacker.name, hacker.email, hacker.qr, mocks.objectId())).to.eventually.be.rejected.then(result => {
            sinon.assert.calledOnce(hackerStub);
            sinon.assert.calledOnce(roleStub);
        });
    });

    it('createHacker should work as expected', () => {
        let hacker = mocks.stubs.hacker();
        let role = mocks.stubs.role();

        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['lean'], mocks.promise.resolve()));

        let roleStub = sinon
            .stub(mocks.models.role, 'findById')
            .returns(mocks.mongooseStub(sinon, ['lean', 'exec'], mocks.promise.resolve(role)));

        let saveStub = sinon
            .stub(mocks.models.hacker.prototype, 'save')
            .returns(mocks.promise.resolve());

        return expect(hackerController.createHacker(hacker.name, hacker.email, hacker.qr, mocks.objectId())).to.eventually.be.fulfilled.then(result => {
            sinon.assert.calledOnce(hackerStub);
            sinon.assert.calledOnce(roleStub);
            sinon.assert.calledOnce(saveStub);
        });
    });

    it('updateHacker should work as expected', () => {
        let hacker = mocks.stubs.hacker();
        let updateStub = sinon
            .stub(mocks.models.hacker, 'findOneAndUpdate')
            .returns(mocks.mongooseStub(sinon, ['exec'], mocks.promise.resolve()));

        return expect(hackerController.updateHacker(hacker.qr, hacker.fields)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.be.undefined;
            sinon.assert.calledOnce(updateStub);
        });
    });
});