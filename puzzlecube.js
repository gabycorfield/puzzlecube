//puzzlecube.js
//autor:María Gabriela Corfield - 2020
//version:1.0 
//************************************************************************************************************************************
var puzzles=[];
var puzzleActual={};
var tamano={ancho:0,alto:0};//tamaño del canvas 
var tamanoFicha; 
var tamanoClip;
var imagenes =[];//las 6 imagenes en uso para el puzzle
var cutImg=[];//array de 6 arrays de objetos con los datos de las imagenes trozadas
let puzzle;
let coordClick={x:0,y:0};
let acciones=0;//[rotar, voltearDerecha, voltear atras,intercambiar,]
let parIntercambio=[];
//************************************************************************************************************************************
// partiendo de un cubo con cara superior 0, seguido por 1,2,3 y a los lados del 0, el 4 y el 5
//            -------------------
	//        |  4  |  0  |  5  |
    //         -----------------
    //				|  1  |
    //              -------
    //              |  2  |
    //              -------
    //              |  3  |
    //              -------
function Cara(img,fil,col,rotacion){
		this.nroimg = img;
		this.fila = fil;
		this.columna= col;
		this.rotacion = rotacion;
		//console.log("creando cara");
	
	
	this.rotar90=function(){
		if(this.rotacion==270){
			this.rotacion = 0;
		}else{
			this.rotacion+= 90;
		} 
	}
};

function Cubo (f, c, caras){
	this.fila = f;
	this.columna = c;
	this.caras = caras;
	//console.log("creando cubo "+this.caras);

	this.voltearDerecha=function(){
		var aux = this.caras[0];
		this.caras[0] = this.caras[4];
		this.caras[4]= this.caras[2];
		this.caras[2] = this.caras[5];
		this.caras[5]= aux;
		this.caras[1].rotar90();
		this.caras[3].rotar90();
	}
	this.voltearAtras= function(){
		var aux = this.caras[0];
		this.caras[0] = this.caras[1];
		this.caras[1]= this.caras[2];
		this.caras[2] = this.caras[3];
		this.caras[3]= aux;
		this.caras[4].rotar90();
		this.caras[5].rotar90();
	}
		
	this.rotarDerecha= function(){
		var aux = this.caras[1];
		this.caras[1] = this.caras[5];
		this.caras[5]= this.caras[3];
		this.caras[3] = this.caras[4];
		this.caras[4]= aux;
		this.caras[0].rotar90();
		this.caras[2].rotar90();
	}
}

function Puzzle(filas, columnas){
	this.fichas =[];
	this.filas = filas;
	this.columnas = columnas;

	this.crear=function(){
		//console.log("creando puzzle");
		var i, j, cubo;
		for(i = 0; i < this.filas;i++){
			for(j = 0; j < this.columnas; j++){
				//console.log("entre");
				cubo = armarCubo(i,j);
				this.fichas.push(cubo);
			}
		}//console.log(this.fichas);
		this.mezclar();
	}

	this.intercambiar=function(cubo1, cubo2){//recibe como parametros los indices de los cubos a intercambiar(intercambia las caras de los cubos)
		var aux=this.fichas[cubo1].caras;
		this.fichas[cubo1].caras=this.fichas[cubo2].caras;
		this.fichas[cubo2].caras= aux;
	}

	this.obtenerIndCubo=function(x,y){//a partir de un par de coordenadas devuelve el indice del cubo seleccionado
		var i = 0;var c =this.fichas[i];var ind = -1; 
		while(i < this.fichas.length ) {
			//console.log(i);
			if(x > c.fila*tamanoFicha && x < c.fila*tamanoFicha+tamanoFicha && y > c.columna*tamanoFicha && y < c.columna*tamanoFicha+tamanoFicha){
				ind = i;
			//	console.log ( " ficha x: "+c.fila*tamanoFicha+" - "+(c.fila*tamanoFicha+tamanoFicha));
			//console.log ( " ficha y: "+c.columna*tamanoFicha+" - "+(c.columna*tamanoFicha+tamanoFicha));
			}
			
			i++;
			c =this.fichas[i];
		}
		return ind;
	}
	this.mezclar = function(){
		var cantIntercambios = Math.floor(Math.random()*this.fichas.length);
		for(var i = 0; i < cantIntercambios; i++){console.log(cantIntercambios);
			this.intercambiar(Math.floor(Math.random()*this.fichas.length),Math.floor(Math.random()*this.fichas.length));
			this.fichas[Math.floor(Math.random()*this.fichas.length)].rotarDerecha();
			this.fichas[Math.floor(Math.random()*this.fichas.length)].voltearDerecha();
			this.fichas[Math.floor(Math.random()*this.fichas.length)].voltearAtras();
		}
	}
	this.ganaste = function(){
		var puzz=this.fichas[0].caras[0].nroimg; var i = 0;
		while(i < this.fichas.length && this.fichas[i].caras[0].nroimg == puzz && this.fichas[i].caras[0].fila == this.fichas[i].fila && this.fichas[i].caras[0].columna == this.fichas[i].columna && this.fichas[i].caras[0].rotacion == 0){
			i++;
		}
		if(i == this.fichas.length){
			console.log("ganaste");return true;
		}else{
			console.log("todavía no"); return false;		
		}
	}
}
//********************************************************************************************************************************
function trozarImagenes(){
	var f,c, pieza, i;//console.log("trozarImagenes");
		for(i = 0; i < 6; i++){
			cutImg[i] = [];
			for(f=0; f < puzzleActual.filas;f++){
				for (c = 0; c<puzzleActual.columnas; c++) {
					pieza = {fil:f, col:c};
					cutImg[i].push(pieza);
				}
			}
		}	
}
function rotarAlAzar(){//devuelve una rotacion de pieza al azar, se utiliza para inicializar las caras
	//console.log("rotarAlAzar");
	switch(Math.floor(Math.random()*4)){
		case 1: return 90;break;
		case 2: return 180;break
		case 3: return 270; break;
		default: return 0; break;
	}
}


function selecTrozoAlAzar(ind){//selecciona un trozo de una imagen en particular al azar, la devuelve y la elimina de las restantes 
	
	//console.log(cutImg[ind]);
	var i=Math.floor(Math.random()*cutImg[ind].length);
	var trozo = cutImg[ind][i];//console.log(ind+" "+i+"  "+trozo);
	cutImg[ind].splice(i,1);
	//console.log(cutImg[ind]);
	return trozo;
}

function armarCubo(f,c){//funcion que devuelve un cubo armado
	var i,cara, cubo, aux, caras;
	caras = [];
	for(i = 0; i < 6; i++){
		aux=selecTrozoAlAzar(i);//console.log(aux[0].fil);
		cara = new Cara(i,aux.fil,aux.col,rotarAlAzar());//creo una cara al azar
		caras.push(cara);
	}
	cubo = new Cubo(f,c,caras);
	//console.log(cubo);
	return cubo;
}

//carga las 6 imagenes a usar según el puzzle seleccionado
function cargarImg(){
	var imgCargadas = 0;
	for (var i = 0; i < 6; i++){
		imagenes[i] = new Image();
		imagenes[i].src = 'puzzles/'+puzzles[puzzleActual.ind].nombre+'/img'+i+'.jpg'; 
	}
	//console.log("cargarImg "+imagenes[3].src);
	imagenes[0].onload=function(){	comienzo(++imgCargadas);console.log("img0 "+imgCargadas);}
	imagenes[1].onload=function(){	comienzo(++imgCargadas);console.log("img1 "+imgCargadas);}
	imagenes[2].onload=function(){	comienzo(++imgCargadas);console.log("img2 "+imgCargadas);}
	imagenes[3].onload=function(){	comienzo(++imgCargadas);console.log("img3 "+imgCargadas);}
	imagenes[4].onload=function(){	comienzo(++imgCargadas);console.log("img4 "+imgCargadas);}
	imagenes[5].onload=function(){	comienzo(++imgCargadas);console.log("img5 "+imgCargadas);}
	
		
}
function comienzo(cantImg){//console.log("comienzo " + cantImg);
	if(cantImg==6){
		establecerTamano(imagenes[puzzleActual.ind].naturalWidth, imagenes[puzzleActual.ind].naturalHeight);
		startGame();
	}
}
//***************************************************************************************************************************************************
//creación de canvas
var areaJuego = {
    canvas : document.createElement("canvas"),
    start : function(ancho,alto) {
    	this.canvas.width = ancho;
    	this.canvas.height = alto;
        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = "grey";
        $("#tablero").append(this.canvas);   
        $('canvas').click(function(e){
		    coordClick.x = e.pageX - this.offsetLeft;
   			coordClick.y = e.pageY - this.offsetTop;
		    //console.log("coordenadas "+coordClick.x+" "+coordClick.y);
		    });
        
   }
}
//calcula tamaño de canvas  e imagenes a usar y actualiza vble global tamano
function establecerTamano(anchoImg, altoImg){
    var anchoT = $("#tablero").width(); 
    var altoT = $("#tablero").height();
    var maxAncho, maxAlto;
    if ( anchoT > altoT){
    	maxAncho = anchoT;
    	maxAlto = altoImg * maxAncho / anchoImg;
    	while (maxAlto>= altoT){
    		maxAncho-=5;
    		maxAlto = altoImg * maxAncho / anchoImg;
    	}
    }else{
    	maxAlto = altoT;
    	maxAncho = anchoImg * maxAlto / altoImg;
    	while (maxAlto>= altoT){
    		maxAlto-=5;
    		maxAncho = anchoImg * maxAlto / altoImg;
    	}
    }
    tamano = {ancho:Math.floor(maxAncho), alto:Math.floor(maxAlto)}
    for(var i= 0 ;i <6; i++){
    	imagenes[i].width=tamano.ancho;
    	imagenes[i].height=tamano.alto;
    }
    tamanoFicha = Math.floor(tamano.ancho/puzzleActual.filas);//console.log("ficha "+tamanoFicha);
    tamanoClip= Math.floor(anchoImg/puzzleActual.filas);//console.log("clip "+tamanoClip);
    tamano.ancho = tamanoFicha * puzzleActual.filas;
    tamano.alto = tamanoFicha * puzzleActual.columnas;
   
};

var ficha = {
	mostrar: function(img,ximg,yimg,tamimg,xficha,yficha,tamficha,angulo){
	//muestra la ficha en pantalla
			
			var ctx = areaJuego.context;
			var ubicX, ubicY;
			
			ctx.save();
			ctx.rotate(angulo* Math.PI / 180);

			switch(angulo){
				case 90:ubicX=yficha;ubicY=-xficha-tamficha;break;
				case 180:ubicX=-xficha-tamficha;ubicY=-yficha-tamficha;break;
				case 270:ubicX=-yficha-tamficha;ubicY=xficha;break;
				default: ubicX = xficha; ubicY=yficha;break;
			}	
					
			ctx.drawImage(imagenes[img],ximg,yimg,tamimg,tamimg,ubicX ,ubicY , tamficha, tamficha);
			ctx.strokeRect(ubicX,ubicY,tamficha,tamficha);
			ctx.restore();	
	}
}



function startGame() {
			puzzle = new Puzzle(puzzleActual.filas,puzzleActual.columnas);
			areaJuego.start(tamano.ancho, tamano.alto);
			parIntercambio=[];	
			trozarImagenes();		
			puzzle.crear();
			actualizarTablero();
		}	
function actualizarTablero(){	
		var x,y,caraVisible=new Cara();
		var i=0;
	
		for ( x = 0; x < puzzleActual.filas; x=x+1){
			for (y = 0; y < puzzleActual.columnas; y++){
				caraVisible = puzzle.fichas[i].caras[0];//console.log("nN,n "+caraVisible.nroimg);
				ficha.mostrar(caraVisible.nroimg,caraVisible.fila*tamanoClip,caraVisible.columna*tamanoClip,tamanoClip,x*tamanoFicha,y*tamanoFicha,tamanoFicha,caraVisible.rotacion);
				i++;
			}
		}
		if(puzzle.ganaste()){$("#cartelGanador").fadeIn("slow")};
		//console.log("canvas "+$("canvas").length);
	};


$(document).ready(function(){	
	
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//cargo los puzzles disponibles para seleccionar
	$.getJSON( "puzzles.json", function( data ) {
  	 	puzzles=data; 
	}).done(function(){
		if(puzzles.length==0){
			alert("Ha ocurrido un error. No hay puzzles");
		}else{
			puzzleActual={ind:0,nombre:puzzles[0].nombre, filas:puzzles[0].opciones[0].fil, columnas:puzzles[0].opciones[0].col};
			cargarOpciones();
		}
		console.log("apertura exitosa de JSON");
	}).fail(function(){
		alert("Ha ocurrido un error al cargar los puzzles");
		console.log("hay un error al cargar los puzzles")
	});

	

	//al seleccionar una opcion, guardo el nombre en puzzle Actual y muestro los botones con las opciones de cant de piezas
	$("#opciones select ").change(function(){
		var ind = $(this).val();
		puzzleActual.ind = ind;
		puzzleActual.filas = puzzles[ind].opciones[0].fil;
		puzzleActual.columnas = puzzles[ind].opciones[0].col;		
		
		$('.opcion').each(function(i){
			$(this).text(puzzles[ind].opciones[i].fil*puzzles[ind].opciones[i].col+" piezas").removeClass('opcionSel')});
		$('.opcion:eq(0)').addClass('opcionSel');
		$(".opcion,#btnStart").fadeIn('slow');
	});

	$(".opcion").click(function(){
		puzzleActual.filas=puzzles[$("#opciones select ").val()].opciones[$(this).val()].fil;
		puzzleActual.columnas=puzzles[$("#opciones select").val()].opciones[$(this).val()].col;
		$(".opcion").removeClass('opcionSel');
		$(this).addClass('opcionSel');
		//console.log("nombre "+puzzleActual.ind+" fil "+puzzleActual.filas+" col: "+puzzleActual.columnas);
	});
	$("#btnStart").click(function(){
		$("#config").fadeOut('slow');
		cargarImg();	
		
			
		
	});
	$("nav div").click(function() {
		$("#config").fadeIn("slow");
	})	;
	$(".accion").click(function(){
		//console.log($(this).index());
		for(var i=0; i < $(".accion").length; i++){
			$(".accion").removeClass('opcionSel');
		}
		acciones= $(this).index();
		$(this).addClass('opcionSel');
		if(acciones == 4){puzzle.mezclar(); actualizarTablero()}
		/*switch(acciones){
			case 0:console.log("rotar");break;
			case 1:console.log("volteando derecha");break;
			case 2:console.log("volteando atrás");break;
			case 3:console.log("intercambiar");break;
			default:break;
		}*/
	});
	$("#tablero").dblclick(function(e){e.preventDefault();});
	$('.accion:eq(0)').addClass('opcionSel');
	$('#tablero').on('click','canvas', function(){
		var indice = puzzle.obtenerIndCubo(coordClick.x,coordClick.y);
		//console.log("click "+indice);
		if(indice >= 0){
			switch(acciones){
				case 0:	puzzle.fichas[indice].rotarDerecha();parIntercambio = [];break;
				case 1: puzzle.fichas[indice].voltearDerecha();parIntercambio = [];break;
				case 2:	puzzle.fichas[indice].voltearAtras();parIntercambio = [];break;
				case 3: if(parIntercambio.length < 2){
							parIntercambio.push(indice);}
						if(parIntercambio.length == 2){
							puzzle.intercambiar(parIntercambio[0], parIntercambio[1]);
							parIntercambio = [];}
						break;
				default:break;
			}
			actualizarTablero(); 
		}
	//acá hacer el switch que selecciona lo que hay que hacer segun la accion en true.obtener cual es el cubo seleccionado, actuar
	//y actualizar la pantalla. tambien hay que actualizar los tamaños si se cambia el tamaño de pantalla
	});
	$("#cartelGanador").click(function(){$(this).fadeOut("slow")});
	$(window).resize(function(){//console.log("tablwro "+$("#tablero").width());
		establecerTamano(imagenes[puzzleActual.ind].naturalWidth, imagenes[puzzleActual.ind].naturalHeight);
		var ctx =areaJuego.context;areaJuego.canvas.width=tamano.ancho;areaJuego.canvas.height=tamano.alto;
		ctx.clearRect(0, 0, this.width, this.height);
  		actualizarTablero();
	});
});

function cargarOpciones(){
	var e=$("#opciones select");
	e.append("<option selected disabled>Seleccionar</option>");
	puzzles.forEach(function(v,i,a){
		e.append("<option value="+i+">"+v.nombre+"</option>")
	});
}