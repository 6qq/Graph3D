class DynamicFunction2{
	constructor(f,startInput1,startInput2,endInput1,endInput2,sparsityInput1 = 1,sparsityInput2 = 1,type = "cartesian",color = "green"){
		this.rootFunction = f;
		this.color = color;
		this.type = type;
		this.startInput1 = startInput1;
		this.startInput2 = startInput2;
		this.sparsityInput1 = sparsityInput1;
		this.sparsityInput2 = sparsityInput2;
		this.endInput1 = endInput1;
		this.endInput2 = endInput2;
	}
	
	print(ctx,person){
		ctx.strokeStyle = this.color;
		var handleVector;
		switch(this.type){
			case "cartesian" :
				handleVector = new Function("x,y,z","return new Vector(x,y,z)");
				break;
			case "cylinder" :
				handleVector = new Function("r,o,z","return new CylinderVector(r,o,z).toCartesian()");
				break;
			case "sphere" :
				handleVector = new Function("o,phi,p","return new SphereVector(p,o,phi).toCartesian()");
				break;
			case "Boyer_LindquistVector" :
				handleVector = new Function("o,phi,r","return new Boyer_LindquistVector(r,o,phi).toCartesian()");
				break;
		}
		ctx.strokeStyle = "blue";
		for(let i = this.startInput1;i < this.endInput1;i+= this.sparsityInput1){
			ctx.beginPath();
			for(let j = this.startInput2;j < this.endInput2;j+= this.sparsityInput2){
				var v1 = person.transformPoint(handleVector(i,j,this.rootFunction(i,j)));
				if(v1 != null){
					ctx.lineTo(v1.x*innerWidth/v1.z,v1.y*innerWidth/v1.z);
				}else{
					ctx.stroke();
					ctx.beginPath();
				}
			}
			ctx.stroke();
		}
		ctx.strokeStyle = "purple";
		for(let i = this.startInput2;i < this.endInput2;i+= this.sparsityInput2){
			ctx.beginPath();
			for(let j = this.startInput1;j < this.endInput1;j+= this.sparsityInput1){
				var v1 = person.transformPoint(handleVector(j,i,this.rootFunction(j,i)));
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