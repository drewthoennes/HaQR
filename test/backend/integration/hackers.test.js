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

const middlware = require('@b/middleware');

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

    it('/api/hackers/:hacker_qr GET should resolve if member', done => {
        let account = mocks.stubs.account();
        stubAuthAndStart(account, true);

        let hacker = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            qr: faker.random.number(),
            role: mocks.objectId()
        };

        chai.request(app).get('/api/hackers').send(hacker)
        .then(res => {
            expect(res.body).to.have.property('hackers');

            done();
        }).catch(err => {
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr GET should fail if the given qr is invalid', done => {
        let account = mocks.stubs.account();
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
                active: true,
                name: hacker.name,
                email: hacker.email,
                qr: hacker.qr,
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
                })
            });

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });

    it('/api/hackers/:hacker_qr POST should fail if not admin', done => {
        let account = mocks.stubs.account();
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

    it('/api/hackers GET POST should work as expected', done => {
        let account = mocks.stubs.account(true);
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
            expect(res.body).to.have.property('hacker_qr');

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

    it('/api/hackers/:hacker_qr POST should fail if sent fields are invalid', done => {
        let account = mocks.stubs.account(true);
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

    it('/api/hackers/:hacker_qr POST should fail if qr is invalid', done => {
        let account = mocks.stubs.account(true);
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
        let fields = [
            {
                name: faker.random.word(),
                attributes: [
                    {had: false, name: faker.random.word()},
                    {had: false, name: faker.random.word()}
                ]
            },
            {
                name: faker.random.word(),
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
            expect(res.body).to.have.property('message');

            return requester.get(`/api/hackers/${hacker_qr}`);
        }).then(res => {
            expect(res.body).to.have.property('hacker');
            expect(res.body.hacker).to.eql({
                active: true,
                name: hacker.name,
                email: hacker.email,
                qr: hacker.qr,
                fields: fields
            });

            requester.close();
            done();
        }).catch(err => {
            requester.close();
            done(err)
        });
    });
});
