import Reflux from 'reflux'
import { ListView } from 'react-native'
import firebase from 'firebase'
import _ from 'lodash'

export const HomieListActions = Reflux.createActions([
    "getHomies"
]);

export class HomieListStore extends Reflux.Store {
    constructor(props) {
      super(props);

      this.state = {
        homieList: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      }
      this.listenables = HomieListActions;
    }

    async onGetHomies(){
        try {
            let snapshot = await firebase.database().ref("users").once("value");
            let activeHomies = _.filter(snapshot.val(), homie => homie.isPlaying);
            this.setState({
                homieList: this.state.homieList.cloneWithRows(activeHomies)
            });
        } catch (err) {
            console.log(err);
        }
    }
}