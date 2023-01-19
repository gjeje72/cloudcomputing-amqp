import express from 'express';
import { orderRepository as repository } from './order-repository.js';
import amqp from 'amqplib';

const queueName = 'commandes';

// create an express app and use JSON
let app = new express();
app.use(express.json());

// setup the root level GET to return status of an order
app.get('/orders/:id/status', async (req, res) => {
  let order = await repository.fetch(req.params.id);
  res.send(order.status);
});

app.put('/orders', async (req, res) => 
{
  let order = repository.createEntity();
  let connection;
  let channel;

  // set all the properties, converting missing properties to null
  order.ref = req.body.ref ?? null;
  order.status = req.body.status ?? null;

  // save the order to Redis
  let id = await repository.save(order);
  console.log(` [x] Order created : ${order.status} ${order.ref}`);
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();

    var msg = id;

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(msg), {
      persistent: true
    });
    console.log(" [x] Sent message to rabbitmq: '%s'", msg);

    await channel.close();
  }
  catch(err)
  {
      console.error(err);
  }
  finally {
    if(connection)
      await connection.close();

    // return the id of the newly created order
    res.send({ id });
  }
});

// start listening
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));