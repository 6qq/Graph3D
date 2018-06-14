class Tornado{
	constructor(position,type,radiusBottom,radiusTop,height,density,angularVelocity,color){
		this.cluster = new PointCluster(position,type,color);
		this.position = position;
		this.angularVelocity = angularVelocity;
		for(let i = 0;i < density;i++){
			var z = Math.random()*height;
			var r = z*(radiusTop - radiusBottom)/height*Math.random() + radiusBottom;
			var o = Math.random()*2*Math.PI;
			this.cluster.addPoint(Vector.sum(this.position,new CylinderVector(r,o,z).toCartesian()));
		}
	}
	
	
	setColor(color){
		this.cluster.color = color;
	}
	
	getColor(){
		return this.cluster.color;
	}
	
	print(ctx,person){
		this.cluster.rotate("z",this.angularVelocity,this.position);
		this.cluster.print(ctx,person);
	}
	
	move(v1){
		this.cluster.translate(v1);
		this.position = Vector.sum(this.position,v1);
	}
}

class SnowStorm{
	constructor(position,volume,wind,density,color){
		this.cluster = new PointCluster(position,"dotted",color)
		this.wind = wind;
		this.position = position;
		for(let i = 0;i < density;i++){
			var x = Math.random()*volume.x;
			var y = Math.random()*volume.y;
			var z = Math.random()*volume.z;
			this.cluster.addPoint(Vector.sum(this.position,new Vector(x,y,z)));
		}
	}
	
	print(ctx,person){
		for(let i = 0;i < this.cluster.points.length;i++){
			this.cluster.points[i] = Vector.sum(this.cluster.points[i],this.wind);
			if(this.cluster.points[i].z < 0){
				this.cluster.points[i].x = Math.random()*volume.x;
				this.cluster.points[i].y = Math.random()*volume.y;
				this.cluster.points[i].z = volume.z;
				this.cluster.points[i] = Vector.sum(this.cluster.points[i],this.position);
			}
		}
		this.cluster.print(ctx,person);
	}
}