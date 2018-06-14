class VectoralFunction{
	constructor(f,t1 = 0,t2 = 0,sparsity = 1,color){
		this.rootFunction = f;
		this.color = color || "green";
		this.points = [];
	
		for(let i = t1;i < t2;i += sparsity){
			this.points.push(new Vector(f(i)[0],f(i)[1] === undefined? 0:f(i)[1],f(i)[2] === undefined? 0:f(i)[2]));
		}	
	}
	
	
	rotate(axis,ang,origin){
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
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		this.points.forEach(function(p){
			var v1 = person.transformPoint(p);
			if(v1 != null){
				ctx.lineTo(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z)
			}
		});
		ctx.stroke();
	}
}
