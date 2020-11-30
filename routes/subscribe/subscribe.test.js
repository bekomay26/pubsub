const app = require('../../test/server')
const supertest = require('supertest')
const request = supertest(app)
const {db} = require('../../database');

const clearCityDatabase = async() => {
  await db.none('TRUNCATE TABLE subscribers');
  await db.none(
    'DELETE FROM my_subscriptions WHERE topic_name= $1',
    ['topic2']
  );
}

beforeAll(async() => {
  await db.none(
    'INSERT INTO my_subscriptions (topic_name, status) VALUES($1, $2)',
    ['topic2', 'pending']
  );
});

afterAll(() => {
  clearCityDatabase()
});

describe('POST - Send subscription request', () => {
  it('should fail due to an invalid url', async done => {

    const newSub = {url: "localhost.com"}

    const response = await request.post('/subscribe/topic1').send(newSub)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid URL')
    done()
  })

  it('should fail if topic isnt available in the hub', async done => {

    const newSub = {url: "http://localhost:3000/theevent"}

    const response = await request.post('/subscribe/topica').send(newSub)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Topic does not exist')
    done()
  })

  it('should fail due to a pending subscription already existing', async done => {

    const newSub = {url: "http://localhost:3000/theevent"}

    const response = await request.post('/subscribe/topic2').send(newSub)

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Subscription already exist')
    done()
  })

  it('should receive a subscriptionn request ', async done => {

    const newSub = {url: "http://localhost:3000/theevent"}

    const response = await request.post('/subscribe/topic3').send(newSub)

    expect(response.status).toBe(202)
    expect(response.body.message).toBe('Subscription request received and is now been verified')
    done()
  })
})