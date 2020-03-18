import React from 'react';
import Reflux from 'reflux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { PlayerStore } from '@stores/player.store';

export default class PlayerButton extends Reflux.Component {
    static propTypes = {
      openPlayer: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);

      this.store = PlayerStore;
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.openPlayer}>
                <Image
                    style={styles.button}
                    resizeMode="contain"
                    source={{uri: _.get(this.state.currentAlbum, 'images[0].url')}}
                />
            </TouchableOpacity>
        )
    }
}

let styles = StyleSheet.create({
    button: {
        height: 50,
        width: 50,
        top: 20,
        right: 0,
        alignSelf: 'center'
    }
});