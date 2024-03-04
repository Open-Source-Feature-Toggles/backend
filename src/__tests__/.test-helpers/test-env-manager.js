const CreateApp = require('../../app');
const {
  connect,
  disconnect,
  clearDatabase,
} = require('../../config/in-memory-mongo.config');
const { client } = require('../../config/redis.config');

async function SetupTestEnv() {
  await connect();
  app = CreateApp();
  return app;
}

async function clearRedisCache() {
  return await client.sendCommand(['FLUSHALL']);
}

async function TakeDownTestEnv() {
  await disconnect();
  await clearRedisCache();
}

function ParseCookie(response_object) {
  let cookie = response_object.headers['set-cookie'][0]
    .split(';')[0]
    .split('=');
  let cookie_name = cookie[0];
  let jwt = cookie[1];
  cookie = `${cookie_name}=${jwt}`;
  return { cookie, cookie_name, jwt };
}

module.exports = {
  SetupTestEnv,
  TakeDownTestEnv,
  ParseCookie,
  clearDatabase,
};
