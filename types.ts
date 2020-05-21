export enum KeyToPress {
  AltLeft = 'AltLeft',
  ControlLeft = 'ControlLeft',
  ShiftLeft = 'ShiftLeft',
}

export interface Settings {
  keyToPress: KeyToPress;
  scrollFactor: number; // replaced by `scrollSpeedMultiplier`
  scrollSpeedMultiplier: number;
}
