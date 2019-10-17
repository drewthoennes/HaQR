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

    it('/api/config GET should create a config if one does not exist', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        chai.request(app)
            .get('/api/config')
        .then(res => {
            expect(res.body).to.have.property('config');
            expect(res.body.config).to.have.property('authorizeAll');
            expect(res.body.config).to.have.property('promoteAll');

            done();
        }).catch(err => done(err));
    });

    it('/api/config POST should fail if given invalid config', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post('/api/config')
            .send({
                config: {
                    authorizeAll: true
                    // Missing part of config
                }
            })
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => done(err));
    });

    it('/api/config POST should update config', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let config = {
            authorizeAll: true,
            promoteAll: false
        }

        requester
            .post('/api/config')
            .send({
                config: config
            })
        .then(res => {
            expect(res.body).to.have.property('message');
        }).then(() => {
            return requester.get('/api/config');
        }).then(res => {
            expect(res.body).to.have.property('config');
            expect(res.body.config).to.have.property('authorizeAll');
            expect(res.body.config.authorizeAll).to.equal(config.authorizeAll);
            expect(res.body.config).to.have.property('promoteAll');
            expect(res.body.config.promoteAll).to.equal(config.promoteAll);

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });
});
