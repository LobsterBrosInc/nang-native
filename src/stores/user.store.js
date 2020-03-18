import Reflux from 'reflux'
import firebase from 'firebase'

import AsyncStorage from '@react-native-community/async-storage'

import { NativeModules } from 'react-native';


const NangController = NativeModules.NangController;

export const UserActions = Reflux.createActions([
    "changeText", //TODO this doesn't belong here
    "logUserIn",
    "createUser",
    "updateUser"
]);

export class UserStore extends Reflux.Store {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loading: true
        };
        this.listenables = UserActions;
    }

    onChangeText(textType, value){
        let user = {};
        user[textType] = value;
        this.setState(user);
    }

    async onLogUserIn(){
        this.setState({loading: true});
        try {
            let userData = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.userRef = firebase.database().ref(`users/${userData.user.uid}`);
            await this._storeAttributesLocally(userData.user.uid);
            NangController.startSession();
        } catch (err) {
            // TODO: error handling
            // if no user, create one
            console.log('create user')
            this.onCreateUser();
            // console.log(err);
        }
    }

    async onCreateUser(email, password){
        try {
            let userData = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            this.userRef = firebase.database().ref(`users/${userData.user.uid}`);
            console.log('created')
            this._setUserDefaults(userData.user.uid);
        } catch (err) {
            this.setState({loading: false});
            console.log(err)
        }
    }

    onUpdateUser(attributes = {}){
        this.userRef.update(attributes);
    }

    async _storeAttributesLocally(uid) {
       await Promise.all([
           AsyncStorage.setItem('LstnUserId', uid),
           AsyncStorage.setItem('LstnUserEmail', this.state.email),
           AsyncStorage.setItem('LstnUserPassword', this.state.password)
       ]);
    }

    async _setUserDefaults(uid){
        try{
            await this.userRef.update({
                id: uid,
                email: this.state.email,
                username: this.state.username,
                currentTrackIds: [],
                currentTrackIndex: 0,
                currentTrackProgress: 0.0
            });

            await this._storeAttributesLocally(uid);
            NangController.startSession();
        } catch (err) {
            this.setState({loading: false});
            console.log(err);
        }
    }
}