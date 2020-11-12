import { message } from "antd";
import {Rtc,Stream,Settings} from '../types'
export const handleEvents = (client: any,remoteStreams:{value:Stream[],set:Function},rtcInfo:{value:Rtc}) => {
  console.log(client)
  client.on("error", (err: unknown) => {
    console.log(err);
  });
  client.on("peer-leave", function (evt: any) {
    const id = evt.uid;
    let streams = remoteStreams.value.filter((e: Stream) => id !== e.getId());
    let peerStream = remoteStreams.value.find((e: Stream) => id === e.getId());
    if (peerStream && peerStream.isPlaying()) {
      peerStream.stop();
    }

    remoteStreams.set(streams);
    message.warning("peer leave");
  });
  client.on("stream-published", function () {
    message.warning("stream published success");
  });
  client.on("stream-added", function (evt: any) {
    const remoteStream = evt.stream;
    const id = remoteStream.getId();
    message.success("stream-added uid: " + id);
    if (id !== rtcInfo.value.params.uid) {
      client.subscribe(remoteStream, function (err: any) {
        console.log("stream subscribe failed", err);
      });
    }
  });
  client.on("stream-subscribed", function (evt: any) {
    const remoteStream = evt.stream;
    const id = remoteStream.getId();
    remoteStreams.set([...remoteStreams.value, remoteStream]);
    remoteStream.play("remote_video_" + id);
  });
  client.on("stream-removed", function (evt: any) {
    const remoteStream = evt.stream;
    const id = remoteStream.getId();
    message.success("stream-removed uid: " + id);
    if (remoteStream.isPlaying()) {
      remoteStream.stop();
    }
    const filteredRemoteStreams = remoteStreams.value.filter(function (
      stream: Stream
    ) {
      return stream.getId() !== id;
    });
    remoteStreams.set(filteredRemoteStreams);
  });

  client.on("onTokenPrivilegeWillExpire", function () {
    message.success("onTokenPrivilegeWillExpire");
  });

  client.on("onTokenPrivilegeDidExpire", function () {
    message.success("onTokenPrivilegeDidExpire");
  });
};

const needValidatedItem = ["appID", "channel"];
export const join = (settings:{value:Settings},rtcInfo:{value:Rtc,set:Function},remoteStreams:{value:any,set:Function},agoraRtc:any,isPublished:{value:Boolean,set:Function}) => {
  const isNotValidate = needValidatedItem.some((item: string) => {
    const isEmpty = settings.value[item] === "";
    if (isEmpty) message.error(`Please Enter ${item}`);
    return isEmpty;
  });
  if(isNotValidate)return;
  if (rtcInfo.value.joined) {
    message.error("Your already joined");
    return;
  }
  const client = agoraRtc.createClient({
    mode: settings.value.mode,
    codec: settings.value.codec,
  });
  const {
    token,
    channel,
    appID,
    streamID,
    microphoneId,
    cameraId,
  } = settings.value;
  client.init(
    appID,
    async () => {
      client.join(
        token ? token : null,
        channel,
        streamID ? +streamID : null,
        function (uid:number) {
          message.warning(
            "join channel: " + channel + " success, uid: " + uid
          );

          const localStream = agoraRtc.createStream({
            streamID: uid,
            audio: true,
            video: true,
            screen: false,
            microphoneId: microphoneId,
            cameraId: cameraId,
          });

          rtcInfo.set({
            ...rtcInfo.value,
            joined: true,
            params: { ...settings.value, uid },
            client,
            localStream,
          });

          localStream.init(
            function () {
              console.log("init local stream success");
              localStream.play("local_stream");
              handleEvents(client,remoteStreams,rtcInfo);
              publish(isPublished,{ client, localStream });
            },
            function () {
              message.error(
                "stream init failed, please open console see more detail"
              );
            }
          );
        },
        function () {
          message.error(
            "client join failed, please open console see more detail"
          );
        }
      );
    },
    () => {
      message.error(
        "client init failed, please open console see more detail"
      );
    }
  );
};
export const publish = (isPublished:{value:Boolean,set:Function},rtc:{client:any,localStream:Stream}) => {
  const { client, localStream } = rtc;
  if (!client) {
    message.error("Please Join Room First");
    return;
  }
  if (isPublished.value) {
    message.error("Your already published");
    return;
  }
  const oldState = isPublished;

  client.publish(localStream, function (err: any) {
    isPublished.set(oldState);
    message.error("publish failed");
  });
  message.success("publish");
  isPublished.set(true);
};
export const unpublish = (isPublished:{value:Boolean,set:Function},rtcInfo:{value:Rtc}) => {
  const { client, localStream } = rtcInfo.value;
  if (!client) {
    message.error("Please Join Room First");
    return;
  }
  if (!isPublished.value) {
    message.error("Your didn't publish");
    return;
  }
  const oldState = isPublished.value;
  client.unpublish(localStream, function () {
    isPublished.set(oldState);
    message.error("unpublish failed");
  });
  message.success("unpublish");
  isPublished.set(false);
};
export const leave = (rtcInfo:{value:Rtc,set:Function},remoteStreams:{value:Stream[],set:Function},isPublished:{value:Boolean,set:Function}) => {
  const { client, joined, localStream } = rtcInfo.value;
  if (!client) {
    message.error("Please Join First!");
    return;
  }
  if (!joined) {
    message.error("You are not in channel");
    return;
  }

  client.leave(
    function () {
      if (localStream.isPlaying()) {
        localStream.stop();
      }
      localStream.close();
      for (let i = 0; i < remoteStreams.value.length; i++) {
        const stream = remoteStreams.value.shift();
        if (stream?.isPlaying()) {
          stream.stop();
        }
      }

      isPublished.set(false);
      rtcInfo.set({
        ...rtcInfo,
        localStream: null,
        client: null,
        joined: false,
      });
      message.warning("leave success");
    },
    function () {
      message.error("leave fail");
    }
  );
};