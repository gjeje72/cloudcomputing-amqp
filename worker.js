import amqp from 'amqplib';
import { orderRepository as repository } from './order-repository.js';

const queueName = 'commandes';

let connection;
let channel;
let receivedMessage = [];

async function consume () {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    
    await channel.assertQueue(queueName, { durable: true });
    await channel.consume(queueName, (message) => {
      receivedMessage.push(message.content.toString());
      console.log(" [x] Received message from rabbitmq: '%s'", message.content.toString());
      try
      {
        Promise.all(receivedMessage.map(async (element) => 
        {
          let order = await repository.fetch(element);
          order.status = 'confirmed';
          let updatedOrderid = await repository.save(order);
          const index = receivedMessage.indexOf(element);
          if (index > -1) 
            receivedMessage.splice(index, 1);
          console.log(" [x] Order '%s' updated", updatedOrderid)
        })).then(() => {
          console.log(' [*] Waiting for messages. To exit press CTRL+C');
        })
      }
      catch(err)
      {
        console.warn(err)
      }
    }, { noAck: true });
    console.log(' [*] Waiting for messages. To exit press CTRL+C');
  } catch (err) {
    console.warn(err);
  }
}

consume();