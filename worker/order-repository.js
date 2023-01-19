import { Entity, Schema, Client } from 'redis-om';

class Order extends Entity {}

let schema = new Schema(Order, {
  dish: { type: 'string' }, 
  status: { type: 'string' }
});

let client = await new Client().open(
  `redis://${(process.env.EXECUTION_ENVIRONMENT === 'production')?'redis':'localhost'}:6379`
);

export let orderRepository = client.fetchRepository(schema);

await orderRepository.createIndex();