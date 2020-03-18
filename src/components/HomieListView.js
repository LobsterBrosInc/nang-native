import React from 'react';
import Reflux from 'reflux';
import {
  View,
  ListView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import BurgerButton from './BurgerButton';
import HomieListItem from './HomieListItem';
import LstnToHomie from './LstnToHomie';

import { HomieListStore, HomieListActions } from '../stores/homie-list-store';

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
                <ListView
                    style={styles.listView}
                    dataSource={this.state.homieList}
                    enableEmptySections={true}
                    renderRow={(homie) => {
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