declare module '@react-native-community/slider' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    export interface SliderProps {
      value?: number;
      disabled?: boolean;
      minimumValue?: number;
      maximumValue?: number;
      step?: number;
      minimumTrackTintColor?: string;
      maximumTrackTintColor?: string;
      thumbTintColor?: string;
      onValueChange?: (value: number) => void;
      onSlidingStart?: (value: number) => void;
      onSlidingComplete?: (value: number) => void;
      style?: StyleProp<ViewStyle>;
      thumbStyle?: StyleProp<ViewStyle>;
      trackStyle?: StyleProp<ViewStyle>;
    }
  
    export default class Slider extends Component<SliderProps> {}
  }
  