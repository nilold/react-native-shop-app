import React, {useEffect} from "react";
import {AsyncStorage} from "react-native";
import {useDispatch} from "react-redux";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import {authenticate} from "../store/actions/auth";

const StartUpScreen = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const trySignIn = async () => {
            const userData = await AsyncStorage.getItem("userData")

            if(!userData){
                props.navigation.navigate("Auth");
                return;
            }

            const {token, userId, expDate } = JSON.parse(userData)
            const expirationDate = new Date(expDate)

            if (expirationDate <= new Date() || !token || !userId){
                props.navigation.navigate("Auth");
                return;
            }

            const expTime = expirationDate.getTime() - (new Date()).getTime()
            props.navigation.navigate("Shop");
            dispatch(authenticate(userId, token, expTime))
        };
        trySignIn();
    }, [dispatch])

    return <LoadingSpinner/>
};

export default StartUpScreen;
