import React from 'react'
import { Text } from 'react-native'

import _ from 'lodash';

const LstnText = (props)  =>
    <Text style={_.assign(props.style, {fontFamily: 'PressStart2P-Regular'})}>
        {props.text}
    </Text>;

export default LstnText