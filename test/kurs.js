const mongoose = require('mongoose');
const Kurs = require('../models/Kurs');

// Importing Test Tools

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const should = chai.should();

// Using Http from chai
chai.use(chaiHttp);

// Cleaning the Database After Each Testing

describe('Kurs', () => {

    after(function (done) {
        mongoose.connection.close(done)
    })

    describe('Scraping BCA kurs', () => {
        it('should return http status created', (done) => {
            chai.request(server)
                .get('/api/indexing')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object')
                    res.body.data.length.should.be.eql(16)
                    done();
                });
        });
    });

    describe('GET kurs with params date', () => {
        context("When There's a match", () => {
            it('Should Return searched data ', (done) => {
                chai.request(server)
                    .get('/api/kurs?startdate=2019-03-08&enddate=2019-04-08')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object')
                        res.body.data.length.should.not.eql(0);

                        done();
                    });
            });
        });

        context("When There's no match", () => {
            it('Should Return Error message', (done) => {
                chai.request(server)
                    .get('/api/kurs/startdate=1888-05-19&enddate=1888-06-19')
                    .end((err, res) => {
                        res.body.should.be.a('object');
                        res.body.should.have.property('data').eql("no match found")

                        done()
                    });
            });
        });
    });


    describe('GET with params Symbol and date', () => {
        context("When there's a match", () => {
            it('should return searched data', (done) => {
                chai.request(server)
                    .get('/api/kurs/USD')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('data').should.be.a('object')
                        done();
                    })
            })
        })

        context("When there's no match", () => {
            it('should return error message', (done) => {
                chai.request(server)
                    .get('/api/kurs/INA')
                    .end((err, res) => {
                        res.should.have.status(404)
                        res.body.should.be.a('object')
                        res.body.should.have.property('status').eql('error')

                        done()
                    })
            })
        })
    })

    describe('POST Kurs BCA', () => {
        context('Successfully Adding new Kurs', () => {
            it('should return saved data', (done) => {
                chai.request(server)
                    .post('/api/kurs')
                    .send({
                        "symbol": "USD",
                        "e_rate": {
                            "jual": 1803.55,
                            "beli": 177355
                        },
                        "tt_counter": {
                            "jual": 1803.55,
                            "beli": 177355
                        },
                        "bank_notes": {
                            "jual": 1803.55,
                            "beli": 177355
                        },
                        "date": "2018-05-16"
                    })
                    .end((err, res) => {
                        res.should.have.status(201)
                        res.body.should.be.a('object')
                        res.body.should.have.property('data').property('symbol').eql('USD')
                        res.body.should.have.property('data').property('e_rate').property('jual').eql(1803.55)

                        done()
                    })
            })
        })
    })

    describe('PUT update kurs BCA', () => {
        it('should update data symbol', (done) => {
            chai.request(server)
                .put('/api/kurs/5c827562b93b9a2511dc96c0')
                .send({
                    "symbol": "AAA",
                    "e_rate": {
                        "jual": 1803.55,
                        "beli": 177355
                    },
                    "tt_counter": {
                        "jual": 1803.55,
                        "beli": 177355
                    },
                    "bank_notes": {
                        "jual": 1803.55,
                        "beli": 177355
                    },
                    "date": "2018-05-16"
                })
                .end((err, res) => {
                    res.should.have.status(202)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data').property('symbol').eql('AAA')

                    done()
                })
        })
    })

    describe('DELETE Kurs Bca', () => {
        it('should Delete data by date', (done) => {
            chai.request(server)
                .delete('/api/kurs/2019-05-16')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('status').eql('deleted')

                    done();
                })
        })
    })
});