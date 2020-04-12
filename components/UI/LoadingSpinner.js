import React from "react";
import {View, StyleSheet, ActivityIndicator} from "react-native";
import Colors from "../../constants/Colors";

const LoadingSpinner = (props) => {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default LoadingSpinner;
