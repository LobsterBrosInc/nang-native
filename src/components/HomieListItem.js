import React from 'react'
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native'

import LstnText from '@components/LstnText'

export default class HomieListItem extends React.Component {
    static propTypes = {
        homie: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            trackName: '',
            artistName: ''
        };
    }

    async componentDidMount() {
        let trackId = this.props.homie.currentTrackIds[this.props.homie.currentTrackIndex];
        try {
            let accessToken  = await AsyncStorage.getItem('LstnSpotifyAccessToken');
            let response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            let json = await response.json();
            this.setState({
                trackName: json.name,
                artistName: json.artists[0].name
            });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <View style={styles.listItem}>
                <LstnText text={this.props.homie.username} style={{fontSize: 15, textAlign: 'center'}}/>
                <LstnText text={`${this.state.trackName} λ ${this.state.artistName}`}style={{fontSize: 13, textAlign: 'center'}}/>
            </View>
        );
    }
}


let styles = StyleSheet.create({
    listView: {
        marginTop: 50
    },
    listItem: {
        height: 50
    }
});