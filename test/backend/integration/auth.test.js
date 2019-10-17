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

describe('Auth routes should work as expected', () => {
    beforeEach(done => {
        mongo.beforeEach().then(() => done());
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => done());
    });

    after(() => server.killSession());

    it('/api/auth/github GET should try to redirect', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, false);
        // Replace environment variables

        chai.request(app)
            .get('/api/auth/github')
        .then(res => {
            expect(res).to.redirect;

            done();
        }).catch(err => done(err));
    });

    it('/api/auth/github GET should return redirect URL', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, false);
        // Replace environment variables

        chai.request(app)
            .get('/api/auth/github?return=true')
        .then(res => {
            console.log(res.body);
            expect(res.body).to.have.property('url');

            done();
        }).catch(err => done(err));
    });
});
