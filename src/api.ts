
interface Item {
  id: string;
  count: number;
}
interface Order {
  email: string;
  cart: Item[];
}
interface Menu {
  tags: string[];
  ids: string[];
  [values: string]: string[];
}
interface Reciept {
  orderNumber: string;
  finalDebt: number;
  total: number;
  time: string;
}
interface Result {
  success: boolean;
}

export async function getMenu(): Promise<Menu | Result> {
  return fetch('/menu', {
    method: 'GET',
  }).then((res) => res.json()).catch((err) => { console.log(err); return { success: false }; });
}
export async function refreshMenu(): Promise<Result> {
  return fetch('/menu', {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    }
  }).then((res) => res.json()).catch((err) => { console.log(err); return { success: false}; });
}

export async function checkout(order: Order): Promise<Reciept | Result> {
  return fetch('/transaction', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      "Content-type": "application/json",
    }
  }).then((res) => res.json()).catch((err) => { console.log(err); return { success: false }; });
}