import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const GET_ORDER = 'GET_ORDER';

export const getOrders = () => {
    return async (dispatch, getState) => {
        const {token, userId} = getState().auth
        try {
            const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/orders/${userId}.json?auth=${token}`)

            if (!response.ok) {
                throw new Error("Something went wrong when fetching products from firebase")
            }

            const data = await response.json();
            const loadedOrders = []
            for (const key in data) {
                loadedOrders.push(new Order(key, data[key].cartItems, data[key].totalAmount, new Date(data[key].date)))
            }
            dispatch({type: GET_ORDER, orders: loadedOrders})
        } catch (err) {
            throw err;
        }
    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const {token, userId} = getState().auth
        const date = new Date();
        const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({cartItems, totalAmount, date: date.toISOString()})
        })

        const data = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: {id: data.name, items: cartItems, amount: totalAmount, date}
        });
    }

};
