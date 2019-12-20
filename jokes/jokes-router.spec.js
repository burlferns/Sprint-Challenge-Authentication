const request = require("supertest");

const server = require("../api/server");


// ****************************************************
// 1st test for GET /api/jokes
// Check that we can successfully get an array of jokes
// ****************************************************
describe('GET /api/jokes',()=>{
  const name="testJokes1";
  let jwtToken;

  it("Should register sucessfully & return an object with id & username",()=>{
    return request(server)
      .post("/api/auth/register")
      .send({username:name,password:"abc"})
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBeDefined();
      })
  })

  it("Should login successfully & return a token and message",()=>{
    return request(server)
      .post("/api/auth/login")
      .send({username:name,password:"abc"})
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(200);
        expect(res.body.jwtToken).toBeDefined();
        jwtToken=res.body.jwtToken;
        expect(res.body.message).toBe(`Welcome ${name}!`);
      })
  })

  it("Should successfully get the jokes array",()=>{
    return request(server)
      .get("/api/jokes")
      .set("authorization",jwtToken)
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      })
  })

})


// ****************************************************
// 2nd test for GET /api/jokes
// Check that we can not get joke becasue of using wrong token
// ****************************************************
describe('GET /api/jokes',()=>{
  const name="testJokes2";
  let jwtToken;

  it("Should register sucessfully & return an object with id & username",()=>{
    return request(server)
      .post("/api/auth/register")
      .send({username:name,password:"abc"})
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBeDefined();
      })
  })

  it("Should login successfully & return a token and message",()=>{
    return request(server)
      .post("/api/auth/login")
      .send({username:name,password:"abc"})
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(200);
        expect(res.body.jwtToken).toBeDefined();
        jwtToken=res.body.jwtToken;
        expect(res.body.message).toBe(`Welcome ${name}!`);
      })
  })

  it("Should not get the jokes array only an error message",()=>{
    return request(server)
      .get("/api/jokes")
      // .set("authorization",jwtToken)
      .set("authorization","BadToken")
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid Token");
      })
  })

})