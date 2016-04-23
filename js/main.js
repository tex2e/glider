'use strict';

// --- init ---

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff );
document.body.appendChild( renderer.domElement );

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
scene.add( light );

var glider = new THREE.Object3D();
scene.add( glider );

var geometry = new THREE.BoxGeometry( 3, 0.2, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0xaaaaaa } );
var cube = new THREE.Mesh( geometry, material );
glider.add( cube );

var geometry = new THREE.CylinderBufferGeometry( 0.3, 0.3, 1, 32 );
var material = new THREE.MeshLambertMaterial( {color: 0xdddddd} );
var cylinder = new THREE.Mesh( geometry, material );
cylinder.rotation.x = Math.PI / 2;
glider.add( cylinder );

function merge(obj1, obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

// define uniq id for each objects
(function() {
  if ( typeof Object.prototype.uniqueId == "undefined" ) {
    var id = 0;
    Object.prototype.uniqueId = function() {
      if ( typeof this.__uniqueid == "undefined" ) {
        this.__uniqueid = ++id;
      }
      return this.__uniqueid;
    };
  }
})();

function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}

var walls = [];
var wallSpeed = 0.5;
function createWallAtRandom(_pos) {
  var pos = merge({ x: 0, y: 0, z: -100 }, (_pos || {}));
  var wall = new THREE.Object3D();
  wall.name = "wall" + wall.uniqueId();
  wall.position.set(pos.x, pos.y, pos.z);
  switch (getRandomInt(0, 3)) {
  case 0:
    return createVerticalWall(wall);
  case 1:
    return createHorizontalWall(wall);
  case 2:
    return createTopRightDiagonalWall(wall);
  case 3:
    return createTopLeftDiagonalWall(wall);
  }
}
function createVerticalWall(parent) {
  var geometry = new THREE.BoxGeometry( 3, 20, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0x888888 } );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.x = -5;
  parent.add( cube.clone() );
  cube.position.x = +5;
  parent.add( cube.clone() );
  return parent;
}
function createHorizontalWall(parent) {
  var geometry = new THREE.BoxGeometry( 20, 3, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0x888888 } );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.y = -5;
  parent.add( cube.clone() );
  cube.position.y = +5;
  parent.add( cube.clone() );
  return parent;
}
function createTopRightDiagonalWall(parent) {
  var geometry = new THREE.BoxGeometry( 20, 3, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0x888888 } );
  var cube = new THREE.Mesh( geometry, material );
  cube.rotation.z = Math.PI * 1 / 4;
  cube.position.x = -5;
  parent.add( cube.clone() );
  cube.position.x = +5;
  parent.add( cube.clone() );
  return parent;
}
function createTopLeftDiagonalWall(parent) {
  var geometry = new THREE.BoxGeometry( 20, 3, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0x888888 } );
  var cube = new THREE.Mesh( geometry, material );
  cube.rotation.z = Math.PI * 3 / 4;
  cube.position.x = -5;
  parent.add( cube.clone() );
  cube.position.x = +5;
  parent.add( cube.clone() );
  return parent;
}

for (var i = 1; i <= 3; i++) {
  var wall = createWallAtRandom({ z: i * -50 });
  walls.push(wall);
  scene.add(wall);
}

// --- update ---

var loopOption = {
  loopWhileDisconnected: true
};

Leap.loop(loopOption, function(frame) {
  // control glider
  frame.hands.forEach(function(hand, index) {
    // glider.setTransform(hand.screenPosition(), hand.roll());
    var handPostiion = hand.screenPosition();
    var handRotation = hand.roll();

    glider.position.x =  (handPostiion[0] - 500) / 100;
    glider.position.y = -(handPostiion[1] + 500) / 200;
    glider.rotation.z = handRotation;
  });

  // move walls
  walls.forEach(function (wall) {
    wall.position.z += wallSpeed;
  });
  // delete and create new wall
  if (walls[0].position.z >= 0) {
    var wallName = walls.shift().name;
    var selectedObject = scene.getObjectByName( wallName );
    scene.remove( selectedObject );
    var newWall = createWallAtRandom({ z: -150 });
    walls.push( newWall );
    scene.add( newWall );
  }

  renderer.render(scene, camera);
}).use('screenPosition', {scale: 1});;
