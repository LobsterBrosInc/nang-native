import _ from 'lodash';
import MusicControl from 'react-native-music-control';
import { AsyncStorage, NativeModules } from 'react-native';
const { NangController } = NativeModules;

export default class MusicControlService {
  constructor() {
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)
    // MusicControl.enableControl('seekForward', true) // iOS only
    // MusicControl.enableControl('seekBackward', true) // iOS only

    MusicControl.on('play', () => NangController.playPauseTrack())
    MusicControl.on('pause', () => NangController.playPauseTrack())
    MusicControl.on('stop', () => NangController.playPauseTrack())
    MusicControl.on('nextTrack', () => NangController.playNextTrack())
    MusicControl.on('previousTrack',() => NangController.playPreviousTrack())
    // MusicControl.on('seekForward', ()=> {});
    // MusicControl.on('seekBackward', ()=> {});
  }

  setDrawerContent(trackData){
      MusicControl.setNowPlaying({
        title: trackData.name,
        artwork: _.get(trackData, 'album.images[1].url'), // URL or RN's image require()
        artist: _.get(trackData, 'artists[0].name'),
        album: _.get(trackData, 'album.name'),
        duration: trackData.duration_ms / 1000 // (Seconds)
      })
  }
}