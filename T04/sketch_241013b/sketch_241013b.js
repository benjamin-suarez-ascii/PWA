let petImg;  // Variable para la imagen de la mascota
let hunger = 100;
let happiness = 100;
let energy = 100;
let petSize = 400; // Tamaño de la mascota para el juego principal
let petMinigameSize = 50; // Tamaño de la mascota para el minijuego
let inMinigame = false; // Estado del minijuego
let carsLeft = []; // Coches que van de izquierda a derecha
let carsRight = []; // Coches que van de derecha a izquierda
let gridSize = 50; // Tamaño de la cuadrícula
let petX, petY; // Posición de la mascota
let rows = 12; // Cantidad de filas en el minijuego
let level = 1; // Nivel actual del minijuego
let roads = []; // Carreteras y zonas verdes generadas aleatoriamente
let carSpeed = gridSize / 7; // Velocidad de los coches

function preload() {
  petImg = loadImage('pet.png'); // Asegúrate de que pet.png esté en el mismo directorio
}

function setup() {
  createCanvas(600, 600);
  
  // Botones
  let feedButton = createButton('Feed');
  feedButton.position(20, 550);
  feedButton.mousePressed(feed);
  
  let playButton = createButton('Play');
  playButton.position(100, 550);
  playButton.mousePressed(play);
  
  let sleepButton = createButton('Sleep');
  sleepButton.position(180, 550);
  sleepButton.mousePressed(sleep);
  
  let minigameButton = createButton('Start Minigame');
  minigameButton.position(260, 550);
  minigameButton.mousePressed(startMinigame); // Ahora reinicia todo el juego
  
  let backButton = createButton('Back to Game');
  backButton.position(400, 550);
  backButton.mousePressed(backToGame);
  
  petX = floor(width / gridSize / 2) * gridSize; // Posición inicial de la mascota alineada a la cuadrícula
  petY = height - gridSize; // Posición inicial de la mascota
}

function draw() {
  if (inMinigame) {
    playMinigame();
  } else {
    mainGame();
  }
}

function mainGame() {
  background(220);
  
  // Mostrar barras alineadas horizontalmente
  textSize(16);
  fill(0);
  text('Hunger', 20, 20);
  drawBar(20, 30, hunger, 'red');
  
  text('Happiness', 240, 20);
  drawBar(240, 30, happiness, 'yellow');
  
  text('Energy', 460, 20);
  drawBar(460, 30, energy, 'blue');
  
  // Verifica si la mascota muere y muestra mensajes
  if (hunger <= 0) {
    showMessage('Your pet has died of hunger!', 'red');
  } else if (happiness <= 0) {
    showMessage('Your pet has died of sadness!', 'red');
  } else if (energy <= 0) {
    showMessage('Your pet has died of exhaustion!', 'red');
  } else {
    // Mostrar la mascota en el juego principal
    imageMode(CENTER);
    image(petImg, width / 2, height / 2, petSize, petSize);
  }
}

function playMinigame() {
  background(100, 155, 100); // Fondo verde
  
  // Dibujar la zona de inicio
  fill(100, 255, 100);
  rect(0, (rows - 1) * gridSize, width, gridSize); // Zona de pasto (inicio)
  
  // Dibujar las calles y zonas verdes
  for (let i = 1; i < rows - 1; i++) {
    if (roads[i] === 'road') {
      fill(50); // Carretera
    } else {
      fill(100, 255, 100); // Zona verde
    }
    rect(0, i * gridSize, width, gridSize);
  }
  
  // Dibujar la meta
  fill(50, 200, 50); // Zona verde para la meta
  rect(0, 0, width, gridSize); // Meta (final)

  // Mostrar la mascota en el minijuego
  imageMode(CENTER);
  image(petImg, petX + gridSize / 2, petY + gridSize / 2, petMinigameSize, petMinigameSize); // Tamaño reducido para el minijuego
  
  // Mover coches
  moveCars();
  
  // Dibujar coches
  drawCars();
  
  // Colisión con coches
  checkCollision();
  
  // Comprobar si llega a la meta
  if (petY === 0) {
    level++; // Aumenta el nivel
    startMinigame(); // Reinicia el minijuego
  }
}

function drawCars() {
  // Dibujar coches de izquierda a derecha
  for (let i = 0; i < carsLeft.length; i++) {
    fill(255, 0, 0);
    rect(carsLeft[i].x, carsLeft[i].y, gridSize, gridSize); // Dibuja los coches
  }

  // Dibujar coches de derecha a izquierda
  for (let i = 0; i < carsRight.length; i++) {
    fill(0, 0, 255);
    rect(carsRight[i].x, carsRight[i].y, gridSize, gridSize); // Dibuja los coches
  }
}

function drawBar(x, y, value, color) {
  fill(color);
  rect(x, y, value * 2, 20); // Dibuja una barra que ocupa el doble del valor
  stroke(0);
  noFill();
  rect(x, y, 200, 20); // Dibuja el contorno de la barra
}

function feed() {
  hunger = min(hunger + 10, 100);
}

function play() {
  happiness = min(happiness + 10, 100);
  energy = max(energy - 5, 0);
}

function sleep() {
  energy = min(energy + 10, 100);
}

function keyPressed() {
  if (inMinigame) {
    // Movimiento de la mascota en la cuadrícula del minijuego
    if (keyCode === UP_ARROW && petY > 0) {
      petY -= gridSize; // Mover hacia arriba
    } else if (keyCode === DOWN_ARROW && petY < height - gridSize) {
      petY += gridSize; // Mover hacia abajo
    } else if (keyCode === LEFT_ARROW && petX > 0) {
      petX -= gridSize; // Mover hacia la izquierda
    } else if (keyCode === RIGHT_ARROW && petX < width - gridSize) {
      petX += gridSize; // Mover hacia la derecha
    }
  }
}

function moveCars() {
  // Aumentar la cantidad de coches
  while (carsLeft.length < 5) {
    carsLeft.push({x: random(-gridSize, width), y: floor(random(1, rows - 1)) * gridSize});
  }
  while (carsRight.length < 5) {
    carsRight.push({x: random(width), y: floor(random(1, rows - 1)) * gridSize});
  }

  // Mover coches de izquierda a derecha
  for (let i = 0; i < carsLeft.length; i++) {
    carsLeft[i].x += carSpeed; // Mover a la derecha
    if (carsLeft[i].x > width) {
      carsLeft[i].x = -gridSize; // Reaparece por el lado izquierdo
    }
  }
  
  // Mover coches de derecha a izquierda
  for (let i = 0; i < carsRight.length; i++) {
    carsRight[i].x -= carSpeed; // Mover a la izquierda
    if (carsRight[i].x < -gridSize) {
      carsRight[i].x = width; // Reaparece por el lado derecho
    }
  }
}

function checkCollision() {
  // Colisión con coches de izquierda a derecha
  for (let i = 0; i < carsLeft.length; i++) {
    if (petX === floor(carsLeft[i].x / gridSize) * gridSize && petY === carsLeft[i].y) {
      showMessage('You got hit by a car!', 'red');
      noLoop(); // Detener el juego
      return; // Salir de la función
    }
  }
  
  // Colisión con coches de derecha a izquierda
  for (let i = 0; i < carsRight.length; i++) {
    if (petX === floor(carsRight[i].x / gridSize) * gridSize && petY === carsRight[i].y) {
      showMessage('You got hit by a car!', 'red');
      noLoop(); // Detener el juego
      return; // Salir de la función
    }
  }
}

function showMessage(msg, color) {
  fill(color);
  textSize(24);
  textAlign(CENTER);
  text(msg, width / 2, height / 2);
}

function startMinigame() {
  inMinigame = true; // Entra al minijuego
  petX = floor(width / gridSize / 2) * gridSize; // Reiniciar la posición de la mascota
  petY = (rows - 1) * gridSize; // Mascota en la línea de inicio
  level = 1; // Reiniciar nivel
  carsLeft = [];
  carsRight = [];
  generateRoads(); // Generar nuevas carreteras y zonas verdes
}

function generateRoads() {
  roads = [];
  let greenCount = 0;
  let blackCount = 0;
  
  for (let i = 0; i < rows; i++) {
    if (i > 0 && i < rows - 1) {
      // No permitir dos zonas verdes juntas
      if (greenCount < blackCount && random() < 0.4 && roads[i - 1] !== 'green') {
        roads[i] = 'green'; // Generar zona verde
        greenCount++;
      } else {
        roads[i] = 'road'; // Generar carretera
        blackCount++;
      }
    } else {
      roads[i] = 'green'; // La primera y última fila siempre son zonas verdes
    }
  }
  
  // Generar coches en las carreteras
  for (let i = 1; i < rows - 1; i++) {
    if (roads[i] === 'road') {
      let carCount = floor(random(1, 4)); // Número de coches en esta fila
      for (let j = 0; j < carCount; j++) {
        if (random() < 0.5) {
          carsLeft.push({x: random(-gridSize, width), y: i * gridSize});
        } else {
          carsRight.push({x: random(width, width * 2), y: i * gridSize});
        }
      }
    }
  }
}

function backToGame() {
  inMinigame = false; // Regresar al juego principal
  petX = width / 2; // Reiniciar la posición de la mascota
  petY = height - gridSize; // Mascota en la parte inferior del canvas
  carsLeft = [];
  carsRight = [];
  loop(); // Reiniciar el loop del juego
}
