import { Settings } from './types';

const defaultSettings: Settings = {
  mode: Settings.Mode.OnTriggerKeyPressed,
  scrollSpeedMultiplier: 3,
  triggerKey: Settings.TriggerKey.AltLeft,
  ignoredUrls: [],
};

export default defaultSettings;
