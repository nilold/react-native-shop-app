import React, {useState, useReducer, useCallback, useEffect} from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    Alert
} from 'react-native';
import {useDispatch} from "react-redux";
import {LinearGradient} from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import {signIn, signUp} from "../../store/actions/auth";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE"

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const inputValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        const inputValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        const formIsValid = Object.values(inputValidities).every(i => i)

        return {
            inputValues,
            inputValidities,
            formIsValid
        }
    }
    return state;
}

const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert("Error", error, [{text: "Ok"}])
        }
    }, [error])

    const signUpHandler = async () => {
        const action = isSignUp ? signUp : signIn
        setIsLoading(true)
        setError(null)

        try {
            await dispatch(action(formState.inputValues.email, formState.inputValues.password))
        } catch (e) {
            setError(e.message)
        }

        setIsLoading(false)
    }

    const inputChangeHandler = useCallback(
        (input, value, isValid) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value,
                isValid,
                input
            })
        },
        [dispatchFormState],
    );

    if (isLoading) {
        return <LoadingSpinner/>
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            <Button title={isSignUp ? "Sign Up" : "Login"}
                                    color={Colors.primary}
                                    onPress={signUpHandler}/>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                                color={Colors.accent}
                                onPress={() => setIsSignUp(isSignUp => !isSignUp)}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;
