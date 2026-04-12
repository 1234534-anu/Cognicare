class HandTrackingMP {
  constructor(onMove) {
    this.onMove = onMove;
    this.prev = null;

    this.video = document.createElement("video");
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.style.display = "none";
    document.body.appendChild(this.video);

    this.hands = new Hands({
      locateFile: f =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    this.hands.onResults(this.onResults.bind(this));

    this.camera = new Camera(this.video, {
      onFrame: async () => {
        await this.hands.send({ image: this.video });
      },
      width: 640,
      height: 480
    });

    this.camera.start();
  }

  onResults(results) {
    if (!results.multiHandLandmarks) return;

    const lm = results.multiHandLandmarks[0][8]; // index fingertip

    const x = lm.x * 750; // canvas width
    const y = lm.y * 500; // canvas height

    this.onMove(x, y);
  }
}
