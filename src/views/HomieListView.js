import React from 'react';
import Reflux from 'reflux';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { BurgerButton, HomieListItem } from '@components';

import { HomieListStore, HomieListActions } from '@stores/homieList.store';

export default class HomieListView extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = HomieListStore;
    }

    componentDidMount() {
        HomieListActions.getHomies();
    }

    _lstnToHomie(homie){
        this.props.navigation.navigate('homie', {
            lstnToHomie: homie
        });
    }

    render() {
        return (
            <View>
                <BurgerButton openDrawer={ ()=>this.props.navigation.openDrawer() }/>
                <FlatList
                    style={styles.listView}
                    data={this.state.homieList}
                    enableEmptySections={true}
                    renderItem={(homie) => {
                        return (
                            <TouchableOpacity onPress={()=>this._lstnToHomie(homie)}>
                                <HomieListItem homie={homie} />
                            </TouchableOpacity>)
                        }
                    }
                />
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