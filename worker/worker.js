import amqp from 'amqplib';
import { orderRepository as repository } from './order-repository.js';

const queueName = 'commandes';

let connection;
let channel;
let receivedMessages = [];

async function consume () {
  try {
    connection = await amqp.connect(`amqp://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'rabbitmq':'localhost'}:5672`);
    channel = await connection.createChannel();
    
    await channel.assertQueue(queueName, { durable: true });
    await channel.consume(queueName, (message) => {
      let receivedMessage = JSON.parse(message.content.toString());
      receivedMessages.push(receivedMessage);
      console.log(" [x] Received message from rabbitmq: '%s'", receivedMessage.message);
      try
      {
        Promise.all(receivedMessages.map(async (element) => 
        {
          let order = await repository.fetch(element.id);
          order.status = 'commande traitée';
          let updatedOrderid = await repository.save(order);
          const index = receivedMessages.indexOf(element);
          if (index > -1) 
            receivedMessages.splice(index, 1);
          console.log(" [x] Order '%s' updated to status 'commande traitée.'", updatedOrderid)
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