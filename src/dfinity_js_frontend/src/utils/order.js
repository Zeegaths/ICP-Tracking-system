export async function createOrder(product, price, seller) {
  return window.canister.order.createOrder(product, price, seller);
}
export async function updateOrderStatus(id, status) {
  return window.canister.order.updateOrderStatus(id, status);
}
export async function confirmDelivery(id) {
  return window.canister.order.confirmDelivery(id);
}
export async function getOrders() {
  try {
    return await window.canister.order.getOrders();
  } catch (err) {
    console.log(err)
    return [];
  }
}