var myP;
var inp;

function setup() {
  createCanvas(400, 400);
  inp = createInput('');
  inp.position(0, 0);
  inp.size(100);
  var button = createButton("Enter");
  button.mousePressed(guessCategory);
  myP = createP();

  socket = io.connect('http://localhost:3000');
  socket.on('guess', newGuess);
}

function newGuess(data){
  myP.html(data);
}

function guessCategory(){
  data = inp.value();
  socket.emit('guess', data);
}

function draw() {
  background(220);
}
