/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// global.baseurl = "http://172.20.5.175:86/prefaenamims"
global.baseurl = "http://200.35.115.156:8087/prefaenamims"

AppRegistry.registerComponent(appName, () => App);
