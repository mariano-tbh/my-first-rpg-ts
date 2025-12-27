import { FrameIndexPattern } from "../../lib/classes/frame-index-pattern";

function makeWalkingFrames(rootFrame: number): FrameIndexPattern {
  return new FrameIndexPattern({
    duration: 400,
    frames: [
      {
        startAt: 0,
        frame: rootFrame + 1,
      },
      {
        startAt: 100,
        frame: rootFrame + 0,
      },
      {
        startAt: 200,
        frame: rootFrame + 1,
      },
      {
        startAt: 300,
        frame: rootFrame + 2,
      }
    ]
  })
}

function makeStandingFrames(rootFrame: number): FrameIndexPattern {
  return new FrameIndexPattern({
    duration: 400,
    frames: [
      {
        startAt: 0,
        frame: rootFrame + 0,
      }
    ]
  })
}

export const stand_down = makeStandingFrames(1);
export const stand_right = makeStandingFrames(4);
export const stand_up = makeStandingFrames(7);
export const stand_left = makeStandingFrames(10);

export const walk_down = makeWalkingFrames(0);
export const walk_right = makeWalkingFrames(3);
export const walk_up = makeWalkingFrames(6);
export const walk_left = makeWalkingFrames(9);

export const pick_up = new FrameIndexPattern({
  duration: 400,
  frames: [{ startAt: 0, frame: 12 }]
})