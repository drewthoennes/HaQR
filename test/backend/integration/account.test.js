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

const authController = require('@b/controllers/auth');

describe('Account routes should work as expected', () => {
    beforeEach(done => {
        // Restart MongoDB instance
        mongo.beforeEach().then(() => {
            // Stub authorization middleware
            sinon.stub(authController, 'authorize').callsFake(config => {
                return (req, res, next) => {
                    req.auth = {
                        account: mocks.stubs.account(),
                        authorized: true
                    }

                    next();
                }
            });

            // Reinstantiate app
            app = server.getNewApp();
            done();
        });
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => {
            done();
        });
    });

    after(() => server.killSession());

    it('/api/account GET should return account information', done => {
        chai.request(app)
            .get('/api/account')
        .end((err, res) => {
            expect(res.body).to.have.property('account');
            expect(res.body.account).to.have.property('name');
            expect(res.body.account).to.have.property('email');
            expect(res.body.account).to.have.property('role');
            expect(res.body.account).to.have.property('authorized');

            done()
        });
    });
});
