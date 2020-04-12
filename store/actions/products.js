import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const GET_PRODUCTS = 'GET_PRODUCTS';


export const fetchProducts = () => {
    return async dispatch => {
        try {
            const response = await fetch("https://playground-rn-shop-app.firebaseio.com/products.json")

            if (!response.ok) {
                throw new Error("Something went wrong when fetching products from firebase")
            }

            const data = await response.json();
            const loadedProducts = []
            for (const key in data) {
                loadedProducts.push(new Product(
                    id = key,
                    "u1",
                    data[key].title,
                    data[key].imageUrl,
                    data[key].description,
                    data[key].price
                ))
            }
            dispatch({type: GET_PRODUCTS, products: loadedProducts})
        } catch (err) {
            throw err;
        }

    }
}

export const deleteProduct = productId => {
    return async dispatch => {
        const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/products/${productId}.json`, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error("Something went wrong! Try again.")
        }

        return {type: DELETE_PRODUCT, pid: productId};
    }

};

export const createProduct = (title, description, imageUrl, price) => {
    return async dispatch => {
        const response = await fetch("https://playground-rn-shop-app.firebaseio.com/products.json", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({title, description, imageUrl, price})
        })
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                title,
                description,
                imageUrl,
                price
            }
        });

        const data = await response.json();

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: data.name,
                title,
                description,
                imageUrl,
                price
            }
        })
    }

};

export const updateProduct = (id, title, description, imageUrl) => {
    return async dispatch => {
        const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/products/${id}.json`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({title, description, imageUrl})
        })

        if (!response.ok) {
            throw new Error("Something went wrong! Try again.")
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl,
            }
        });
    }
};
