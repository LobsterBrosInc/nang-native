import React from 'react';
import Reflux from 'reflux';
import AsyncStorage from '@react-native-community/async-storage'
import {
    View,
    Image,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    NativeModules,
    NativeEventEmitter
} from 'react-native';

const { NangController } = NativeModules;
const LstnEventEmitter = new NativeEventEmitter(NangController);

import { UserStore, UserActions } from '@stores/user.store'
import { NangText } from '@components'
import _ from 'lodash'

const buttonText = ["THEY AINT READY", "GET YO SHIT", "MTHRFCKRS NEED TO KNOW"][_.random(2)];

export default class LoginView extends Reflux.Component {
    constructor(props) {
      super(props);

      this.store = UserStore;
    }

    async componentDidMount() {
        this.eventListeners = {
            // spotifySessionVerifiedListener: LstnEventEmitter.addListener('spotifyLoginSuccess', accessToken => this._onSpotifySessionVerified(accessToken))
        };

        // If user credentials are stored, login
        const credentials = await Promise.all([AsyncStorage.getItem('LstnUserEmail'), AsyncStorage.getItem('LstnUserPassword')])
        if (credentials[0] && credentials[1]) {
            UserActions.changeText('email', credentials[0]);
            UserActions.changeText('password', credentials[1]);
            UserActions.logUserIn();
        } else {
            // TODO: do this in user-store?
            this.setState({loading: false});
        }
    }

    componentWillUnmount(){
        _.each(this.eventListeners, eventListener => eventListener.remove());
        super.componentWillUnmount();
    }

    async _onSpotifySessionVerified(accessToken){
        await AsyncStorage.setItem('LstnSpotifyAccessToken', accessToken);
        this.props.navigation.navigate('mainMenu');
    }

    render() {
        return (
            <View style={styles.loginView}>
                <Image
                    source={require('@assets/pics/nang-word-orange.png')}
                    style={styles.lstnLogo}
                    resizeMode="contain"
                />
                {!this.state.loading ? (
                    <View style={styles.loginInputs}>
                        <TextInput
                            style={styles.textInput}
                            defaultValue="FUCKINGUSERNAME"
                            clearTextOnFocus={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={ username => UserActions.changeText('username', username) }
                        ></TextInput>
                        <TextInput
                            style={styles.textInput}
                            defaultValue="FUCKING@EMAIL.COM"
                            clearTextOnFocus={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={ email => UserActions.changeText('email', email) }
                        ></TextInput>
                        <TextInput
                            style={styles.textInput}
                            defaultValue="PASSWORD"
                            secureTextEntry={true}
                            clearTextOnFocus={true}
                            autoCorrect={false}
                            onChangeText={ password => UserActions.changeText('password', password) }
                        ></TextInput>
                        <TouchableOpacity onPress={UserActions.logUserIn}>
                            <View style={styles.loginButton}>
                                <NangText
                                    text={buttonText}
                                    style={{fontSize: 15, textAlign: 'center', lineHeight: 35, color: '#F95300'}}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (<ActivityIndicator color="#F95300" size="large"/>)}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    loginView: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginInputs: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    lstnLogo: {
        width: '80%',
        height: 80,
        marginTop: 50,
        marginBottom: 50,
    },
    textInput: {
        height: 50,
        width: '100%',
        color: '#F95300',
        backgroundColor: 'black',
        fontFamily: 'PressStart2P-Regular',
        textAlign: 'center',
        fontSize: 13,
    },
    loginButton: {
        height: 50,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: '#5EDFA7',
        justifyContent: 'center',
        alignItems: 'center'
    }
});