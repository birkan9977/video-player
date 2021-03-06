class FramePlayer {
  constructor(id) {
    this.id = id;
    this.canvasId = `${this.id}-canvas`;
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.frames = [];
    this.timer = 0;
    this.frameNumber = 1;
    this.playing = false;
    this.downloadTime = 0;
    this.currentMilliSeconds = 0;
    this.fps = 10;
    this.totalNumberFrames = 175;
  }

  resetValues() {
    this.frameNumber = 1;
    this.fps = 10;
  }

  loadFrames() {
    const startTime = Date.now();
    //console.log(startTime);
    console.log("Loading Frames...");
    let images = [];

    //load images
    for (let i = 0; i < 7; i++) {
      images[i] = new Image();
      images[i].src = `images/${i}.jpg`;
    }

    this.ctx = this.canvas.getContext("2d");

    //load first frame size,128x72 on load
    images[0].onload = (e) => {
      this.ctx.drawImage(images[0], 0, 0, 128, 72, 0, 0, 640, 360);
    };
    const endTime = Date.now();
    //console.log(endTime);
    this.downloadTime = endTime - startTime;
    this.frames = images;
  }

  on(eventName, callBack) {
    const event = new Event(eventName);
    switch (eventName) {
      case "downloadcomplete":
        this.canvas.addEventListener(
          "ondownloadcomplete",
          player.loadFrames(),
          false
        );
        callBack(this.downloadTime);
        break;
      case "play":
        this.canvas.addEventListener("onplay", player.play(), false);
        callBack(this.currentMilliSeconds);
        break;
      case "pause":
        this.canvas.addEventListener("onpause", this.pause(), false);
        callBack(this.currentMilliSeconds);
        break;
      case "end":
        this.canvas.addEventListener("onend", this.end(), false);
        break;

      default:
    }

    this.canvas.dispatchEvent(event);
  }

  playerPlaying() {
    return this.playing;
  }

  progressBar() {
    document.getElementById("display-frame-number").value = this.frameNumber;
    document.getElementById(
      "display-milliseconds"
    ).value = this.currentMilliSeconds;
    let progressbarWidth = `${
      (640 / this.totalNumberFrames) * this.frameNumber
    }px`;
    if (this.frameNumber < 176) {
      document.getElementById("progressbar").style.width = progressbarWidth;
    }
  }

  jumpToFrame(x) {
    //interpolate with frame number versus pixel value
    const frameNumber = parseInt((x * this.totalNumberFrames) / 640);
    //console.log(frameNumber)
    this.frameNumber = frameNumber;
    this.currentMilliSeconds = frameNumber * this.fps;
    this.displayFrame(this.frameNumber);
  }

  play() {
    let increment = 1000 / this.fps;
    let totalTime = (this.totalNumberFrames * this.fps) / 60;

    this.playing = true;

    this.timer = setInterval(() => {
      this.displayFrame(this.frameNumber);
      this.frameNumber++;
      this.currentMilliSeconds = this.frameNumber * this.fps;
      //console.log(this.currentMilliSeconds)

      if (this.frameNumber > this.totalNumberFrames) {
        player.on("end", () => {
          console.log("video complete");
        });
        this.frameNumber = 1;
        this.pause();
      }
    }, increment);
  }

  pause() {
    this.playing = false;

    clearInterval(this.timer);
  }

  end() {
    console.log("video is completed");
  }

  displayFrame(frameNumber) {
    let imageId = 0;
    let row,
      col = 0;
    let sourceX,
      sourceY = 0;
    let imageFrameNumber = 1;

    //console.log("frameNumber", frameNumber);

    /*frame number starts from index 1
      each image is a 5x5 table row-col index starting from 1
      formula for finding source image index and
      table index from frame number*/

    if (Number.isInteger(frameNumber / 25)) {
      imageFrameNumber = (frameNumber % 25) + 25;
      imageId = frameNumber / 25 - 1;
    } else {
      imageFrameNumber = frameNumber % 25;
      imageId = parseInt(frameNumber / 25);
    }

    //console.log("imageFrameNumber", imageFrameNumber);
    //console.log("imageId", imageId);

    // formula for finding row and column indexes from imageFrameNumber
    if (Number.isInteger(imageFrameNumber / 5)) {
      row = parseInt(imageFrameNumber / 5);
      col = (imageFrameNumber % 5) + 5;
    } else {
      row = parseInt(imageFrameNumber / 5) + 1;
      col = imageFrameNumber % 5;
    }

    //console.log(row, col);

    //formula for finding x and y positions for each frame from column and row indexes
    sourceX = col * 128 - 128;
    sourceY = row * 72 - 72;
    //console.log("x", sourceX, "y", sourceY);

    //draw on canvas
    this.ctx.drawImage(
      this.frames[imageId],
      sourceX,
      sourceY,
      128,
      72,
      0,
      0,
      640,
      360
    );
    //timerPosition += increment;
    this.progressBar();
  }
}
