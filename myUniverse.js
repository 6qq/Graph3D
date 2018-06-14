class Vector{
	constructor(x,y,z){
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.size = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}
	
	unit(){
		return this.get(1/this.size);
	}
	
	negative(){
		return this.get(-1);
	}
	
	get(n){
		return new Vector(this.x*n,this.y*n,this.z*n);
	}
	
	res(v2){
		return Vector.ex(this,v2.unit().get(Vector.skaler(this,v2.unit())));
	}
	
	static sum(v1,v2){
		return new Vector(v1.x + v2.x,v1.y + v2.y,v1.z + v2.z);
	}
	
	static ex(v1,v2){
		return new Vector(v1.x - v2.x,v1.y - v2.y,v1.z - v2.z);
	}
	
	static skaler(v1,v2){
		return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
	}

	static vectoral(v1,v2){
		return new Vector(v1.y*v2.z - v1.z*v2.y,v1.z*v2.x - v1.x*v2.z,v1.x*v2.y - v1.y*v2.x);
	}
}

class CylinderVector{
	constructor(r,o,z){
		this.r = r||0;
		this.o = o||0;
		this.z = z||0;
	}
	
	toCartesian(){
		return new Vector(this.r*Math.cos(this.o),this.r*Math.sin(this.o),this.z);
	}
}

class SphereVector{
	constructor(p,o,phi){
		this.p = p||0;
		this.o = o||0;
		this.phi = phi||0;
	}
	
	toCartesian(){
		return new Vector(this.p*Math.cos(this.phi)*Math.cos(this.o),this.p*Math.cos(this.phi)*Math.sin(this.o),this.p*Math.sin(this.phi));
	}
}

class Boyer_LindquistVector{
	constructor(r,o,phi){
		this.r = r||0;
		this.o = o||0;
		this.phi = phi||0;
	}
	
	toCartesian(){
		return new Vector(Math.sqrt(this.r*this.r + 1)*Math.sin(this.o)*Math.cos(this.phi), Math.sqrt(this.r*this.r + 1)*Math.sin(this.o)*Math.sin(this.phi),this.r*Math.cos(this.o));
	}
}

class Person{
	constructor(type){
		this.position = new Vector(0,0,1);
		this.camera = new Vector(0.6,0,0);
		this.legs = new Vector(0,0,-1);
		this.rightArm = new Vector(0,1,0);
		this.radius = 1;
		this.type = type;
		this.ground;
		this.onGround = false;
		this.velocity = new Vector(0,0,0);
		this.acceleration = new Vector(0,0,0);
		this.vision = 5000;
		this.isElastic = false;
	}
	
	transformPoint(v1){
		var v2 = Vector.ex(v1,this.position);
		var distance = v2.size;
		if(Vector.skaler(v2,this.camera) > 0 && distance < this.vision){
			var x = Vector.skaler(v2,this.rightArm);;
			var y = Vector.skaler(v2,this.legs);
			return new Vector(x,y,distance);
		}else{
			return null;
		}
	}

	turn(axis,ang){
		this.rotate(axis,ang,this.camera);
		this.rotate(axis,ang,this.legs);
		this.rotate(axis,ang,this.rightArm);
	}
	
	rotate(axis,ang,v1){
		var x = v1.x;
		var y = v1.y;
		var z = v1.z;
		switch(axis){
			case "x" : 
				v1.y = y*Math.cos(ang) - z*Math.sin(ang);
				v1.z = y*Math.sin(ang) + z*Math.cos(ang);
				break;
			case "y" :
				v1.x = x*Math.cos(ang) - z*Math.sin(ang);
				v1.z = x*Math.sin(ang) + z*Math.cos(ang);
				break;
			case "z" : 
				v1.x = x*Math.cos(ang) - y*Math.sin(ang);
				v1.y = x*Math.sin(ang) + y*Math.cos(ang);
				break;
		}
	}
	
	move(direction){
		switch(direction || "next"){
			case "next" : (this.type == "god")? this.position = Vector.sum(this.position,this.camera) : this.velocity = this.camera.get(0.5);break;
			case "back" : (this.type == "god")? this.position = Vector.ex(this.position,this.camera) : this.velocity = this.camera.get(0.5).negative();break;
		}
	}
}

class CoordinateSystem{
	constructor(){
		this.player;
		this.lives = [];
		this.domElement = document.createElement("canvas");
		this.domElement.style="background-color:black;position:absolute;left:0px";
		this.points = [];
		this.functions = [];
		this.G = 10;
	}
	
	addPoint(v1){
		this.points.push(v1);
	}
	
	addFunction(f){	
		this.functions.push(f);
	}
	
	addPlayer(lv){
		this.player = lv;
		var player = this.player;
		window.onkeydown = function(e){
			switch(e.keyCode){
				case 87 : if(player.onGround || player.type == "god")player.move("next");break;
				case 83 : if(player.onGround || player.type == "god")player.move("back");break;
				case 65 : player.turn("z",-Math.PI/24);break;
				case 68 : player.turn("z",Math.PI/24);break;
				case 81 : player.turn("y",Math.PI/24);break;
				case 69 : player.turn("y",-Math.PI/24);break;
				case 82 : player.turn("x",Math.PI/24);break;
				case 70 : player.turn("x",-Math.PI/24);break;
				case 32 : if(player.onGround || player.type == "god")player.velocity.z+=0.2;break;
			}
		}
	}
	
	addLive(lv){
		this.lives.push(lv);
	}
	
	timer(){
		for(let i = 0;i < this.lives.length;i++){
			var live = this.lives[i];
			if(live.type == "human"){
				live.position = Vector.sum(live.position,live.velocity);
				live.velocity.z -= 0.0001;
				if(live.ground != null && live.type != "god"){
					var ground = live.ground;
					var x1 = Math.floor(live.position.x);
					var y1 = Math.floor(live.position.y);
				 
					var dx =  ground.points[x1 + 1][y1] - ground.points[x1][y1];
					var dy =  ground.points[x1][y1 + 1] - ground.points[x1][y1];
						
					var z1 = ground.points[x1][y1] + dx*(live.position.x - x1) + dy*(live.position.y - y1) + live.radius;
					var z2 = live.position.z + live.velocity.z;
			
					if(z1 > z2){
						live.onGround = true;
						live.position.z = z1;
						live.velocity = live.velocity.get(0.9999);
						var v1 = Vector.vectoral(new Vector(1,0,dx),new Vector(0,1,dy));
						var sk = Vector.skaler(live.velocity,v1.unit());
						if(sk < 0){
							if(live.isElastic){
								live.velocity = Vector.ex(live.velocity,v1.unit().get(2*sk));
							}else{
								live.velocity = Vector.ex(live.velocity,v1.unit().get(sk));
							}
						}
					}else{
						live.onGround = false;
					}
				}
			}
		}
	}
	
	setSize(width,height){
		this.domElement.width = width;
		this.domElement.height = height;
	}
	
	rotate(axis,ang,origin = new Vector(0,0,0)){
		this.points.forEach(function(p){
			var x = p.x - origin.x;
			var y = p.y - origin.y;
			var z = p.z - origin.z;
			switch(axis){
				case "x" : 
					p.y = y*Math.cos(ang) - z*Math.sin(ang) + origin.y;
					p.z = y*Math.sin(ang) + z*Math.cos(ang) + origin.z;
					break;
				case "y" :
					p.x = x*Math.cos(ang) - z*Math.sin(ang) + origin.x;
					p.z = x*Math.sin(ang) + z*Math.cos(ang) + origin.z;
					break;
				case "z" : 
					p.x = x*Math.cos(ang) - y*Math.sin(ang) + origin.x;
					p.y = x*Math.sin(ang) + y*Math.cos(ang) + origin.y;
					break;
			}
		});
		this.functions.forEach(function(f){
			f.rotate(axis,ang,origin);
		});
	}
	
	render(){
		var ctx = this.domElement.getContext("2d");
		ctx.clearRect(0,0,this.domElement.width,this.domElement.height);
		ctx.translate(this.domElement.width/2,this.domElement.height/2);
		ctx.beginPath();
		for(let i = 0;i < this.points.length;i++){
			var v1 = this.player.transformPoint(this.points[i]);
			if(v1 != null){
				ctx.moveTo(v1.x*innerWidth/v1.z + 1,v1.y*innerWidth/v1.z);
				ctx.arc(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z,100/v1.z,0,2*Math.PI);
			};	
		}
		ctx.fill();
		
		ctx.fillStyle = "green";
		for(let j = 0;j < this.lives.length;j++){
			this.timer();
			var v1 = this.player.transformPoint(this.lives[j].position);
			if(v1 != null){
				ctx.moveTo(v1.x*innerWidth/v1.z + 1,v1.y*innerWidth/v1.z);
				ctx.arc(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z,this.lives[j].radius*1600/v1.z,0,2*Math.PI);
			}
		}
		ctx.fill();
		
		for(let k = 0;k < this.functions.length;k++){
			this.functions[k].print(ctx,this.player);
	    }
		ctx.resetTransform();
	}
}

class Function2{
	constructor(f,startInput1 = 0,startInput2 = 0,endInput1 = 0,endInput2 = 0,sparsityInput1 = 1,sparsityInput2 = 1,type,color){
		this.lenInput1 = Math.ceil((endInput1 - startInput1)/sparsityInput1);
		this.lenInput2 = Math.ceil((endInput2 - startInput2)/sparsityInput2);
		this.startInput1 = startInput1;
		this.endInput1 = endInput1;
		this.startInput2 = startInput2;
		this.endInput2 = endInput2;
		this.sparsityInput1 = sparsityInput1;
		this.sparsityInput2 = sparsityInput2;
		this.rootFunction = f;
		this.type = type || "cartesian";
		this.color = color || "green";
	
		this.points = new Array(this.lenInput1);
		for(let i = 0;i < this.points.length;i++){
			this.points[i] = new Array(this.lenInput2);
		}
	
		var countX = 0,countY = 0;
	
		switch(this.type){
			case "cartesian" : 
			for(let i = startInput1;i < endInput1;i+=sparsityInput1){
				for(let j = startInput2;j < endInput2;j+=sparsityInput2){
					this.points[countX][countY++] = new Vector(i,j,f(i,j));
				}
				countX++;
				countY = 0;
			}break;
			case "cylinder" :
			for(let i = startInput1;i < endInput1;i+=sparsityInput1){
				for(let j = startInput2;j < endInput2;j+=sparsityInput2){
					this.points[countX][countY++] = new CylinderVector(i,j,f(i,j)).toCartesian();
				}
				countX++;
				countY = 0;
			}break;
			case "sphere" :
			for(let i = startInput1;i < endInput1;i+=sparsityInput1){
				for(let j = startInput2;j < endInput2;j+=sparsityInput2){
					this.points[countX][countY++] = new SphereVector(f(i,j),i,j).toCartesian();
				}
				countX++;
				countY = 0;
			}break;
		}
	}
	
	
	rotate(axis,ang,origin){
		this.points.forEach(function(p1){
			p1.forEach(function(p2){
				var x = p2.x - origin.x;
				var y = p2.y - origin.y;
				var z = p2.z - origin.z;
				switch(axis){
				case "x" : 
					p2.y = y*Math.cos(ang) - z*Math.sin(ang) + origin.y;
					p2.z = y*Math.sin(ang) + z*Math.cos(ang) + origin.z;
					break;
				case "y" :
					p2.x = x*Math.cos(ang) - z*Math.sin(ang) + origin.x;
					p2.z = x*Math.sin(ang) + z*Math.cos(ang) + origin.z;
					break;
				case "z" : 
					p2.x = x*Math.cos(ang) - y*Math.sin(ang) + origin.x;
					p2.y = x*Math.sin(ang) + y*Math.cos(ang) + origin.y;
					break;
				}
			});
		});
	}

	print(ctx,person){
		ctx.strokeStyle = this.color;
		for(let i = 0;i < this.lenInput1;i++){
			ctx.beginPath();
			for(let j = 0;j < this.lenInput2;j++){
				var v1 = person.transformPoint(this.points[i][j]);
				if(v1 != null){
					ctx.lineTo(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z);
				}else{
					ctx.stroke();
					ctx.beginPath();
				}
			}
			ctx.stroke();
		}
		for(let i = 0;i < this.lenInput2;i++){
			ctx.beginPath();
			for(let j = 0;j < this.lenInput1;j++){
				var v1 = person.transformPoint(this.points[j][i]);
				if(v1 != null){
					ctx.lineTo(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z);
				}else{
					ctx.stroke();
					ctx.beginPath();
				}
			}
			ctx.stroke();
		}
	}
}
