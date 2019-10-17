require('module-alias/register');
const mocks = require('@t/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require('sinon');
const server = require('@t/backend/utils/server');
const mongo = require('@t/backend/utils/mongo');
const faker = require('faker');

let app;

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const middlware = require('@b/middleware');

const stubAuthAndStart = (account, authorized) => {
    sinon.stub(middlware, 'authorize').callsFake(() => mocks.stubs.authMiddleware(account, authorized));
    app = server.getNewApp();
}

describe('Hacker routes should work as expected', () => {
    beforeEach(done => {
        mongo.beforeEach().then(() => done());
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => done());
    });

    after(() => server.killSession());

    it('/api/hackers GET POST should work as expected', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = {
            name: faker.random.word(),
            fields: [
                {
                    name: faker.random.word(),
                    attributes: [faker.random.word(), faker.random.word(), faker.random.word()]
                }, {
                    name: faker.random.word(),
                    attributes: [faker.random.word(), faker.random.word(), faker.random.word()]
                }
            ]
        }
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number()
        };

        requester
            .post('/api/roles')
            .send(role)
        .then(res => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('role_id');

            hacker = Object.assign(hacker, {role: res.body.role_id});

            return requester.post('/api/hackers').send(hacker);
        }).then(res => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('hacker_id');

            return requester.get('/api/hackers');
        }).then(res => {
            expect(res.body).to.have.property('hackers');
            expect(res.body.hackers).to.have.lengthOf(1);
            expect(res.body.hackers[0]).to.eql({
                active: true,
                name: hacker.name,
                email: hacker.email,
                qr: hacker.qr
            });

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });
});
