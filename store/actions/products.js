import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const GET_PRODUCTS = 'GET_PRODUCTS';


export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const {token, userId} = getState().auth
        try {
            const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/products.json?auth=${token}`)

            if (!response.ok) {
                throw new Error("Something went wrong when fetching products from firebase")
            }

            const data = await response.json();
            const loadedProducts = []
            for (const key in data) {
                loadedProducts.push(new Product(
                    id = key,
                    data[key].ownerId,
                    data[key].title,
                    data[key].imageUrl,
                    data[key].description,
                    data[key].price
                ))
            }
            dispatch({
                type: GET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(p => p.ownerId === userId)
            })
        } catch (err) {
            throw err;
        }

    }
}

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error("Something went wrong! Try again.")
        }

        return {type: DELETE_PRODUCT, pid: productId};
    }

};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const {token, userId} = getState().auth
        const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/products.json?auth=${token}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({title, description, imageUrl, price, ownerId: userId})
        })
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
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
                price,
                ownerId: userId
            }
        })
    }

};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const response = await fetch(`https://playground-rn-shop-app.firebaseio.com/products/${id}.json?auth=${token}`, {
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
