/**
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import Lstn from './src/components/Lstn';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Lstn);
