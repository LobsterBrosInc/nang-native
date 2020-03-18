import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class DrawerContent extends React.Component {
    constructor(props) {
      super(props);
    }
    _navigate (name){
        this.props.navigation.navigate(name);
    }
    render () {
        return (
            <View style={styles.drawer}>
                <TouchableOpacity onPress={()=>this._navigate('homieList')}>
                    <Text style={styles.listItem}>HOMIES</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._navigate('trackList')}>
                    <Text style={styles.listItem}>MY SHIT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._navigate('playlistList')}>
                    <Text style={styles.listItem}>PLAYLISTS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this._navigate('searchView')}>
                    <Text style={styles.listItem}>SEARCH</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    drawer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
    listItem: {
        lineHeight: 30,
        height: 75,
        fontSize: 30,
        fontFamily: 'PressStart2P-Regular',
        textAlign: 'center'
    }
});