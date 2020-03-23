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

const interactionsController = require('@b/controllers/interaction');
const userController = require('@b/controllers/user');
const middlware = require('@b/middleware');
const c = require('@b/const');

const stubAuthAndStart = (account, authorized) => {
    sinon.stub(middlware, 'authorize').callsFake(config => mocks.stubs.authMiddleware(account, authorized, config));
    app = server.getNewApp();
}

const createUser = (github, name, email, authorized, admin) => {
    return userController.findOrCreateUser({github: {username: github}}, name, email, github, authorized, admin);
}

const createInteraction = (description, type, user_id) => {
    return interactionsController.createInteraction(description, type, user_id);
}

describe('Interactions routes should work as expected', () => {
    let first;
    let second;
    let user;

    beforeEach(done => {

        mongo.beforeEach().then(() => {
            let user = mocks.stubs.user(true, 'owner');
            return createUser(user.github.username, user.name, user.email, true, true);
        }).then(usr => {
            user = usr;
            return createInteraction('This is the first interaction', c.interactions.CREATE, user._id);
        }).then(interaction => {
            first = interaction;

            return createInteraction('This is the second interaction', c.interactions.DELETE, user._id);
        }).then(interaction => {
            second = interaction;
            done();
        });
    });

    afterEach(done => {
        mongo.afterEach().then(() => {
            return sinon.restore();
        }).then(() => done());
    });

    after(() => server.killSession());

    it('/api/interactions GET should work as expected', done => {
        let account = Object.assign(mocks.stubs.account(), {_id: user._id});
        stubAuthAndStart(account, true);

        let keys = ['_id', 'type', 'description', 'user', 'createdAt'];

        chai.request(app)
            .get('/api/interactions')
        .then(res => {
            expect(res.body).to.have.property('interactions');
            expect(res.body.interactions).to.have.length(2);

            for (let index in res.body.interactions) {
                let interaction = res.body.interactions[index];

                expect(interaction).to.have.property('user');
                expect(interaction.user.name).to.equal(user.name);

                if (interaction._id == first._id) {
                    expect(interaction).to.have.keys(...keys);
                    expect(interaction.type).to.equal(first.type);
                    expect(interaction.description).to.equal(first.description);
                }
                else if (interaction._id == second._id) {
                    expect(interaction).to.have.keys(...keys);
                    expect(interaction.type).to.equal(second.type);
                    expect(interaction.description).to.equal(second.description);
                }
                else {
                    done(new Error('Received unexpected interactions'));
                    return;
                }
            }

            done();
        }).catch(err => {
            done(err);
        });
    });

    it('/api/interactions DELETE should work as expected', done => {
        let account = Object.assign(mocks.stubs.account(), {_id: user._id});
        stubAuthAndStart(account, true);

        done();
    });

    it('/api/interactions/:interaction_id DELETE should work as expected', done => {
        let account = Object.assign(mocks.stubs.account(), {_id: user._id});
        stubAuthAndStart(account, true);

        done();
    });
});
