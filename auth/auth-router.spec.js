const request = require("supertest");

const server = require("../api/server");


// ****************************************************
// 1st test for POST /api/auth/register
// Check that there is a username in the body
// ****************************************************
describe('POST /api/auth/register',()=>{
  it("Should indicate missing username",()=>{
    return request(server)
      .post("/api/auth/register")
      .send({NOusername:"1stguy",password:"qaz"})
      .then(res=>{
        expect(res.status).toBe(400);
        expect(res.body.message)
          .toBe("missing required username field in body data")
      })
  })
})

// ****************************************************
// 2nd test for POST /api/auth/register
// Check that we can do a successful register
// ****************************************************
describe('POST /api/auth/register',()=>{
  const name = "testRegister"

  it("Should register sucessfully & return an object with id & username",()=>{
    return request(server)
      .post("/api/auth/register")
      .send({username:name,password:"abc"})
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBe(name);
      })
  })
})


// ****************************************************
// 1st test for POST /api/auth/login
// Check that there is a successful login
// ****************************************************
describe('POST /api/auth/login',()=>{
  const name="testLogin1"

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
        expect(res.body.message).toBe(`Welcome ${name}!`);
      })
  })

})


// ****************************************************
// 2nd test for POST /api/auth/login
// Check that there is a unsuccessful login becasue of bad password
// ****************************************************
describe('POST /api/auth/login',()=>{
  const name="testLogin2"

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

  it("Should login unsuccessfully & return a message",()=>{
    return request(server)
      .post("/api/auth/login")
      .send({username:name,password:"def"})
      .then(res=>{
        // console.log("This is the response:",res.body);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid Credentials");
      })
  })

})


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