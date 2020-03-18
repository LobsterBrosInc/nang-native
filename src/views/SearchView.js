import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';

import {
  Dimensions,
  View,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import { BurgerButton, LstnText } from '@components'

import { SearchStore, SearchActions } from '@stores/search.store';

export default class SearchView extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = SearchStore;
    }

    _lstnToTrack(index){
        // add to front of current cue?
        this.props.navigation.navigate('player', {
            trackIndex: index,
            trackIds: this.state.currentTrackIds
        });
    }

    render() {
        return (
            <View style={styles.view}>
                <BurgerButton openDrawer={() => this.props.navigation.openDrawer()}/>
                <TextInput
                    style={styles.textInput}
                    defaultValue="search, yo!"
                    clearTextOnFocus={true}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={ query => SearchActions.getSearchResults(query) }
                ></TextInput>
                <FlatList
                    style={styles.listView}
                    data={this.state.trackList}
                    enableEmptySections={true}
                    onEndReached={SearchActions.getMoreTracks}
                    renderItem={(item, sectionId, index) => {
                        return (
                            <View style={styles.listItem}>
                                <TouchableOpacity  onPress={()=>this._lstnToTrack(index)}>
                                    <View style={styles.view}>
                                        <Image
                                            style={styles.albumArt}
                                            source={{uri: _.get(item.album, 'images[1].url')}}
                                            resizeMode="cover"
                                        ></Image>
                                        <LstnText text={`${item.name} λ ${_.get(item, 'artists[0].name')}`} style={{fontSize: 15, textAlign: 'center', color: '#F95300', backgroundColor: 'transparent'}}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=> SearchActions.saveTrack(item.id) }>
                                    <View>
                                        <LstnText text={'+'} style={{fontSize: 30, textAlign: 'center', width: 30, color: '#F95300', backgroundColor: 'transparent'}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    }
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    view: {
        flex: 1
    },
    textInput: {
        marginTop: 50,
        height: 50,
        color: '#F95300',
        backgroundColor: 'black',
        fontFamily: 'PressStart2P-Regular',
        textAlign: 'center',
        fontSize: 13,
    },
    albumArt: {
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    listItem: {
        height: 150,
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});