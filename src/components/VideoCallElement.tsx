import React from "react";
import { Button, Input, Card, Collapse, Select, Radio } from "antd";
import { Settings, Device, Stream, StateToolKit } from "../types";
import {join,leave,publish,unpublish} from './VideoCallEventHandler'
const { Panel } = Collapse;
const { Option } = Select;

const resolutions = ["default", "480p", "720p", "1080p"];
export const renderToolbar = (stream: Stream) => (
  <div className="toolbar">
    <Button onClick={() => stream.muteAudio()}>mute</Button>
    <Button onClick={() => stream.unmuteAudio()}>unmute</Button>
    <Button onClick={() => stream.muteVideo()}>clode video</Button>
    <Button onClick={() => stream.unmuteVideo()}>open video</Button>
  </div>
);

export const renderRemoteStreams = (remoteStreams: Stream[]) =>
  remoteStreams.map((stream:Stream) => {
    return (
      <div id={`remote_video_panel_${stream.getId()}`} className="video-view">
        <div
          id={`remote_video_${stream.getId()}`}
          className="video-placeholder"
        ></div>
        <div
          id={`remote_video_info_${stream.getId()}`}
          className="video-profile"
        ></div>
        <div
          id={`video_autoplay_${stream.getId()}`}
          className="autoplay-fallback"
        ></div>
        {renderToolbar(stream)}
      </div>
    );
  });

export const renderLocalStream = (localStream: Stream) => (
  <div className="video-view">
    <div id="local_stream" className="video-placeholder"></div>
    <div id="local_video_info" className="video-profile hide"></div>
    <div id="video_autoplay_local" className="autoplay-fallback hide"></div>
    {localStream && renderToolbar(localStream)}
  </div>
);

export const renderAdvancedSettings = (
  settings: Settings,
  setSettings: Function,
  videoList: Device[],
  audioList: Device[]
) => (
  <Collapse className="advanced-settings-container">
    <Panel header="ADVANCED SETTINGS" key="1">
      <Input
        placeholder="UID"
        type="number"
        onChange={(e) =>
          setSettings({
            ...settings,
            streamID: Number(e.target.value),
          })
        }
      />
      <Select
        placeholder="CAMERA"
        onChange={(val) =>
          setSettings({
            ...settings,
            cameraId: String(val),
          })
        }
      >
        {videoList.map((item: Device) => (
          <Option value={item.value} key={item.value}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="MICROPHONE"
        onChange={(val) =>
          setSettings({
            ...settings,
            microphoneId: String(val),
          })
        }
      >
        {audioList.map((item: Device) => (
          <Option value={item.value} key={item.value}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select placeholder="CAMERA RESOLUTION">
        {resolutions.map((item: string) => (
          <Option value={item}>{item}</Option>
        ))}
      </Select>
      <div className="radio-section">MODE</div>
      <Radio.Group
        onChange={(e) =>
          setSettings({
            ...settings,
            mode: e.target.value,
          })
        }
        value={settings.mode}
      >
        <Radio value="live">live</Radio>
        <Radio value="rtc">rtc</Radio>
      </Radio.Group>
      <div className="radio-section">CODEC</div>
      <Radio.Group
        onChange={(e) =>
          setSettings({
            ...settings,
            codec: e.target.value,
          })
        }
        value={settings.codec}
      >
        <Radio value="h264">h264</Radio>
        <Radio value="vp8">vp8</Radio>
      </Radio.Group>
    </Panel>
  </Collapse>
);
export const renderSettings = ({settings,rtcInfo,isPublished,remoteStreams,agoraRtc}:StateToolKit) =>{
  const {client,localStream} = rtcInfo.value
  return (
  <Card className="video-call-container">
    <Input
      placeholder="App ID"
      value={settings.value.appID}
      onChange={(e) =>
        settings.set({
          ...settings.value,
          appID: e.target.value,
        })
      }
    />
    <Input
      placeholder="Channel"
      value={settings.value.channel}
      onChange={(e) =>
        settings.set({
          ...settings.value,
          channel: e.target.value,
        })
      }
    />
    <Input
      placeholder="Token"
      value={settings.value.token}
      onChange={(e) =>
        settings.set({
          ...settings.value,
          token: e.target.value,
        })
      }
    />
    <Button type="primary" onClick={() => join(settings,rtcInfo,remoteStreams,agoraRtc,isPublished)}>
      JOIN
    </Button>
    <Button type="primary" onClick={() => leave(rtcInfo,remoteStreams,isPublished)}>
      LEAVE
    </Button>
    <Button type="primary" onClick={() => publish(isPublished,{client,localStream})}>
      PUBLISH
    </Button>
    <Button type="primary" onClick={() => unpublish(isPublished,rtcInfo)}>
      UNPUBLISH
    </Button>
  </Card>
)};
