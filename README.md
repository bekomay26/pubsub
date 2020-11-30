# Pubsub

An application that provides a means of communication between a publisher and its subscribers.

### Key components

**Subscriber**: The entity that subscribes to a publisher's topic in order to receive update notifications for the topic.

**Publisher**: Entity that provides a topic for others to subscribe to. It also sends updates for that topic. 

**Hub**: It handles and validate subscription requests. It also distributes updates from a publisher to the subscribers.

### Get Started

- Run `psql -U <username> -d <myDataBase> -a -f pubsub.sql` and input password when prompted to migrate the database schema

**Using Docker**
- run `docker-compose up`

**Without Docker**
- Start redis server 
    - `brew services start redis` (on mac)
    - `sudo service redis-server start` (on windows)
- run `npm run dev`

### API Endpoints

* Verify subscription       - GET `/?challenge=<challenge>&topic=<topic>`
* Receive update            - POST `/`
* Subscribe to a topic      - POST `subscribe/:topic`
* Publish a topic           - POST `publish/:topic`
* Notify the subscriber of verification status            - POST `/verified`
* View all updates           - POST `/event`



### Publication flow
![alt text](https://res.cloudinary.com/dffiyhgto/image/upload/v1606681446/Publishing_Flow.png)

### Subscription flow
![alt text](https://res.cloudinary.com/dffiyhgto/image/upload/v1606681448/subscription_flow_1.png)
