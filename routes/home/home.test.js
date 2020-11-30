const app = require('../../test/server')
const supertest = require('supertest')
const request = supertest(app)
const {db} = require('../../database');

const clearCityDatabase = async() => {
  await db.none('TRUNCATE TABLE my_subscriptions');
}

beforeAll(async() => {
  await db.none(
    'INSERT INTO my_subscriptions (topic_name, status) VALUES($1, $2)',
    ['topic1', 'pending']
  );
});

afterAll(() => {
  return clearCityDatabase();
});

describe('POST - receive update', () => {
  it('should receive a new update ', async done => {

    const newUpdate = {
      update: {message: "Hello"},
      topic: 'topic1'
    }

    const response = await request.post('/').send(newUpdate)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Update received')
    done()
  })
})

describe('GET - Subscriber verifies subscription request', () => {
  it('should acknowledge that it sent request if has a pending request with the topic name in its db', async done => {

    const response = await request.get('/?mode=subscribe&topic=topic1&challenge=1234')

    expect(response.status).toBe(202)
    expect(response.body.challenge).toBe('1234')
    done()
  })

  it('should reject that it sent request if doesnt have a pending request with the topic name in its db', async done => {

    const response = await request.get('/?mode=subscribe&topic=topict&challenge=1234')

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    done()
  })
})

describe('POST - Gets notified on the verification status', () => {
  it('should update verification status', async done => {

    const notification = {
      status: 'ACCEPTED',
      topic: 'topic1'
    }

    const response = await request.post('/verified').send(notification)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    done()
  })
})

describe('GET - Get all updates received', () => {
  it('should create a new update ', async done => {

    const updates = [{ id: 1, message: "Hello", topic_name: 'topic1'}]

    const response = await request.get('/event')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('All updates retrieved')
    // expect(response.body.updates).toMatchObject(updates)
    done()
  })
})