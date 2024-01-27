let handpose;
let video;
let predictions = [];
let counting = false;
let fingerCount = 0;

function setup() {
  createCanvas(100, 100);
  video = createCapture(VIDEO);
  video.hide();
  handpose = ml5.handpose(video, modelLoaded);
  handpose.on('predict', gotPoses);
}

function modelLoaded() {
  console.log("Handpose model loaded.");
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    let landmarks = predictions[0].landmarks;
    drawKeypoints(landmarks);

    if (counting) {
      countFingers(landmarks);
    } else {
      textSize(32);
      fill(255);
  simulateKeyPress("Enter");

      //text("Make an open hand gesture to start counting", 10, height - 10);
    }
  }
}

function drawKeypoints(landmarks) {
  for (let i = 0; i < landmarks.length; i++) {
    let x = landmarks[i][0];
    let y = landmarks[i][1];
    fill(255, 0, 0);
    ellipse(x, y, 10, 10);
  }
}

function countFingers(landmarks) {
  const fingertips = [4, 8, 12, 16, 20];
  fingerCount = 0;

  for (let i = 0; i < fingertips.length; i++) {
    let index = fingertips[i];
    let y = landmarks[index][1];

    if (i === 0 && y > landmarks[0][1]) {
      fingerCount++;
    } else if (i !== 0 && y < landmarks[0][1]) {
      fingerCount++;
    }
  }

  textSize(32);
  fill(255);
  //text(`Finger Count: ${fingerCount}`, 10, height - 10);
  simulateArrowUpKeyPress();


 
}

function gotPoses(results) {
  predictions = results;

  if (predictions.length > 0) {
    let hand = predictions[0];
    let openness = hand.annotations.thumb[2][1] - hand.annotations.pinky[0][1];

    if (openness > 50) {
      counting = true;
    } else {
      counting = false;
    }
  }
}
function simulateKeyPress(key) {
  let event = new KeyboardEvent('keydown', { key: key });
  document.dispatchEvent(event);
}
function simulateArrowUpKeyPress() {
  let event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
  document.dispatchEvent(event);
}
