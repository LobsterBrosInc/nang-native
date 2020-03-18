import React from 'react';
import Reflux from 'reflux';

import {
  View,
  ListView,
  StyleSheet,
  NativeModules,
  TouchableOpacity
} from 'react-native';

const { NangController } = NativeModules;

import BurgerButton from './BurgerButton'
import LstnText from './LstnText'

import { PlayerActions } from '../stores/player-store'
import { TrackListStore, TrackListActions } from '../stores/track-list-store';


export default class TrackListView extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = TrackListStore;
    }

    componentDidMount() {
        const playlistTracksHref = this.props.navigation.getParam('playlistTracksHref');
        TrackListActions.getInitialTracks(playlistTracksHref || `https://api.spotify.com/v1/me/tracks?limit=50`);
    }

    _lstnToTrack(index){
        PlayerActions.updateCurrentTrackIds(this.state.currentTrackIds);
        NangController.playTracksById(this.state.currentTrackIds, index.toString(), 0);
        this.props.navigation.navigate('player');
    }

    render() {
        return (
            <View style={styles.view}>
                <BurgerButton openDrawer={()=>this.props.navigation.openDrawer()}/>
                <ListView
                    style={styles.listView}
                    dataSource={this.state.trackList}
                    enableEmptySections={true}
                    onEndReached={TrackListActions.getMoreTracks}
                    renderRow={(item, sectionId, index) => {
                        return (
                            <TouchableOpacity  onPress={()=>this._lstnToTrack(index)}>
                                <View style={styles.listItem}>
                                    <LstnText text={item.track.name} style={{fontSize: 15, textAlign: 'center'}}/>
                                </View>
                            </TouchableOpacity>
                        )}
                    }
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    listView: {
        marginTop: 50,
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'purple',
        borderBottomWidth: 1,
        borderColor: 'yellow'
    }
});