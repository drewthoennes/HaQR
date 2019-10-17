require('module-alias/register');
const mocks = require('@t/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require('sinon');
const server = require('@t/backend/utils/server');
const mongo = require('@t/backend/utils/mongo');

let app;

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const middlware = require('@b/middleware');

const stubAuthAndStart = (account, authorized) => {
    sinon.stub(middlware, 'authorize').callsFake(() => mocks.stubs.authMiddleware(account, authorized));
    app = server.getNewApp();
}

describe('Config routes should work as expected', () => {
    beforeEach(done => {
        mongo.beforeEach().then(() => done());
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => done());
    });

    after(() => server.killSession());

    it.only('/api/config GET should return config', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        chai.request(app)
            .get('/api/config')
        .then(res => {
            expect(res.body).to.have.property('config');
            expect(res.body.config).to.be.null;

            done();
        }).catch(err => done(err));
    });

    it.only('/api/config POST should update config', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post('/api/config')
            .send({
                config: {
                    authorizeAll: true,
                    promoteAll: true
                }
            })
        .then(res => {
            expect(res.body).to.have.property('message');

            done();
        }).catch(err => done(err));
    });
});
