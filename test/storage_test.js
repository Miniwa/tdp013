let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server");
let should = chai.should();
let route = require("../route");
let server = null;

chai.use(chaiHttp);

describe("Backend", () => {
    after((done) => {
        route.backend.connect().then((db) => {
            db.collection("messages").deleteMany({});
            done();
        }).catch((err) => {
            console.error(err);
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

    describe("GET /save", () => {
        it("should save the message", (done) => {
            chai.request(app).get("/save")
            .query({message: "hello"})
            .end((err, res) => {
                res.should.have.status(200);
                route.backend.getMessages().then((messages) => {
                    messages.length.should.eq(1);
                    messages[0].text.should.eq("hello");
                    messages[0].unread.should.eq(true);
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
                });
            });
        });
    });
})
