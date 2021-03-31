/*
Creative Programming II

Randiel Zoquier

Mask project "Owl Vision";

*/

let video, visionVid; // video feeds
let vision; // a graphics for the vision field
let loading = true;
let model, face; // our tracking model - face stuff
let logo; // logo for loading loading loading screen

//colors for the triangles of the mask
let colors = ["#d93d8d", "#63b874", "#46d499", "#af398e", "#c066ed", "#ff5985" , "#e04f4f",
"#aaf571", "#732c99", "#c50bde", "#46cfbc", "#21b581", "#e886f7", "#a10852"];

// facts from https://www.mentalfloss.com/article/68473/15-mysterious-facts-about-owls
let owlFacts = ["Owls can turn their necks 135 degrees in either direction, which gives them 270 degrees of total movement",
"Instead of spherical eyeballs, owls have \"eye tubes\" that go far back into their skulls—which means their eyes are fixed in place, so they have to turn their heads to see",
"Owls are capable of hearing prey under leaves, plants, dirt, and snow",
"Some owls have sets of ears at different heights on their heads, which lets them locate prey based on tiny differences in sound waves",
"Owls make virtually no noise when they fly. They have special feathers that break turbulence into smaller currents, which reduces sound",
"Many owls sleep in broad daylight, but the colors and markings on their feathers let them blend in with their surroundings",
"The smallest owl is the elf owl, which lives in the southwestern United States and northern Mexico",
"In ancient Greece, the Little Owl was the companion of Athena, the Greek goddess of wisdom, which is one reason why owls symbolize learning and knowledge"
];

let fact; //for chosen fact

function preload(){
 logo = loadImage("assets/owl.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fact = owlFacts[int(random(0, owlFacts.length))];
  shuffle(colors);
  video = createCapture(VIDEO);
  visionVid = createCapture(VIDEO);
  video.hide();
  visionVid.hide();
  vision = createGraphics(windowWidth, windowHeight);
  loadFaceModel();

}

function draw() {

  imageMode(CORNER);
  vision.clear();

  if (video.loadedmetadata && model !== undefined) {
  getFace();
  }

  push();
    //render video
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    filter(GRAY);

      //"filter"
    rectMode(CORNER);
    fill(0,200);
    noStroke();
    rect(0,0, width, height);

    if(face !== undefined){
      loading = false;
      //noCursor();
      mask(face);
      visionCircles(face);
    }
  pop();

  if(loading){
    loadingScreen();
  }
}

function windowResized(){
  setup();
}

//just to keep things tidy, loading sceren stuff
function loadingScreen(){
 background(0,255,100);
 imageMode(CENTER);
 image(logo, width / 2, height * 0.35, logo.width / 2, logo.height / 2);

 noFill();
 stroke(34);
 strokeCap(ROUND);
 strokeWeight(8);
 arc(width/ 2, height * 0.35, width / 5, width / 5, radians(10 + (millis() / 10)), radians(170 + (millis() / 10)));
 arc(width/ 2, height * 0.35, width / 5, width / 5, radians(190 + (millis() / 10)), radians(350 +(millis() / 10)));

 fill(34);
 noStroke();
 textFont('Georgia');
 textAlign(CENTER, CENTER);
 textSize(height / 32);
 rectMode(CENTER);
 textStyle(BOLD);
 text("Loading...", width/2, height * 0.65);

 textStyle(ITALIC);
 text("Did you know?", width/2, height * 0.8);
 fill(152, 19, 75);
 text(fact, width/2, height * 0.87, width * 0.65, height * 0.25);
}


//mask portion
function mask(face){
  randomSeed(0);
  var faceWidth = face.boundingBox.bottomRight[0] - face.boundingBox.topLeft[0];
  var FaceHeight = face.boundingBox.bottomRight[1] - face.boundingBox.topLeft[1];

  //calculating all the points needed
  var leftEyeCenter = centerPoint(scalePoint(face.scaledMesh[159]), scalePoint(face.scaledMesh[145]));
  var rightEyeCenter = centerPoint(scalePoint(face.scaledMesh[386]), scalePoint(face.scaledMesh[374]));
  var a = extendedPoint(scalePoint(face.scaledMesh[5]), scalePoint(face.scaledMesh[4]), 2);
  var b = scalePoint(face.scaledMesh[168]);
  var c = scalePoint(face.scaledMesh[126]);
  var d = scalePoint(face.scaledMesh[355]);
  var e = midPoint(scalePoint(face.scaledMesh[221]), c, 0.6);
  var f = midPoint(scalePoint(face.scaledMesh[441]), d, 0.6);
  var g = scalePoint(face.scaledMesh[205]);
  var h = scalePoint(face.scaledMesh[425]);
  var i =scalePoint(face.scaledMesh[221]);
  var j = scalePoint(face.scaledMesh[441]);
  var k = extendedPoint(scalePoint(face.scaledMesh[168]), scalePoint(face.scaledMesh[8]), 6.5);
  var l = scalePoint(face.scaledMesh[108]);
  var m = scalePoint(face.scaledMesh[337]);
  var n = extendedPoint(b, i, 3);
  var o = extendedPoint(b, j, 3);
  var p = scalePoint(face.scaledMesh[103]);
  var q = scalePoint(face.scaledMesh[332]);
  var r = extendedPoint(scalePoint(face.scaledMesh[104]), p,  7);
  var s = extendedPoint(scalePoint(face.scaledMesh[333]), q, 7);

  noFill();
  stroke(0,255,100);
  strokeWeight(faceWidth / 40);
  circle(leftEyeCenter.x, leftEyeCenter.y, faceWidth * 0.43);
  circle(rightEyeCenter.x, rightEyeCenter.y, faceWidth * 0.43);
  stroke(26, 190, 136);
  strokeWeight(faceWidth / 42);
  circle(leftEyeCenter.x, leftEyeCenter.y, faceWidth * 0.3);
  circle(rightEyeCenter.x, rightEyeCenter.y, faceWidth * 0.3);

  noStroke();
  fill(colors[0]); //1
  triangle(a.x, a.y, b.x, b.y, c.x, c.y);

  fill(colors[1]); //2
  triangle(a.x, a.y, b.x, b.y, d.x, d.y);

  fill(colors[2]); //3
  triangle(i.x, i.y, b.x, b.y, c.x, c.y);

  fill(colors[3]); //4
  triangle(j.x, j.y, b.x, b.y, d.x, d.y);

  fill(colors[4]); //5
  triangle(e.x, e.y, g.x, g.y, c.x, c.y);

  fill(colors[5]); //6
  triangle(f.x, f.y, d.x, d.y, h.x, h.y);

  fill(colors[6]); //7
  triangle(l.x, l.y, b.x, b.y, n.x, n.y);

  fill(colors[7]); //8
  triangle(m.x, m.y, b.x, b.y, o.x, o.y);

  fill(colors[8]); //9
  triangle(l.x, l.y, b.x, b.y, k.x, k.y);

  fill(colors[9]); //10
  triangle(m.x, m.y, b.x, b.y, k.x, k.y);

  fill(colors[10]); //11
  triangle(n.x, n.y, l.x, l.y, p.x, p.y);

  fill(colors[11]); //12
  triangle(m.x, m.y, q.x, q.y, o.x, o.y);

  fill(colors[12]); //13
  triangle(r.x, r.y, n.x, n.y, p.x, p.y);

  fill(colors[13]); //14
  triangle(s.x, s.y, q.x, q.y, o.x, o.y);


}


function visionCircles(face){

  //figure out propogation of circles

  /* left and right positions are linked (perhaps have a central "position they are based on")
    simple, smooth propigation (left right oscilating, match height with mask?)
    OR
    map position with head position! (inverted axis!)
  */
  //bounding boxes of the cicles based on position of face
  var centerHead = scalePoint(face.scaledMesh[168]);
  var centerCircles = createVector(map(centerHead.x, 0, width, width * 1.2, 0), map(centerHead.y, 0, height, height * 1.35, 0));
  var circleOffset = map(abs(centerHead.y - height/2), 0, height /2, width * 0.27, width * 0.15) - map(abs(centerHead.x - width / 2), 0, width/2, 0, width * 0.15);
  var circleSize = 90000 / ((scalePoint(face.boundingBox.bottomRight).x - scalePoint(face.boundingBox.topLeft).x) * 0.7); ///inverse relationship between size of mask and circles

  var leftEyeCenter = centerPoint(scalePoint(face.scaledMesh[159]), scalePoint(face.scaledMesh[145]));
  var rightEyeCenter = centerPoint(scalePoint(face.scaledMesh[386]), scalePoint(face.scaledMesh[374]));
  var faceWidth = face.boundingBox.bottomRight[0] - face.boundingBox.topLeft[0];
  //interpolated rings


  for(var i = 0; i < 12; i++){
    var newSize = map(i, 0, 12, circleSize, faceWidth * 0.33);
    var leftPosX = map(i, 0, 12, centerCircles.x - circleOffset, leftEyeCenter.x);
    var leftPosY = map(i, 0, 12, centerCircles.y, leftEyeCenter.y);
    var rightPosX = map(i, 0, 12, centerCircles.x + circleOffset, rightEyeCenter.x);
    var rightPosY = map(i, 0, 12, centerCircles.y, rightEyeCenter.y);

    noFill();
    strokeWeight(2);
    stroke(255, map(i, 0, 12, 240, 50));
    circle(leftPosX, leftPosY, newSize);
    circle(rightPosX, rightPosY, newSize);
  }

  //the vision circles themselves
  vision.circle(centerCircles.x - circleOffset, centerCircles.y, circleSize);
  vision.circle(centerCircles.x + circleOffset, centerCircles.y, circleSize);
  visionVid.mask(vision);
  image(visionVid, 0, 0, width, height);

  //rotating things

  noFill();
  stroke(0, 255, 100);
  strokeWeight(6);
  strokeCap(ROUND);
  stroke(255, 71, 114);
  circle(centerCircles.x - circleOffset, centerCircles.y, circleSize);
  strokeWeight(5);
  stroke(0, 255, 100);
  arc(centerCircles.x - circleOffset, centerCircles.y, circleSize - 20, circleSize - 20, radians(0 + (frameCount * 4)), radians(110 + (frameCount * 4)));
  arc(centerCircles.x - circleOffset, centerCircles.y, circleSize + 20, circleSize + 20, radians(180 - (frameCount * 4)), radians(280 - (frameCount * 4)));

  stroke(0, 255, 100);
  strokeWeight(6);
  strokeCap(ROUND);
  stroke(255, 71, 114);
  circle(centerCircles.x + circleOffset, centerCircles.y, circleSize);
  strokeWeight(5);
  stroke(0, 255, 100);
  arc(centerCircles.x + circleOffset, centerCircles.y, circleSize - 20, circleSize - 20, radians(0 + (frameCount * 4)), radians(110 + (frameCount * 4)));
  arc(centerCircles.x + circleOffset, centerCircles.y, circleSize + 20, circleSize + 20, radians(180 - (frameCount * 4)), radians(280 - (frameCount * 4)));


}

//some mathematical things to make my life easier
function scalePoint(pt) {
  let x = map(pt[0], 0, video.width, 0, width);
  let y = map(pt[1], 0,video.height, 0,height);
  return createVector(x, y);
}

//center point between 2 points
function centerPoint(p1, p2){
  let x = p1.x + ((p2.x - p1.x) / 2);
  let y = p1.y + ((p2.y - p1.y) / 2);
  return createVector(x, y);
}

//extended point from 2 points
function extendedPoint(p1, p2, scalar){
  let x = scalar * (p2.x - p1.x) + p1.x;
  let y = scalar * (p2.y - p1.y) + p1.y;
  return createVector(x,y);
}
//a point  somewhere between 2 points
function midPoint(p1, p2, scalar){
  let x = p1.x + ((p2.x - p1.x) * scalar);
  let y = p1.y + ((p2.y - p1.y) * scalar);
  return createVector(x, y);
}

//Async functions for model loading
async function loadFaceModel() {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    { maxFaces: 1 }
  );
}

// gets face points from video input
async function getFace() {
  const predictions = await model.estimateFaces({
    input: document.querySelector('video')
  });
  if (predictions.length === 0) {
    face = undefined;
  }
  else {
    face = predictions[0];
  }
}
