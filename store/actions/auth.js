export const SIGN_UP = 'SIGN_UP';
export const SIGN_IN = 'SIGN_IN';


export const signUp = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAY6KnMBRL0n33LWeCRyWz0g9wzMv-0eK0", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, returnSecureToken: true})
        })

        const data = await response.json()

        if (!response.ok) {
            const errorId = data.error.message;
            let message = errorId
            switch(errorId){
                case 'EMAIL_EXISTS':
                    message = "This email is already registered";
                    break
                case 'OPERATION_NOT_ALLOWED':
                    message = "OPERATION_NOT_ALLOWED";
                    break
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    message = "TOO_MANY_ATTEMPTS_TRY_LATER";
                    break
            }

            throw new Error(message)
        }

        dispatch({type: SIGN_UP})
    }
}


export const signIn = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAY6KnMBRL0n33LWeCRyWz0g9wzMv-0eK0", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, returnSecureToken: true})
        })

        const data = await response.json()

        if (!response.ok) {
            const errorId = data.error.message;
            let message = errorId
            switch(errorId){
                case 'EMAIL_NOT_FOUND':
                    message = "User not found";
                    break
                case 'INVALID_PASSWORD':
                    message = "Invalid password!";
                    break
                case 'USER_DISABLED':
                    message = "Invalid password!";
                    break
            }

            throw new Error(message)
        }

        dispatch({type: SIGN_IN})
    }
}