import Reflux from 'reflux'
import firebase from 'firebase'
import _ from 'lodash'

export const HomieListActions = Reflux.createActions([
    "getHomies"
]);

export class HomieListStore extends Reflux.Store {
    constructor(props) {
      super(props);

      this.state = {
        homieList: []
      }
      this.listenables = HomieListActions;
    }

    async onGetHomies(){
        try {
            let snapshot = await firebase.database().ref("users").once("value");
            let activeHomies = _.filter(snapshot.val(), homie => homie.isPlaying);
            this.setState({
                homieList: activeHomies
            });
        } catch (err) {
            console.log(err);
        }
    }
}