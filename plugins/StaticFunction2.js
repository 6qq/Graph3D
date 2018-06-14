class StaticFunction2{
	constructor(startInput1,startInput2,endInput1,endInput2,sparsityInput1 = 1,sparsityInput2 = 1,color){
		this.points = [];
		this.startInput1 = startInput1;
		this.endInput1 = endInput1;
		this.startInput2 = startInput2;
		this.endInput2 = endInput2;
		this.sparsityInput1 = sparsityInput1;
		this.sparsityInput2 = sparsityInput2;
		this.color = color || "green";
		for(let i = this.startInput1;i < this.endInput1;i++){
			this.points[i] = [];
			for(let j = this.startInput2;j < this.endInput2;j++){
				this.points[i][j] = 0;
			}
		}
	}
	
	addPoint(v1){
		this.points[v1.x][v1.y] = v1.z;
	}
	
	addFunction(f,startInput1,startInput2,endInput1,endInput2,type){
		switch(type || "cartesian"){
			case "cartesian" :
			for(let i = startInput1;i < endInput1;i++){
				for(let j = startInput2;j < endInput2;j++){
					this.points[i][j] = f(i,j);
				}
			}break;
			case "cylinder" :
			for(let i = startInput1;i < endInput1;i+=0.1){
				for(let j = startInput2;j < endInput2;j+=0.01){
					var v1 = new CylinderVector(i,j,f(i,j)).toCartesian();
					var x = Math.round(v1.x);
					var y = Math.round(v1.y);
					var z = v1.z;
					this.points[x][y] = z;
				}
			}break;
			case "sphere" :
			for(let i = startInput1;i < endInput1;i+=0.01){
				for(let j = startInput2;j < endInput2;j+=0.01){
					var v1 = new SphereVector(f(j,i),j,i).toCartesian();
					var x = Math.round(v1.x);
					var y = Math.round(v1.y);
					var z = v1.z;
					this.points[x][y] = z;
				}
			}break;
		}
		
	}
	
	print(ctx,person){
		ctx.strokeStyle = this.color;
		for(let i = this.startInput1;i < this.endInput1;i+=this.sparsityInput1){
			ctx.beginPath();
			for(let j = this.startInput2;j < this.endInput2;j+=this.sparsityInput2){
				var v1 = person.transformPoint(new Vector(i,j,this.points[i][j] || 0));
				if(v1 != null){
					ctx.lineTo(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z);
					
				}else{
					ctx.stroke();
					ctx.beginPath();
				}
			}
			
			ctx.stroke();
		}
		for(let i = this.startInput2;i < this.endInput2;i+=this.sparsityInput2){
			ctx.beginPath();
			for(let j = this.startInput1;j < this.endInput1;j+=this.sparsityInput1){
				var v1 = person.transformPoint(new Vector(j,i,this.points[j][i] || 0));
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