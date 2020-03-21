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

const interactionsController = require('@b/controllers/interaction');
const userController = require('@b/controllers/user');
const middlware = require('@b/middleware');

const stubInteractions = () => {
    sinon.stub(interactionsController, 'createInteraction').callsFake(() => mocks.promise.resolve());
}

const stubAuthAndStart = (account, authorized) => {
    sinon.stub(middlware, 'authorize').callsFake(config => mocks.stubs.authMiddleware(account, authorized, config));
    app = server.getNewApp();
}

const createUser = (github, name, email, authorized, admin) => {
    return userController.findOrCreateUser({github: {username: github}}, name, email, github, authorized, admin);
}

describe('User routes should work as expected', () => {
    let owner;
    let member;
    let admin;

    beforeEach(done => {
        mongo.beforeEach().then(() => {
            let user = mocks.stubs.user(true, 'owner');
            return createUser(user.github.username, user.name, user.email, true, true);
        }).then(user => {
            owner = user;
            user = mocks.stubs.user(true, 'owner');
            return createUser(user.github.username, user.name, user.email, true, false);
        }).then(user => {
            member = user;
            user = mocks.stubs.user(true, 'owner');
            return createUser(user.github.username, user.name, user.email, true, true);
        }).then(user => {
            admin = user;
            done()
        });
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => done());
    });

    after(() => server.killSession());

    it('/api/users GET should work as expected', (done) => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        let keys = ['_id', 'name', 'email', 'role', 'authorized', 'createdAt', 'updatedAt'];

        chai.request(app)
            .get('/api/users')
        .then(res => {
            expect(res.body).to.have.property('users');
            expect(res.body.users).to.have.length(3);

            for (let index in res.body.users) {
                expect(res.body.users[index]).to.have.keys(...keys);
            }

            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/users/:user_id/authorize POST should fail if given user_id is invalid', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post(`/api/users/${mocks.objectId()}/authorize`)
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/users/:user_id/authorize POST should work as expected', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let keys = ['_id', 'name', 'email', 'role', 'authorized', 'createdAt', 'updatedAt'];

        requester
            .post(`/api/users/${member._id}/authorize`)
        .then(res => {
            expect(res.body).to.have.property('message');

            return requester.get('/api/users');
        }).then(res => {
            expect(res.body).to.have.property('users');
            expect(res.body.users).to.have.length(3);

            for (let index in res.body.users) {
                let user = res.body.users[index];

                expect(user).to.have.keys(...keys);

                // Check to make sure member's authorization was toggled
                if (user._id === member._id) {
                    expect(user.authorized).to.equal(!member.authorized);
                }
            }

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err);
        });
    });

    it('/api/users/:user_id/role POST should fail if the given user_id is invalid', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post(`/api/users/${mocks.objectId()}/role`)
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/users/:user_id/role POST should fail if user is the owner', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post(`/api/users/${owner._id}/role`)
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/users/:user_id/role POST should work as expected for members', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let keys = ['_id', 'name', 'email', 'role', 'authorized', 'createdAt', 'updatedAt'];

        requester
            .post(`/api/users/${member._id}/role`)
        .then(res => {
            expect(res.body).to.have.property('message');

            return requester.get('/api/users');
        }).then(res => {
            expect(res.body).to.have.property('users');
            expect(res.body.users).to.have.length(3);

            for (let index in res.body.users) {
                let user = res.body.users[index];

                expect(user).to.have.keys(...keys);

                // Check to make sure member's role was toggled
                if (user._id === member._id) {
                    expect(user.role).to.equal('admin');
                }
            }

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err);
        });
    });

    it('/api/users/:user_id/role POST should work as expected for admins', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let keys = ['_id', 'name', 'email', 'role', 'authorized', 'createdAt', 'updatedAt'];

        requester
            .post(`/api/users/${admin._id}/role`)
        .then(res => {
            expect(res.body).to.have.property('message');

            return requester.get('/api/users');
        }).then(res => {
            expect(res.body).to.have.property('users');
            expect(res.body.users).to.have.length(3);

            for (let index in res.body.users) {
                let user = res.body.users[index];

                expect(user).to.have.keys(...keys);

                // Check to make sure member's role was toggled
                if (user._id === admin._id) {
                    expect(user.role).to.equal('member');
                }
            }

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err);
        });
    });

    it('/api/users/:user_id/ownership POST should fail if the given user_id is invalid', (done) => {
        let account = mocks.stubs.account(false, true);
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post(`/api/users/${mocks.objectId()}/ownership`)
        .then(res => {
            expect(res.body).to.have.property('error');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/users/:user_id/ownership POST should fail if the current user is not an owner', (done) => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post(`/api/users/${admin._id}/ownership`)
        .then(res => {
            expect(res.body).to.have.property('error');
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/users/:user_id/ownership POST should work as expected', (done) => {
        let account = mocks.stubs.account(false, true);
        account._id = owner._id;
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();

        requester
            .post(`/api/users/${admin._id}/ownership`)
        .then(res => {
            expect(res.body).to.have.property('message');

            return requester.get('/api/users');
        }).then(res => {
            expect(res.body).to.have.property('users');

            for (let index in res.body.users) {
                let user = res.body.users[index];

                if (user._id === owner._id) {
                    // Automatically demoted to admin
                    expect(user.role).to.equal('admin');
                }
                else if (user._id === admin._id) {
                    expect(user.role).to.equal('owner');
                }
            }

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err);
        });
    });
});
