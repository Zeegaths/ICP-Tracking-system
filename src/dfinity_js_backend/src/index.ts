import { StableBTreeMap, ic, Principal, Result, Record, text, nat, Canister, query, update, Vec } from 'azle';
import { v4 as uuidv4 } from 'uuid';

const Order = Record({
    id: text,
    buyer: Principal,
    seller: Principal,
    product: text,
    status: text,
    price: nat,
    escrow: nat
});


const orders = StableBTreeMap(0, text, Order);

export default Canister({
  createOrder: update([text, nat, Principal],Result(text, text), (product, price, seller) =>  {
   const buyer = ic.caller();
   const order = { id: uuidv4(), buyer, seller, product, status: "PENDING", price, escrow: price };
   orders.insert(order.id, order);
   return Result.Ok("Order created");
 }),
 
  updateOrderStatus: update([text, text],Result(text,text), (id, status) => {
   const orderOpt = orders.get(id);
   const order = orderOpt?.Some;
   
   if (order && order.status !== "ESCROW_RELEASED") {
     order.status = status;
     orders.insert(id, order);
     return Result.Ok("Order status updated");
   }
   
   return Result.Err("Order not found");
 }),
 
 
  confirmDelivery: update([text], Result(text,text), (id) => {
     const orderOpt = orders.get(id);
     const order = orderOpt?.Some;
   
     if (order) {
       if (order.status.toString() === "DELIVERED") {
         // Release escrow to seller
         // Placeholder for actual token transfer logic
         order.escrow = BigInt(0);
         order.status = "ESCROW_RELEASED";
         orders.insert(id, order);
         return Result.Ok("Delivery confirmed, escrow released");
       }
       return Result.Err("Order not delivered yet");
     }
     
     return Result.Err("Order not found");
   }),
   
    getOrders: query([],Vec(Order), () => {
     return orders.values();
   }),

})
  

  // a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};