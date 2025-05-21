import * as fp from 'fingerpose';

// ✌️ Gesture Peace
const VictoryGesture = new fp.GestureDescription('victory');
VictoryGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl);
VictoryGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl);
VictoryGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl);
VictoryGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl);

// 👍 Gesture Jempol
const ThumbsUpGesture = new fp.GestureDescription('thumbs_up');
ThumbsUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
ThumbsUpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl);
ThumbsUpGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl);
ThumbsUpGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl);
ThumbsUpGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl);

export { VictoryGesture, ThumbsUpGesture };
