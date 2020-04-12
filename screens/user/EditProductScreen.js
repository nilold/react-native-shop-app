import React, {useEffect, useCallback, useReducer} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import Input from "../../components/UI/Input";
import * as productsActions from '../../store/actions/products';

const FORM_UPDATE = "UPDATE";

const formReducer = (state, action) => {
    if (action.type === FORM_UPDATE) {

        const updatedValue = {
            ...state.inputValues,
            [action.input]: action.value
        }

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }

        return {
            ...state,
            inputValues: updatedValue,
            inputValidities: updatedValidities,
            formIsValid: Object.values(updatedValidities).every(item => item)
        }
    }

    return state;
}


const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: !!editedProduct,
            imageUrl: !!editedProduct,
            description: !!editedProduct,
            price: !!editedProduct,
        },
        formIsValid: !!editedProduct
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert("Form is not valid!", "Please check what you've typed.", [{text: "Ok"}])
            return;
        }

        if (editedProduct) {
            dispatch(
                productsActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl)
            );
        } else {
            dispatch(
                productsActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price)
            );
        }
        props.navigation.goBack();
    }, [dispatch, prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, formState.inputValues.price]);

    useEffect(() => {
        props.navigation.setParams({submit: submitHandler});
    }, [submitHandler]);

    const inputChangeHandler = useCallback(
        (id, value, isValid) => {
            dispatchFormState({
                input: id,
                type: FORM_UPDATE,
                value: value,
                isValid: isValid
            })
        },
        [dispatchFormState],
    );


    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={150}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={3}
                        errorText={'Title is should be longer than 2 chars'}
                    />

                    <Input
                        id='imageUrl'
                        label='Image URL'
                        returnKeyType='next'
                        keyboardType={Platform.OS === 'ios' ? 'url' : 'default'}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={3}
                        errorText={'Url is should be longer than 2 chars'}
                    />
                    {editedProduct ? null : (
                        <Input
                            id='price'
                            label='Price'
                            keyboardType='decimal-pad'
                            returnKeyType='next'
                            onInputChange={inputChangeHandler}
                            min={0.1}
                            errorText={'Price should be greater than 0.'}
                        />
                    )}
                    <Input
                        id='description'
                        label='Description'
                        autoCapitalize='sentences'
                        autocorrect
                        multiline
                        numberOfLines={5}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        minLength={10}
                        errorText={'Description is should be longer than 9 chars'}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName={
                        Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
                    }
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
});

export default EditProductScreen;
