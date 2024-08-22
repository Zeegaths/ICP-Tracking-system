import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as orderIdlFactory } from '../../declarations/dfinity_js_backend';

const agent = new HttpAgent();
const orderActor = Actor.createActor(orderIdlFactory, { agent, canisterId: process.env.ORDER_CANISTER_ID });

const App = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const ordersList = await orderActor.getOrders();
    setOrders(ordersList);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order Tracking System</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.product} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
