import React, {useState} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {AppLoading} from 'expo';
import {useFonts} from '@use-expo/font';


import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import authReducer from  "./store/reducers/auth"
import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {

    let [fontsLoaded] = useFonts({
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    });

    if (!fontsLoaded) {
        return <AppLoading/>
    }

    return (
        <Provider store={store}>
            <NavigationContainer />
        </Provider>
    );
}
