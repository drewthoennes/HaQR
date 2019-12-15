require('module-alias/register');
const mocks = require('@t/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);

const configController = require('@b/controllers/config');
const interactionsController = require('@b/controllers/interaction');
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

    it('getHacker should reject if no hacker with given qr is found', () => {
        let hacker = mocks.stubs.hacker();
        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['select'], mocks.promise.resolve(undefined)));

        return expect(hackerController.getHacker(hacker.qr)).to.eventually.be.rejected.then(() => {
            sinon.assert.calledOnce(hackerStub);
        });
    });

    it('getHacker should work as expected', () => {
        let hacker = mocks.stubs.hacker();
        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['select'], mocks.promise.resolve(hacker)));

        return expect(hackerController.getHacker(hacker.qr)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.eql(hacker);
            sinon.assert.calledOnce(hackerStub);
        });
    });

    it('createHacker should reject if a hacker with the same qr code already exists', () => {
        let hacker = mocks.stubs.hacker();
        let config = mocks.stubs.config();

        let configStub = sinon
            .stub(configController, 'getConfig')
            .returns(mocks.promise.resolve(config));

        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['lean'], mocks.promise.resolve(hacker)));

        return expect(hackerController.createHacker(hacker.name, hacker.description, hacker.email, hacker.qr, mocks.objectId())).to.eventually.be.rejected.then(() => {
            sinon.assert.calledOnce(configStub);
            sinon.assert.calledOnce(hackerStub);
        });
    });

    it('createHacker should reject if the provided role does not exist', () => {
        let hacker = mocks.stubs.hacker();
        let config = mocks.stubs.config();

        let configStub = sinon
            .stub(configController, 'getConfig')
            .returns(mocks.promise.resolve(config));

        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['lean'], mocks.promise.resolve()));

        let roleStub = sinon
            .stub(mocks.models.role, 'findById')
            .returns(mocks.mongooseStub(sinon, ['lean', 'exec']), mocks.promise.resolve());

        return expect(hackerController.createHacker(hacker.name, hacker.email, hacker.description, hacker.qr, mocks.objectId())).to.eventually.be.rejected.then(result => {
            sinon.assert.calledOnce(configStub);
            sinon.assert.calledOnce(hackerStub);
            sinon.assert.calledOnce(roleStub);
        });
    });

    it('createHacker should work as expected', () => {
        let hacker = mocks.stubs.hacker();
        let role = mocks.stubs.role();
        let config = mocks.stubs.config();

        let configStub = sinon
            .stub(configController, 'getConfig')
            .returns(mocks.promise.resolve(config));

        let hackerStub = sinon
            .stub(mocks.models.hacker, 'findOne')
            .returns(mocks.mongooseStub(sinon, ['lean'], mocks.promise.resolve()));

        let roleStub = sinon
            .stub(mocks.models.role, 'findById')
            .returns(mocks.mongooseStub(sinon, ['lean', 'exec'], mocks.promise.resolve(role)));

        let saveStub = sinon
            .stub(mocks.models.hacker.prototype, 'save')
            .returns(mocks.promise.resolve(hacker));

        let interactionStub = sinon
            .stub(interactionsController, 'createInteraction')
            .returns(mocks.promise.resolve());

        return expect(hackerController.createHacker(mocks.objectId(), hacker.name, hacker.email, hacker.description, hacker.qr, mocks.objectId())).to.eventually.be.fulfilled.then(result => {
            sinon.assert.calledOnce(configStub);
            sinon.assert.calledOnce(hackerStub);
            sinon.assert.calledOnce(roleStub);
            sinon.assert.calledOnce(saveStub);
            sinon.assert.calledOnce(interactionStub);
        });
    });

    it('updateHacker should work as expected', () => {
        let config = mocks.stubs.config();
        let hacker = mocks.stubs.hacker();

        let configStub = sinon
            .stub(configController, 'getConfig')
            .returns(mocks.promise.resolve(config));

        let hackerStub = sinon
            .stub(hackerController, 'getHacker')
            .returns(mocks.promise.resolve(hacker));

        let saveStub = sinon
            .stub(hacker, 'save')
            .returns(mocks.promise.resolve(hacker));

        let interactionStub = sinon
            .stub(interactionsController, 'createInteraction')
            .returns(mocks.promise.resolve());

        return expect(hackerController.updateHacker(mocks.objectId(), hacker.qr, hacker.fields)).to.eventually.be.fulfilled.then(result => {
            expect(result).to.be.undefined;
            sinon.assert.calledOnce(configStub);
            sinon.assert.calledOnce(hackerStub);
            sinon.assert.calledOnce(saveStub);
            sinon.assert.calledOnce(interactionStub);
        });
    });
});
