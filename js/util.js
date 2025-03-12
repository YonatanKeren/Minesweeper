'use strict'


function getRandNumExc(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandNumInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomColor() {
  const letters = '0123456789ABCDEF'
  var color = '#'

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

