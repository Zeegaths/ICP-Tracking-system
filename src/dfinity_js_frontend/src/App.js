import React, { useState, useEffect, useCallback } from 'react';
import Cover from './components/utils/Cover';
import { getOrders, createOrder } from './utils/order';
import { login } from './utils/auth';
import AddOrder from './components/order/AddOrder';
import { Container } from 'react-bootstrap';
const App = () => {
  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principal;
  const title = "Order"

  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      setOrders(await getOrders());
    } catch (error) {
      console.log({ error });
    }
  });
  const save = async (product, price) => {
    try {
      let seller = principal;
      price = parseInt(price, 10);
      await createOrder(product,price, seller);
      fetchOrders();
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if(isAuthenticated){
      fetchOrders()
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? (
        <Container flued="md">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Tracking System</h1>
        <AddOrder save={save} />
        </div>
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              {order.product} - Status: {order.status}
            </li>
          ))}
        </ul>
        </Container>) : <Cover title={title} login={login} />}
    </>
  );
};

export default App;
