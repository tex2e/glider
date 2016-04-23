'use strict';

// --- init ---

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff );
document.body.appendChild( renderer.domElement );

var glider = new THREE.Object3D();
scene.add( glider );

var geometry = new THREE.BoxGeometry( 3, 0.2, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xaaaaaa } );
var cube = new THREE.Mesh( geometry, material );
glider.add( cube );

var geometry = new THREE.CylinderBufferGeometry( 0.3, 0.3, 1, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xdddddd} );
var cylinder = new THREE.Mesh( geometry, material );
cylinder.rotation.x = Math.PI / 2;
glider.add( cylinder );

// --- update ---

Leap.loop(function(frame) {
  frame.hands.forEach(function(hand, index) {
    // glider.setTransform(hand.screenPosition(), hand.roll());
    var handPostiion = hand.screenPosition();
    var handRotation = hand.roll();

    glider.position.x =  (handPostiion[0] - 500) / 100;
    glider.position.y = -(handPostiion[1] + 500) / 200;
    glider.rotation.z = handRotation;
  });
  renderer.render(scene, camera);
}).use('screenPosition', {scale: 1});;
