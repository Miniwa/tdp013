let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server");
let should = chai.should();
let route = require("../route");

chai.use(chaiHttp);
let request = chai.request(app);

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

    describe("GET /save", () => {
        it("should save the message", (done) => {
                request.get("/save")
                .query({message: "hello"})
                .end((err, res) => {
                    res.should.have.status(200);
                    route.backend.getMessages().then((messages) => {
                        messages.length.should.eq(1);
                        done();
                    });
                });
        });
    });
})
