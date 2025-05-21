import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

// 👉 GESTUR "THUMBS UP"
export const ThumbsUpGesture = new GestureDescription("thumbs_up");
ThumbsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
ThumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);

// 👉 GESTUR "VICTORY" (Peace Sign)
export const VictoryGesture = new GestureDescription("victory");
VictoryGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
VictoryGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
VictoryGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
VictoryGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// 👉 GESTUR "OK"
export const OkGesture = new GestureDescription("ok");
OkGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
OkGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
OkGesture.addDirection(Finger.Thumb, FingerDirection.HorizontalRight, 0.5);