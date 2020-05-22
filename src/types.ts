enum Settings_Mode {
  Always,
  OnTriggerKeyPressed,
}

enum Settings_TriggerKey {
  AltLeft,
  CtrlLeft,
}

export class Settings {
  static Mode = Settings_Mode; // allows client files to write `Settings.Mode`
  static TriggerKey = Settings_TriggerKey; // allows client files to write `Settings.TriggerKey`

  mode: Settings_Mode;
  scrollSpeedMultiplier: number;
  triggerKey: Settings_TriggerKey;
}
