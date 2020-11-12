/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from "react";
// import {useStateWithPromise} from '../hooks'
import { getDevices } from "../utils";
import {
  renderRemoteStreams,
  renderLocalStream,
  renderAdvancedSettings,
  renderSettings
} from "./VideoCallElement";
import AgoraRTC from "agora-rtc-sdk";
import { Settings, Device, Rtc} from "../types";
import "./videoCall.scss";
const VideoCall: FC = () => {
  const initSettings: Settings = {
    appID: "959892219ce842eb837e529ea316e6ce",
    channel: "666",
    token:
      "006959892219ce842eb837e529ea316e6ceIAC/RhfoMPcG0LRNgiuSIaE6HltK1MDod8HaKcpb9kdR7dxEAZkAAAAAEABID2UqKUyuXwEAAQApTK5f",
    streamID: 0,
    audio: true,
    video: true,
    screen: false,
    microphoneId: "",
    cameraId: "",
    mode: "live",
    codec: "h264",
  };
  const initRtc: Rtc = {
    client: null,
    joined: false,
    localStream: null,
    params: {},
  };

  const [videoList, setVideoList] = useState<Device[]>([]);
  const [audioList, setAudioList] = useState<Device[]>([]);
  const [settings, setSettings] = useState<Settings>(initSettings);
  const [rtcInfo, setRtcInfo] = useState(initRtc);
  const [isPublished, setIsPublished] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const setMediaList = (media: { videos: Device[]; audios: Device[] }) => {
    const { videos, audios } = media;
    setVideoList(videos);
    setAudioList(audios);
  };

  const stateToolKits ={
    video :{
      value:videoList,
      set:setVideoList
    },
    audio:{
      value:audioList,
      set:setAudioList
    },
    rtcInfo:{
      value:rtcInfo,
      set:setRtcInfo
    },
    settings:{
      value:settings,
      set:setSettings
    },
    isPublished:{
      value:isPublished,
      set:setIsPublished
    },
    remoteStreams:{
      value:remoteStreams,
      set:setRemoteStreams
    },
    agoraRtc:AgoraRTC
  }

  useEffect(() => {
    getDevices(AgoraRTC, setMediaList);
  }, []);
 
  const { localStream } = rtcInfo;
  return (
    <div className="container">
      <div>
        {renderSettings(stateToolKits)}
        {renderAdvancedSettings(settings, setSettings, videoList, audioList)}
      </div>
      {renderLocalStream(localStream)}
      {renderRemoteStreams(remoteStreams)}
      <div />
    </div>
  );
};
export default VideoCall;
