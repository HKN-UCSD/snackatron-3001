
interface Item {
  id: string;
  count: number;
}
interface Order {
  email: string;
  cart: Item[];
}

export async function getMenu() {
  return fetch('/menu', {
    method: 'GET',
  }).then((res) => res.json());
}
export async function refreshMenu() {
  return fetch('/menu', {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    }
  }).then((res) => res.json());
}

export async function checkout(order : Order) {
  return fetch('/transaction', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      "Content-type": "application/json",
    }
  }).then((res) => res.json());
}