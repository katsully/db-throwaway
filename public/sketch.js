var myP;
var inp;

// NEW
var buttonPolictics;
var buttonSports;
var myCanvas;
var img;

function setup() {
  myCanvas = createCanvas(400, 400);
  inp = createInput('');
  inp.position(0, 0);
  inp.size(100);
  var button = createButton("Enter");
  button.mousePressed(guessCategory);
  myP = createP();

  socket = io.connect('http://localhost:3000');
  socket.on('guess', newGuess);
  // NEW
  socket.on('getData', printData);

  // NEW
  buttonPolictics = createButton('Polictics');
  buttonSports = createButton('Sports');

  buttonPolictics.mousePressed(getPolictics);
  buttonSports.mousePressed(getSports);

  background(255,0,0,100);
}

// NEW
function getPolictics(){
  socket.emit('getData', 'politics');
}

function getSports(){
  socket.emit('getData', 'sports');
}

function printData(docs){
  for(var i=0; i<docs.length; i++){
    createP(docs[i].human);
    var raw = new Image();
    raw.src=docs[i].img64; // base64 data here
    raw.onload = function() {
      img = createImage(raw.width/2, raw.height/2);
      img.drawingContext.drawImage(raw, 0, 0);
      image(img, width/2, height/2); // draw the image, etc here
      tint(0, 153, 204, 126); // Tint blue and set 
    }
  }
}

function newGuess(data){
  myP.html(data);
}

function guessCategory(){
  // data = inp.value();

  // for images
  data = {
    human: inp.value(),
    // elt - underlining HTML element
    img64: myCanvas.elt.toDataURL()
  }

  socket.emit('guess', data);
}

function draw() {
  // background(255,0,0,100);

}
