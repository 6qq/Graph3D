var Bush = function(position,count,color){
	this.position = position;
	this.color = color;
	this.sticks = [];
	for(let i = 0;i < count;i++){
		this.sticks[i] = new Vector(Math.random()*0.5 - 0.25,Math.random()*0.5 - 0.25,Math.random()*0.2 +  0.2);
	}
	
	this.print = function(ctx,person){
		ctx.strokeStyle = color;
		var origin = person.transformPoint(this.position);
		if(origin != null){
			for(let i = 0;i <this.sticks.length;i++){
				this.sticks[i] = Vector.sum(this.sticks[i],this.sticks[i].unit().get(0.01));
				var stick = person.transformPoint(Vector.sum(this.position,this.sticks[i]) || 0);
				if(stick != null){
					ctx.moveTo(origin.x*innerWidth/origin.z,origin.y*innerWidth/origin.z);
					ctx.lineTo(stick.x*innerWidth/stick.z,stick.y*innerWidth/stick.z);
				}		
			}
		}
	}
}

var BushPath = function(ground,startInput1,startInput2,width,height,count,color){
	this.bushes = new Array(count);
	for(let i = 0;i < count;i++){
		var x = startInput1 + Math.random()*width;
		var y = startInput2 + Math.random()*height;
		if(ground instanceof StaticFunction2){
			var z = ground.points[Math.floor(x)][Math.floor(y)];
		}else{
			var z = ground.rootFunction(x,y);
		}
		
		this.bushes[i] = new Bush(new Vector(x,y,z),5,color);
	}
	
	this.print = function(ctx,person){
		for(let i = 0;i < this.bushes.length;i++){
			this.bushes[i].print(ctx,person);
		}
		ctx.stroke();
	}
}