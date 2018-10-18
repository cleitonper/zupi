const NodeEnvironment = require('jest-environment-node');
const MongodbMemoryServer = require('mongodb-memory-server').default;

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    this.global.mongod = new MongodbMemoryServer();
    await super.setup();
  }

  async teardown() {
    this.global.mongod.stop();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
