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
    sinon.stub(middlware, 'authorize').callsFake(config => mocks.stubs.authMiddleware(account, authorized, config));
    app = server.getNewApp();
}

describe('Role routes should work as expected', () => {
    beforeEach(done => {
        mongo.beforeEach().then(() => done());
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => done());
    });

    after(() => server.killSession());

    it('/api/roles GET should fail if user is not an admin', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        chai.request(app)
            .get('/api/roles')
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => done(err));
    });

    it('/api/roles GET works as expected', done => {
        let account = Object.assign(mocks.stubs.account(), {role: 'admin'});
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();

        requester
            .post('/api/roles')
            .send(role)
        .then(res => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('role_id');

            return requester.get('/api/roles');
        }).then(res => {
            expect(res.body).to.have.property('roles');
            expect(res.body.roles).to.have.lengthOf(1);
            expect(res.body.roles[0].name).to.equal(role.name);
            expect(res.body.roles[0].fields).to.eql(role.fields);

            requester.close();
            done();
        }).catch(err => done(err));
    });

    it('/api/roles POST should fail if user is not an admin', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        let role = mocks.stubs.role();

        chai.request(app)
            .post('/api/roles')
            .send(role)
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => done(err));
    });

    it('/api/roles POST works as expected', done => {
        let account = Object.assign(mocks.stubs.account(), {role: 'admin'});
        stubAuthAndStart(account, true);

        let role = mocks.stubs.role();

        chai.request(app)
            .post('/api/roles')
            .send(role)
        .then(res => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('role_id');

            done();
        }).catch(err => done(err));
    });
});
