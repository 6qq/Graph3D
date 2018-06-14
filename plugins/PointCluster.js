class PointCluster{
	constructor(position,type,color){
		this.points = [];
		this.position = position || new Vector(0,0,0);
		this.type = type || "dotted";
		this.color = color || "green";
	}
	
	addPoint(v1){
		this.points.push((v1 instanceof CylinderVector || v1 instanceof SphereVector)? v1.toCartesian() : v1);
	}
	
	translate(v1){
		this.points.forEach(function(p){
			p.x += v1.x;
			p.y += v1.y;
			p.z += v1.z;
		});
		this.position = Vector.sum(this.position,v1);
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
	}
	
	print(ctx,person){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		if(this.type == "dotted"){
			for(let i = 0;i < this.points.length;i++){
				var v1 = person.transformPoint(this.points[i]);
				if(v1 != null){
					ctx.moveTo(v1.x*innerWidth/v1.z + 1,v1.y*innerWidth/v1.z);
					ctx.arc(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z,50/v1.z,0,2*Math.PI);
				}else{
					ctx.fill();
					ctx.beginPath();
				}
			}
			ctx.fill();
		}else if(this.type == "dashed"){
			for(let i = 0;i < this.points.length;i++){
				var v1 = person.transformPoint(this.points[i]);
				if(v1 != null){
					ctx.lineTo(v1.x*innerWidth/v1.z + 1,v1.y*innerWidth/v1.z);
				}else{
					ctx.stroke();
					ctx.beginPath();
				}
			}
			ctx.stroke();
		}
	}
}


