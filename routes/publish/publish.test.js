const app = require('../../test/server')
const supertest = require('supertest')
const request = supertest(app)
const {db} = require('../../database');



beforeAll(async() => {
  await db.none(
    'INSERT INTO subscribers (topic, status, callback_url, topic_id) VALUES($1, $2, $3, $4)',
    ['topic2', 'subscribe', 'http://localhost:3000', 1]
  );
});

afterAll(async() => {
  await db.none('TRUNCATE TABLE updates');
  await db.none('TRUNCATE TABLE subscribers');
});

describe('POST - publish updates', () => {
  it('should publish a new update ', async done => {

    const newUpdate = {
      "message": "fdgfghgh"
    }

    const response = await request.post('/publish/topic1').send(newUpdate)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Message published')
    done()
  })
})