import React, {useState} from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {AppLoading} from 'expo';
import { useFonts } from '@use-expo/font';
import * as Font from 'expo-font';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import ShopNavigator from './navigation/ShopNavigator';

const rootReducer = combineReducers({
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer
});

const store = createStore(rootReducer);

// const fetchFonts = () => {
//     return Font.loadAsync({
//         'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
//         'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
//     });
// };

export default function App() {
    // const [fontsLoaded, setFontsLoaded] = useState(false);

    let [fontsLoaded] = useFonts({
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    });

    if (!fontsLoaded) {
      console.log("------------------------------------")
      console.log("Font not loaded, returning...")
        return <AppLoading />
        // return (
        //     <AppLoading
        //         startAsync={fetchFonts}
        //         onFinish={() => {
        //             setFontsLoaded(true);
        //         }}
        //         onError={console.warn}
        //     />
        // );
    }

  console.log("------------------------------------")
  console.log("Font LOADED!!!!!, rendering components...")

    return (
        <Provider store={store}>
            <ShopNavigator/>
        </Provider>
    );
}
