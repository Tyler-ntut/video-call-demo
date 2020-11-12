export interface Settings {
  appID: string;
  channel: string;
  token: string;
  streamID?: number;
  audio?: boolean;
  video?: boolean;
  screen?: boolean;
  microphoneId: string;
  cameraId: string;
  mode: "live" | "rtc";
  codec: "h264" | "vp8";
  [key:string]:unknown
}

export interface Device {
  kind: string;
  label?: string;
  deviceId?: string;
  name: string;
  value: any;
};
export type StateToolKit = {
  audio :{
    value:Device[],
    set:Function,
  },
  rtcInfo:{
    value:Rtc,
    set:Function
  },
  settings:{
    value:Settings,
    set:Function,
  }
  isPublished:{
    value:Boolean,
    set:Function,
  }
  remoteStreams:{
    value:Stream[],
    set:Function
  },
  agoraRtc:any

}
export interface Stream {
  getId(): number | string;
  unmuteAudio(): void;
  muteAudio(): void;
  unmuteVideo(): void;
  muteVideo(): void;
  isPlaying(): boolean;
  stop(): void;
  close(): void;
}
 
export interface Rtc{
  client: any | null;
  joined: boolean;
  localStream: Stream | any;
  params: any;
};