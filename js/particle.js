function Particle(radius,mass,x,y,z,vx,vy,vz,createTime,ax,ay,az,angle,life,color1){
	if(typeof(radius)==='undefined') radius = 2;
	if(typeof(vx)==='undefined') vx = 5;
	if(typeof(vy)==='undefined') vy = -5;
	if(typeof(vz)==='undefined') vz= 0;
	if(typeof(mass)==='undefined') mass = 2;
	if(typeof(ax)==='undefined') ax = 0;
	if(typeof(ay)==='undefined') ay= 0;
	if(typeof(az)==='undefined') az= 0;	
	if(typeof(angle)==='undefined') angle = Math.PI/4;	
	if(typeof(life)==='undefined') life=3;	
	if(typeof(color1)==='undefined') color1=0xffff00;

	var sphereGeometry = new THREE.SphereGeometry(radius/50);
	var sphereMaterial = new THREE.ParticleBasicMaterial(
	{color: color1,size: 0.5 });
	
	this.mesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
	this.createTime=createTime;
	this.radius = radius;
	this.mass = mass;
	this.x=x;
	this.y=y;
	this.z=z;
	this.vx = vx;
	this.vy = vy;
	this.vz = vz;
	this.ax = ax;
	this.ay = ay;
	this.az= az;
	this.angle = angle;
	this.life=life;
	this.mesh.position.x=x;
	this.mesh.position.y=y;
	this.mesh.position.z=z;
	this.color1=color1;
}

Particle.prototype={
	get position(){
		return Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
	},
	set position(pos){
		this.mesh.position.x=pos.x;
		this.mesh.position.y=pos.y;
		this.mesh.position.z=pos.z;
	},
	get velocity(){
		return Vector3(this.vx,this.vy,this.vz);
	},
	set velocity(vec){
		this.vx=vec.x;
		this.vy=vec.y;
		this.vz=vec.z;
	},
	get acceleration(){
		return Vector3(this.ax,this.ay,this.az);
	},
	set acceleration(acc){
		this.ax=acc.x;
		this.ay=acc.y;
		this.az=acc.z;
	},
	move :function(particle,t){
		particle.x= particle.velocity.x* Math.cos(Math.PI/180 * angle)* t;
		particle.y=particle.velocity.y* Math.sin(Math.PI/180 * angle)* t -(0.5 * 9.8 * t*t);

	}
};