import {ADD_ORDER, GET_ORDER} from '../actions/orders';
import Order from '../../models/order';

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDER:
            return {
                orders: action.orders
            }
        case ADD_ORDER:
            const newOrder = new Order(
                action.id,
                action.orderData.items,
                action.orderData.amount,
                action.date
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
    }

    return state;
};
