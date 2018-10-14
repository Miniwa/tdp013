let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server");
let should = chai.should();
let route = require("../route");
let server = null;

chai.use(chaiHttp);

describe("Backend", () => {
    afterEach((done) => {
        route.backend.connect().then((db) => {
            db.collection("messages").deleteMany({});
            done();
        }).catch((err) => {
            done();
        });
    });

    it("should return 404 on invalid route", (done) => {
        chai.request(app).get("/invalid")
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });
    });

    describe("GET /getall", () => {
        it("should return all messages in descending order", (done) => {
            route.backend.createMessage({message: "hello"}).then((id1) => {
                route.backend.createMessage({message: "hi"}).then((id2) => {
                    chai.request(app).get("/getall")
                    .end((err, res) => {
                        res.should.have.status(200);
                        result = res.body;

                        result.length.should.eq(2);
                        result[0]._id.toString().should.eq(id2);
                        result[0].message.should.eq("hi");
                        result[1].flag.should.eq(true);
                        result[1]._id.toString().should.eq(id1);
                        result[1].message.should.eq("hello");
                        result[1].flag.should.eq(true);
                        done();
                    });
                }).catch((err) => {
                    done();
                });
            }).catch((err) => {
                done();
            });
        });

        it("should return empty array if no messages", (done) => {
            chai.request(app).get("/getall")
            .end((err, res) => {
                res.should.have.status(200);
                result = res.body;
                result.length.should.eq(0);
                done();
            });
        });

        it("should return 405 on invalid verb", (done) => {
            chai.request(app).post("/getall")
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
        });
    });

    describe("GET /save", () => {
        it("should save the message", (done) => {
            chai.request(app).get("/save")
            .query({message: "hello"})
            .end((err, res) => {
                res.should.have.status(200);
                route.backend.getMessages().then((messages) => {
                    messages.length.should.eq(1);
                    messages[0].message.should.eq("hello");
                    messages[0].flag.should.eq(true);
                    done();
                }).catch((err) => {
                    done();
                });
            });
        });

        it("should return 400 on missing request parameter", (done) => {
            chai.request(app).get("/save")
            .end((err, res) => {
                res.should.have.status(400);
                route.backend.getMessages().then((messages) => {
                    messages.length.should.eq(0);
                    done();
                }).catch((err) => {
                    done();
                });
            });
        });

        it("should return 400 on invalid request parameter", (done) => {
            chai.request(app).get("/save")
            .query({message: ""})
            .end((err, res) => {
                res.should.have.status(400);
                route.backend.getMessages().then((messages) => {
                    messages.length.should.eq(0);
                    done();
                }).catch((err) => {
                    done();
                });
            });
        });

        it("should return 405 on invalid verb", (done) => {
            chai.request(app).post("/save")
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
        });
    });

    describe("GET /flag", () => {
        it("should flag the message read", (done) => {
            route.backend.createMessage({message: "hello"}).then((id) => {
                chai.request(app).get("/flag")
                .query({id: id})
                .end((err, res) => {
                    res.should.have.status(200);
                    route.backend.getMessages().then((messages) => {
                        messages.length.should.eq(1);
                        messages[0].message.should.eq("hello");
                        messages[0].flag.should.eq(false);
                        done();
                    }).catch((err) => {
                        done();
                    });
                });
            }).catch((err) => {
                done();
            });
        });

        it("should return 400 on invalid id", (done) => {
            chai.request(app).get("/flag")
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it("should return 500 if id does not exist in database", (done) => {
            chai.request(app).get("/flag")
            .query({id: "aaaaaaaaaaaaaaaaaaaaaaaa"})
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });

        it("should return 405 on invalid verb", (done) => {
                chai.request(app).post("/flag")
                .end((err, res) => {
                    res.should.have.status(405);
                    done();
                });
        });
    });
})
