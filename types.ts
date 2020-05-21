export enum KeyToPress {
  AltLeft = 'AltLeft',
  ControlLeft = 'ControlLeft',
}

export interface Settings {
  keyToPress: KeyToPress;
  scrollSpeedMultiplier: number;
}
