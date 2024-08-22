import { StableBTreeMap, ic, Principal, Result } from 'azle';

enum OrderStatus {
  Pending,
  Shipped,
  Delivered,
  Cancelled
}

class Order {
    id: string = '';
    buyer: Principal = ic.caller();
    seller: Principal = ic.caller();
    product: string = '';
    status: OrderStatus = OrderStatus.Pending;
    price: bigint = BigInt(0);
    escrow: bigint = BigInt(0);
}


const orders = StableBTreeMap<string, Order>(0);

export function createOrder(id: string, product: string, price: bigint, seller: Principal): Result<string, string> {
  const buyer = ic.caller();
  const order: Order = { id, buyer, seller, product, status: OrderStatus.Pending, price, escrow: price };
  orders.insert(id, order);
  return Result.Ok("Order created");
}

export function updateOrderStatus(id: string, status: OrderStatus): Result<string, string> {
  const orderOpt = orders.get(id);
  const order = orderOpt?.Some;
  
  if (order) {
    order.status = status;
    orders.insert(id, order);
    return Result.Ok("Order status updated");
  }
  
  return Result.Err("Order not found");
}


export function confirmDelivery(id: string): Result<string, string> {
    const orderOpt = orders.get(id);
    const order = orderOpt?.Some;
  
    if (order) {
      if (order.status === OrderStatus.Delivered) {
        // Release escrow to seller
        // Placeholder for actual token transfer logic
        order.escrow = BigInt(0);
        orders.insert(id, order);
        return Result.Ok("Delivery confirmed, escrow released");
      }
      return Result.Err("Order not delivered yet");
    }
    
    return Result.Err("Order not found");
  }
  
  export function getOrders(): Order[] {
    return orders.values();
  }
  
  export function CanisterMethods(): Order[] {
    return orders.values();
  }
  