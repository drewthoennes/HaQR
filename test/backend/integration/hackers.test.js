require('module-alias/register');
const mocks = require('@t/mocks');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require('sinon');
const server = require('@t/backend/utils/server');
const mongo = require('@t/backend/utils/mongo');
const mongoose = require('mongoose');
const faker = require('faker');

let app;

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const interactionsController = require('@b/controllers/interaction');
const middlware = require('@b/middleware');

const stubInteractions = () => {
    sinon.stub(interactionsController, 'createInteraction').callsFake(() => mocks.promise.resolve());
}

const stubAuthAndStart = (account, authorized) => {
    sinon.stub(middlware, 'authorize').callsFake(config => mocks.stubs.authMiddleware(account, authorized, config));
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
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            description: faker.random.words(),
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
            expect(res.body).to.have.property('hacker_qr');

            return requester.get('/api/hackers');
        }).then(res => {
            expect(res.body).to.have.property('hackers');
            expect(res.body.hackers).to.have.lengthOf(1);
            expect(res.body.hackers[0]).to.eql({
                active: false,
                name: hacker.name,
                email: hacker.email,
                description: hacker.description,
                qr: hacker.qr,
                role: hacker.role,
                createdAt: res.body.hackers[0].createdAt,
                updatedAt: res.body.hackers[0].updatedAt
            });

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers POST should fail if user is not an admin', done => {
        let account = mocks.stubs.account();
        stubInteractions();
        stubAuthAndStart(account, true);

        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number(),
            role: mocks.objectId()
        };

        chai.request(app).post('/api/hackers').send(hacker)
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => {
            done(err)
        });
    });

    it('/api/hackers POST should fail if missing required fields', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .post('/api/hackers')
            .send({
                name: faker.name.findName(),
                email: faker.internet.email()
            })
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => done(err));
    });

    it('/api/hackers POST should fail if trying to create a hacker with an already-used qr', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
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
            expect(res.body).to.have.property('hacker_qr');

            return requester.post('/api/hackers').send(hacker);
        }).then(res => {
            expect(res.body).to.have.property('error');

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr GET should resolve if member', done => {
        let account = mocks.stubs.account();
        stubInteractions();
        stubAuthAndStart(account, true);

        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number(),
            role: mocks.objectId()
        };

        chai.request(app)
            .get('/api/hackers')
        .then(res => {
            expect(res.body).to.have.property('hackers');

            done();
        }).catch(err => {
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr GET should fail if the given qr is invalid', done => {
        let account = mocks.stubs.account();
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .get('/api/hackers/invalid')
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => done(err));
    });

    it('/api/hackers/:hacker_qr GET should fail if the given qr does not exist', done => {
        let account = mocks.stubs.account();
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app)
            .get(`/api/hackers/${mongoose.Types.ObjectId()}`)
        .then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => done(err));
    });

    it('/api/hackers/:hacker_qr GET should work as expected', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            description: faker.random.words(),
            qr: faker.random.number()
        };

        requester
            .post('/api/roles')
            .send(role)
        .then(res => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('role_id');

            // Append role_id
            hacker = Object.assign(hacker, {role: res.body.role_id});

            return requester.post('/api/hackers').send(hacker);
        }).then(res => {
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('hacker_qr');

            return requester.get(`/api/hackers/${res.body.hacker_qr}`);
        }).then(res => {
            expect(res.body).to.have.property('hacker');
            expect(res.body.hacker).to.eql({
                active: false,
                name: hacker.name,
                email: hacker.email,
                description: hacker.description,
                qr: hacker.qr,
                role: hacker.role,
                fields: role.fields.map(field => {
                    return {
                        name: field.name,
                        attributes: field.attributes.map(attribute => {
                            return {
                                had: false,
                                name: attribute
                            }
                        })
                    }
                }),
                createdAt: res.body.hacker.createdAt,
                updatedAt: res.body.hacker.updatedAt
            });

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr POST should fail if sent fields are invalid', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number()
        };
        let fields = [
            {
                name: faker.random.word(),
                attributes: [
                    {name: faker.random.word()}, // Missing `had` field
                    {had: false, name: faker.random.word()}
                ]
            },
            {
                // Missing `name` field
                attributes: [
                    {had: false, name: faker.random.word()},
                    {had: false, name: faker.random.word()}
                ]
            }
        ];
        let hacker_qr;

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
            expect(res.body).to.have.property('hacker_qr');

            hacker_qr = res.body.hacker_qr;

            return requester.post(`/api/hackers/${hacker_qr}`).send({fields: fields});
        }).then(res => {
            expect(res.body).to.have.property('error');

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr POST should fail if attribute names differ from hacker attributes', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number()
        };
        let fields = [
            {
                name: role.fields[0].name,
                attributes: [
                    {had: false, name: role.fields[0].attributes[0].name},
                    {had: false, name: role.fields[0].attributes[1].name}
                ]
            },
            {
                name: role.fields[1].name,
                attributes: [
                    {had: false, name: role.fields[1].attributes[0].name},
                    {had: false, name: faker.random.word()} // This should differ from the name of this attribute in the role
                ]
            }
        ];
        let hacker_qr;

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
            expect(res.body).to.have.property('hacker_qr');

            hacker_qr = res.body.hacker_qr;

            return requester.post(`/api/hackers/${hacker_qr}`).send({fields: fields});
        }).then(res => {
            expect(res.body).to.have.property('error');

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr POST should fail if qr is invalid', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number()
        };
        let fields = role.randomFields();

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
            expect(res.body).to.have.property('hacker_qr');

            return requester.post(`/api/hackers/${faker.random.number()}`).send({fields: fields});
        }).then(res => {
            expect(res.body).to.have.property('error');

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr POST should work as expected', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            description: faker.random.words(),
            qr: faker.random.number()
        };
        let fields = role.randomFields();
        let hacker_qr;

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
            expect(res.body).to.have.property('hacker_qr');

            hacker_qr = res.body.hacker_qr;

            return requester.post(`/api/hackers/${hacker_qr}`).send({fields: fields});
        }).then(res => {
            expect(res.body).to.have.property('message');

            return requester.get(`/api/hackers/${hacker_qr}`);
        }).then(res => {
            expect(res.body).to.have.property('hacker');
            expect(res.body.hacker).to.eql({
                active: false,
                name: hacker.name,
                email: hacker.email,
                description: hacker.description,
                qr: hacker.qr,
                fields: fields,
                role: hacker.role,
                createdAt: res.body.hacker.createdAt,
                updatedAt: res.body.hacker.updatedAt
            });

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr/active POST should fail if user is not an admin', done => {
        let account = mocks.stubs.account();
        stubInteractions();
        stubAuthAndStart(account, true);

        chai.request(app).post(`/api/hackers/${mocks.objectId()}/active`).then(res => {
            expect(res.body).to.have.property('error');

            done();
        }).catch(err => {
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr/active POST should work as expected', done => {
        let account = mocks.stubs.account(true);
        stubInteractions();
        stubAuthAndStart(account, true);

        let requester = chai.request(app).keepOpen();
        let role = mocks.stubs.role();
        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number()
        };
        let hacker_qr;

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
            expect(res.body).to.have.property('hacker_qr');

            hacker_qr = res.body.hacker_qr;

            return requester.post(`/api/hackers/${hacker_qr}/active`);
        }).then(res => {
            expect(res.body).to.have.property('message');

            return requester.get(`/api/hackers/${hacker_qr}`);
        }).then(res => {
            expect(res.body).to.have.property('hacker');
            expect(res.body.hacker).to.have.property('active');
            expect(res.body.hacker.active).to.be.true;

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });
});
