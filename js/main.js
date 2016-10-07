// Set up three.js global variables
var scene, camera, renderer, container, loadingManager;
// Set up avatar global variables
var bbox;
// Transfer global variables
var i_share = 0, n_share = 1, i_delta = 0.0;
 
var particles;      //array to store particles
var maxParticles=90;        //max number of particles
var maxSplitParticles=20;
var splitParticles;

var m = 1; 
var g = 10; 
var vx = 10;
var vy = -10;
var fps = 60; // controls rate of creation of particles
var t1,t0,dt;
var acc, force;


init();
animate();

// Sets up the scene.
function init()
{
    // Create the scene and set the scene size.
    scene = new THREE.Scene();
    

    particles = new Array();
    splitParticles=new Array();
    t0 = new Date().getTime();
    t1=0;
    // keep a loading manager
    loadingManager = new THREE.LoadingManager();

    // Get container information
    container = document.createElement( 'div' );
    document.body.appendChild( container ); 
        
    var WIDTH = window.innerWidth, HEIGHT = window.innerHeight; //in case rendering in body
    

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    // Set the background color of the scene.
    renderer.setClearColor(0x333333, 1);
    //document.body.appendChild(renderer.domElement); //in case rendering in body
    container.appendChild( renderer.domElement );

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45.0, WIDTH / HEIGHT, 0.01, 100);
    camera.position.set(-2, 2, -5);
    //camera.lookAt(new THREE.Vector3(5,0,0));
    scene.add(camera);
  
    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize',
        function ()
        {
            var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        }
    );
 
    // Create a light, set its position, and add it to the scene.
    var alight = new THREE.AmbientLight(0xFFFFFF);
    alight.position.set(-100.0, 200.0, 100.0);
    scene.add(alight);

    // Load in the mesh and add it to the scene.
    var sawBlade_texPath = 'assets/sawblade.jpg';
    var sawBlade_objPath = 'assets/sawblade.obj';
    OBJMesh(sawBlade_objPath, sawBlade_texPath, "sawblade");

    var ground_texPath = 'assets/ground_tile.jpg';
    var ground_objPath = 'assets/ground.obj';
    OBJMesh(ground_objPath, ground_texPath, "ground");

    var slab_texPath = 'assets/slab.jpg';
    var slab_objPath = 'assets/slab.obj';
    OBJMesh(slab_objPath, slab_texPath, "slab");
    
 
     //Cube
    var cube_texPath = 'assets/rocky.jpg';
    var cube_objPath = 'assets/cube.obj';
    OBJMesh(cube_objPath, cube_texPath, "cube");
    
    
 
    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.4;
    controls.userPanSpeed = 0.01;
    controls.userZoomSpeed = 0.01;
    controls.userRotateSpeed = 0.01;
    controls.minPolarAngle = -Math.PI/2;
    controls.maxPolarAngle = Math.PI/2;
    controls.minDistance = 0.01;
    controls.maxDistance = 30;


    clock = new THREE.Clock();
    var delta = clock.getDelta();
}

function animate()
{
    //setTimeout(function() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            controls.update();
            
            postProcess();
            timer1();
            timer2();
    //}, 1000/fps);

    
    
}


function timer1(){
    //var t1 = new Date().getTime(); 
    //dt = 0.001*(t1-t0); //t1-to = elapsed time
    //t0 = t1;
    //if (dt>0.2) {dt=0;};
    if (particles.length < maxParticles){
        var speed=Math.random()*5;
        createNewParticles(1.1,Math.random()-1,1.25,Math.random()-0.25,speed,speed,speed,new Date().getTime(),0,0,0,Math.random()*20,5);
        createNewParticles(1.1,Math.random()-1,1.25,Math.random()-0.25,speed,speed,speed,new Date().getTime(),0,0,0,Math.random()*35,5);
    }  
    for (var i=0; i<particles.length; i++){
        var particle = particles[i];    
        modifyObject(particle,i);   
        var tnow=(new Date().getTime()-particle.createTime)*0.000525;
        //console.log(tnow);
        moveObject(particle,tnow);
        //calcForce(particle);
        //updateAccel();
        //updateVelo(particle);               
    }   
    

    //move();
}     

function timer2(){
    for (var i=0; i<splitParticles.length; i++){
        var particle = splitParticles[i];    
        //modifysplitObject(particle,i);   
        var tnow=(new Date().getTime()-particle.createTime)*0.000525;
        //console.log(tnow);
        moveObject(particle,tnow);

        if(particle.mesh.position.y <0){
            scene.remove(particle.mesh);
       // splitParticles.splice(i,1);
        
    }
        //calcForce(particle);
        //updateAccel();
        //updateVelo(particle);               
    }   
}

var count =0;
function createNewParticles(radius,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color){
    
    var newParticle = new Particle(radius,1,x,y,z,-vx,vy,0,createTime,ax,ay,az,angle,life,color);            //function Particle(radius,mass,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life)
    //setProperties(newParticle,ppos);                
    particles.push(newParticle);
    //console.log(particles.length);
    scene.add(newParticle.mesh);
}   
function createSplitParticles(radius,mass,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color){
    var speed=Math.random()*20;
    var newParticle = new Particle(radius,mass,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color);   // Particle(radius,mass,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color1)
    //setProperties(newParticle,ppos);                
    splitParticles.push(newParticle);
    //console.log(particles.length);
    scene.add(newParticle.mesh);
}   
function modifyObject(obj,i){       
    //obj.alpha += -0.01; 
    //obj.age += dt;

    if ((obj.mesh.position.y <=0.2 && particles.length<=maxParticles && obj.radius >1) || (obj.mesh.position.y<=1 && obj.mesh.position.x <= -2.5) || (obj.mesh.position.y<=1 && obj.mesh.position.x<=-2.5 && obj.mesh.position.z <=0.5) ){
        
        //createNewParticles(obj.radius/2,m,);

        //createNewParticles(obj.radius/2,m,obj.mesh.position.x,obj.mesh.position.y+2,obj.mesh.position.z,-obj.speed/2,obj.speed/2,0,new Date().getTime(),0,0,0,Math.random()*45,5);
        
        //createNewParticles(obj.radius/2,m,obj.mesh.position.x,obj.mesh.position.y+2,obj.mesh.position.z,obj.speed/2,obj.speed/2,0,new Date().getTime(),0,0,0,Math.random()*45,5);
        //splitparts+=1;
        //createNewParticles(obj.radius/2,m,obj.x,obj.y,obj.z,obj.speed/2,obj.speed/2,0,new Date().getTime(),0,0,0,Math.random()*45,5,0x00ffff);
        
        //if(count<5){
            
            createSplitParticles(0.5,1,obj.mesh.position.x,obj.mesh.position.y,obj.mesh.position.z,-obj.vx/(Math.random() +1),obj.vy/(Math.random() +1),obj.vz/1.25,new Date().getTime(),0,0,0,5,0xffffff);  //radius,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color
            createSplitParticles(0.5,1,obj.mesh.position.x,obj.mesh.position.y,obj.mesh.position.z,obj.vx/(Math.random() +1),obj.vy/(Math.random() +1),obj.vz/1.25,new Date().getTime(),0,0,0,5,0xffffff);  //radius,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color
        
         //}
         removeObject(i);
        scene.remove(obj.mesh);

    }

}   

function modifysplitObject(obj,i){       
    //obj.alpha += -0.01; 
    //obj.age += dt;
    if (obj.mesh.position.y <=0.5){
        
        //createNewParticles(obj.radius/2,m,);

        //createNewParticles(obj.radius/2,m,obj.mesh.position.x,obj.mesh.position.y+2,obj.mesh.position.z,-obj.speed/2,obj.speed/2,0,new Date().getTime(),0,0,0,Math.random()*45,5);
        
        //createNewParticles(obj.radius/2,m,obj.mesh.position.x,obj.mesh.position.y+2,obj.mesh.position.z,obj.speed/2,obj.speed/2,0,new Date().getTime(),0,0,0,Math.random()*45,5);
        //splitparts+=1;
        //createNewParticles(obj.radius/2,m,obj.x,obj.y,obj.z,obj.speed/2,obj.speed/2,0,new Date().getTime(),0,0,0,Math.random()*45,5,0x00ffff);
        
        //if(count<5){
            
            //createSplitParticles(obj.radius/2,obj.mesh.position.x,obj.mesh.position.y,obj.mesh.position.z,-obj.vx/2,obj.vy/2,obj.vz/2,new Date().getTime(),0,0,0,5,0x00ffff);  //radius,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color
            //createSplitParticles(obj.radius/2,obj.mesh.position.x,obj.mesh.position.y,obj.mesh.position.z,obj.vx/2,obj.vy/2,obj.vz/2,new Date().getTime(),0,0,0,5,0x00ffff);  //radius,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color
        
         //}
         //console.log("Hi");
        splitParticles.splice(i,2);
        scene.remove(obj.mesh);

    }

}   

function recycleParticles(){
    var firstParticle = particles[0];   
    //resetObject(firstParticle);
    //setProperties(firstParticle,ppos);          
    particles.shift();
    particles.push(firstParticle);
}
function removeObject(num){
    particles.splice(num,1);    
}
function moveObject(obj,t){
    //console.log(t);
    obj.mesh.position.x=obj.vx* Math.cos(Math.PI/180 *obj.angle)* t+obj.x;//obj.pos2D.addScaled(obj.velo2D,dt); 
    obj.mesh.position.y=obj.vy* Math.sin(Math.PI/180 * obj.angle)* t -(0.5 * 9.8 * t*t)+obj.y;//obj.pos2D.addScaled(obj.velo2D,dt);
    obj.mesh.position.z=obj.vz * Math.cos(Math.PI/180 *obj.angle)* t+obj.z;

    //obj.draw(context);  
}
function calcForce(obj){
    var gravity = Forces.constantGravity(m,g);  
    var drag = Forces.drag(k,obj.velo2D);
    force = Forces.add([gravity, drag]);                
}   
function updateAccel(){
    acc = force.multiply(1/m);
}   
function updateVelo(obj){
    obj.velo2D = obj.velo2D.addScaled(acc,dt);              
}


function rotate(object, axis, radians)
{
    var rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.applyMatrix(rotObjectMatrix);
}
function translate(object, x, y, z)
{
    var transObjectMatrix = new THREE.Matrix4();
    transObjectMatrix.makeTranslation(x, y, z);
    object.applyMatrix(transObjectMatrix);
}
function postProcess()
{
    
    var delta = clock.getDelta();
    var asset = scene.getObjectByName( "sawblade" );

    translate(asset, 0,-1.5,0);
    rotate(asset, new THREE.Vector3(0,0,1), -9* delta); //rotate sawblade
    translate(asset, 0,1.5,0);
    
    
}


function OBJMesh(objpath, texpath, objName)
{
    var texture = new THREE.TextureLoader( loadingManager ).load(texpath, onLoad, onProgress, onError);
    var loader  = new THREE.OBJLoader( loadingManager ).load(objpath,  
        function ( object )
        {
            object.traverse(
                function ( child )
                {
                    if(child instanceof THREE.Mesh)
                    {
                        child.material.map = texture;
                        child.material.needsUpdate = true;
                    }
    
                }
            );

            object.name = objName;
            //if(objName=="sawblade")
              //  translate(object, 0,1.5,0); //move it up to slab
    
            scene.add( object );
            onLoad( object );
        },
    onProgress, onError);
}

function onLoad( object )
{
    putText(0, "", 0, 0);
    i_share ++;
    if(i_share >= n_share)
        i_share = 0;
}

function onProgress( xhr )
{ 
    if ( xhr.lengthComputable )
    {
        var percentComplete = 100 * ((xhr.loaded / xhr.total) + i_share) / n_share;
        putText(0, Math.round(percentComplete, 2) + '%', 10, 10);
    }
}

function onError( xhr )
{
    putText(0, "Error", 10, 10);
}


function putText( divid, textStr, x, y )
{
    var text = document.getElementById("avatar_ftxt" + divid);
    text.innerHTML = textStr;
    text.style.left = x + 'px';
    text.style.top  = y + 'px';
}

function putTextExt(dividstr, textStr) //does not need init
{
    var text = document.getElementById(dividstr);
    text.innerHTML = textStr;
}

