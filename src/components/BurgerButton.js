import React from 'react'
import PropTypes from 'prop-types';
import {
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

const BurgerButton = (props)  =>
    <TouchableOpacity onPress={props.openDrawer}>
        <Image
            style={styles.burger}
            resizeMode="contain"
            source={require('@assets/pics/burger.png')}
        />
    </TouchableOpacity>;

BurgerButton.propTypes = {
    openDrawer: PropTypes.func.isRequired
};

let styles = StyleSheet.create({
    burger: {
        height: 30,
        width: 30,
        top: 40,
        right: 10,
        alignSelf: 'flex-end'
    }
});

export default BurgerButton