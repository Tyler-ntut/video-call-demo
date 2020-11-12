import { message } from "antd";
import { Device } from "../types";
const getDevices = (rtc: any, next: Function) => {
  const videos: Device[] = [];
  const audios: Device[] = [];
  rtc.getDevices(
    async function (items: Device[]) {
      items
        .filter(function (item) {
          return ["audioinput", "videoinput"].indexOf(item.kind) !== -1;
        })
        .map(function (item) {
          return {
            name: item.label,
            value: item.deviceId,
            kind: item.kind,
          };
        });
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let name, value;
        if ("videoinput" === item.kind) {
          name = item.label || "camera-" + videos.length;
          value = item.deviceId;
          videos.push({
            name,
            value,
            kind: item.kind,
          });
        }
        if ("audioinput" === item.kind) {
          name = item.label || "microphone-" + audios.length;
          value = item.deviceId;
          audios.push({
            name,
            value,
            kind: item.kind,
          });
        }
      }
      next({ videos, audios });
    },
    () => message.error("Failed to getDevice")
  );
};

export { getDevices };
