export enum Settings_Mode {
  /* set these enum values to string values to be able to use them as strings too */
  Always = 'Always',
  OnTriggerKeyPressed = 'OnTriggerKeyPressed',
}

export enum Settings_TriggerKey {
  /* set these enum values to string values to be able to use them as strings too */
  AltLeft = 'AltLeft',
  ControlLeft = 'ControlLeft',
}

export class Settings {
  static Mode = Settings_Mode; // allows client files to write `Settings.Mode`
  static TriggerKey = Settings_TriggerKey; // allows client files to write `Settings.TriggerKey`

  ignoredUrls: Array<String>;
  mode: Settings_Mode;
  scrollSpeedMultiplier: number;
  triggerKey: Settings_TriggerKey;
}

export type ScrollAxis = 'horizontal' | 'vertical';
