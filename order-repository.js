import { Entity, Schema, Client } from 'redis-om';

class Order extends Entity {}

let schema = new Schema(Order, {
  ref: { type: 'number' }, 
  status: { type: 'string' }
});

let client = await new Client().open();

export let orderRepository = client.fetchRepository(schema);

await orderRepository.createIndex();