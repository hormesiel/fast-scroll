export enum KeyToPress {
  AltLeft = 'AltLeft',
  ControlLeft = 'ControlLeft',
}

export interface Settings {
  invertBehavior: boolean;
  keyToPress: KeyToPress;
  scrollSpeedMultiplier: number;
}
