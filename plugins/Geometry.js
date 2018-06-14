class Box{
	constructor(position,volume,color){
		this.position = position;
		this.volume = volume;
		this.color = color || "green";
		this.points = [];
		for(let i = 0;i < 6;i++){
			this.points[i] = new Array(4); 
		}
		this.points[0][0] = Vector.sum(position,new Vector(0,0,0));
		this.points[0][1] = Vector.sum(position,new Vector(volume.x,0,0));
		this.points[0][2] = Vector.sum(position,new Vector(volume.x,volume.y,0));
		this.points[0][3] = Vector.sum(position,new Vector(0,volume.y,0));
		this.points[0][4] = Vector.sum(position,new Vector(0,0,0));
	
		this.points[1][0] = Vector.sum(position,new Vector(0,0,volume.z));
		this.points[1][1] = Vector.sum(position,new Vector(volume.x,0,volume.z));
		this.points[1][2] = Vector.sum(position,new Vector(volume.x,volume.y,volume.z));
		this.points[1][3] = Vector.sum(position,new Vector(0,volume.y,volume.z));
		this.points[1][4] = this.points[1][0]
	
		this.points[2][0] = this.points[0][0]
		this.points[2][1] = this.points[0][3]
		this.points[2][2] = Vector.sum(position,new Vector(0,volume.y,volume.z));
		this.points[2][3] = this.points[1][0]
		this.points[2][4] = this.points[0][4]
	
		this.points[3][0] = this.points[0][1]
		this.points[3][1] = this.points[0][2]
		this.points[3][2] = Vector.sum(position,new Vector(volume.x,volume.y,volume.z));
		this.points[3][3] = Vector.sum(position,new Vector(volume.x,0,volume.z));
		this.points[3][4] = Vector.sum(position,new Vector(volume.x,0,0));
	
		this.points[4][0] = this.points[0][3]
		this.points[4][1] = this.points[0][2]
		this.points[4][2] = Vector.sum(position,new Vector(volume.x,volume.y,volume.z));
		this.points[4][3] = Vector.sum(position,new Vector(0,volume.y,volume.z));
		this.points[4][4] = this.points[0][3]
		
		this.points[5][0] = this.points[0][3]
		this.points[5][1] = this.points[0][2]
		this.points[5][2] = Vector.sum(position,new Vector(volume.x,volume.y,volume.z));
		this.points[5][3] = Vector.sum(position,new Vector(0,volume.y,volume.z));
		this.points[5][4] = this.points[0][3]
	}
	

	print(ctx,person){
		ctx.strokeStyle = this.color;
		this.points.forEach(function(p,index){
			ctx.beginPath();
			p.forEach(function(p2){
				var v1 = person.transformPoint(p2);
				if(v1 != null){
					ctx.lineTo(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z);
				}else{
					ctx.stroke();
					ctx.beginPath();
				}
			});
			ctx.closePath();
			ctx.stroke();
		});
	}
}