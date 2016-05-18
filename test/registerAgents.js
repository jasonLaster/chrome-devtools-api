var expect = require('expect.js');
const registerAgents = require("../js").registerAgents;

describe("registerAgents", function() {
  it("should create agent commands and events", function() {
    const text = registerAgents();
    expect(text.match(/registerCommand/g).length).to.equal(286);
    expect(text.match(/registerEvent/g).length).to.equal(104);
  })
});
