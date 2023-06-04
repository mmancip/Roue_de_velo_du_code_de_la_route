// the game itself
let game;

let gameOptions = {

    // slices configuration
    slices: [
        {
            degrees: 45,
            iconFrame: 1,
            iconScale: 0.4,
            text: "Circulations",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 0,
            iconScale: 0.4,
            text: "Nouveautes",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 3,
            iconScale: 0.4,
            text: "Panneaux",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 4,
            iconScale: 0.4,
            text: "Equipements_comportements",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 1,
            iconScale: 0.4,
            text: "Circulations",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 0,
            iconScale: 0.4,
            text: "Nouveautes",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 3,
            iconScale: 0.4,
            text: "Panneaux",
            enabled: true
        },
        {
            degrees: 45,
            iconFrame: 4,
            iconScale: 0.4,
            text: "Equipements_comportements",
            enabled: true
        }
    ],
    
    // wheel rotation duration range, in milliseconds
    rotationTimeRange: {
        min: 3000,
        max: 4500
    },

    // wheel rounds before it stops
    wheelRounds: {
        min: 2,
        max: 11
    },

    // degrees the wheel will rotate in the opposite direction before it stops
    backSpin: {
        min: 1,
        max: 4
    },

    // wheel radius, in pixels
    wheelRadius: 240,

    // color of stroke lines
    strokeColor: 0xffffff,

    // width of stroke lines
    strokeWidth: 5
}

// once the window loads...
window.onload = function() {

    // game configuration object
    let gameConfig = {

        // resolution and scale mode
        scale: {
            parent: "thegame"
        },
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,

	// game background color
	backgroundColor: 0x000000,
	
	// scenes used by the game
	scene: [playGame]
    };
    
    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame
    window.focus()
}

// PlayGame scene
class playGame extends Phaser.Scene{

    // constructor
    constructor(){
        super({ pack: {
            "files": [ 
		{ type: 'json', key: 'Circulations', url: 'data/circulations.json'},
		{ type: 'json', key: 'Nouveautes', url: 'data/nouveautés.json'},
		{ type: 'json', key: 'Panneaux', url: 'data/panneaux.json'},
		{ type: 'json', key: 'Equipements_comportements', url: 'data/équipements_comportements.json'}
	    ]
	}})
    }

    // method to be executed when the scene preloads
    preload(){

	if (this.sys.game.device.os.desktop){
            this.game.scale.resize(1920,1080);
	}
	else{
            this.game.scale.resize(1080,1920);
	    this.game.scale.scaleMode=Phaser.Scale.HEIGHT_CONTROLS_WIDTH
	    //this.game.scale.scaleMode=Phaser.Scale.FIT
	}

	//this.load.crossOrigin = true
	
        // loading pin image
        this.load.image("pin", "pin.png");

	this.load.image("wheel", "Roue.png");

        this.load.image("logo_mdb","./data/mdb.png");
	this.load.image("logo_orsay","./data/Orsay_mdb.png");
	
        // loading icons spritesheet
        this.load.spritesheet("icons", "icons.png", {
            frameWidth: 256,
            frameHeight: 256
        });


	// Prize and Questions 
	this.list_prizes=gameOptions.slices.map(x=>x.text)
        // for(let i = 0; i < this.list_prizes.length; i++){
	//     if (! eval("this."+this.list_prizes[i]+"JSON") ) {
	//     }}
	
	//this.load.json('Categories', 'data/Categories.json');

	this.PanneauxJSON=this.cache.json.get('Panneaux');
	
	for(let i = 0; i < this.PanneauxJSON["questions"].length; i++){
	    this.load.image(this.PanneauxJSON["questions"][i][0],"data/panneaux/"+this.PanneauxJSON["questions"][i][1])
	}
	// console.log(this.textures.list)

	if (this.sys.game.device.os.desktop){
            console.log("desktop")
	    this.wheelwidth=800
	    this.wheelheight=800
	}
	else{
            console.log("mobile")
	    this.wheelwidth=360
	    this.wheelheight=740
	}
	
    }

    // method to be executed once the scene has been created
    create(){

	var ScreenWidth=this.game.scale.width;
	var ScreenHeight=this.game.scale.height;

	if (this.sys.game.device.os.desktop){
	    var Wheel_center=[40,100]
	}
	else{
	    var Wheel_center=[parseInt(ScreenWidth/3.5),ScreenHeight/10]
	}

        // this.TitleContainer = this.add.container(this.ScreenWidth/2,40);
	
	var Title = this.add.text(10,10, "Roue de Vélo du Code de la Route !", {
            font: "bold 48px Gabriola",
            align: "center",
            color: "white"
        });
	Title.setOrigin(0.4);
	var logo_mdb=this.add.image(60,60,"logo_mdb")
	var logo_orsay=this.add.image(60,60,"logo_orsay")
	
	
	// this.TitleContainer.add(logo_mdb);
	// this.TitleContainer.add(Title);
	// this.TitleContainer.add(logo_orsay);
	

        // starting degrees
        let startDegrees = -90;

        // making a graphic object without adding it to the game
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        // this array will contain the allowed degrees
        this.allowedDegrees = [];

        // adding a container to group wheel and icons

	if (this.sys.game.device.os.desktop){
            this.wheelContainer = this.add.container(this.wheelwidth/2+Wheel_center[0],this.wheelheight/2+Wheel_center[1]);
	    //console.log(this.wheelContainer.x, this.wheelContainer.y, this.wheelContainer.width, this.wheelContainer.height)
	}
	else{
            this.wheelContainer = this.add.container(this.wheelwidth/2+Wheel_center[0],this.wheelheight/2+Wheel_center[1]);
	}

	// For panneaux images
	this.PtrImage=""
	
        // array which will contain all icons
        let iconArray = [];

        // looping through each slice
        for(let i = 0; i < gameOptions.slices.length; i++){

            // if the slice is enabled, that is if the prize can be won...
            if(gameOptions.slices[i].enabled){

                // ... we insert all slice degrees into allowedDegrees array
                for(let j = 0; j < gameOptions.slices[i].degrees; j ++){
                    this.allowedDegrees.push(270 - startDegrees - j);
                }
            }


            // setting line style
            graphics.lineStyle(gameOptions.strokeWidth, gameOptions.strokeColor, 1);

            // drawing the biggest slice
            graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees), false);

            // stroking the slice
            graphics.strokePath();

            // add the icon, if any
            if(gameOptions.slices[i].iconFrame != undefined){

                // icon image
                let icon = this.add.image(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), "icons", gameOptions.slices[i].iconFrame);

                // scaling the icon according to game preferences
                icon.scaleX = gameOptions.slices[i].iconScale;
                icon.scaleY = gameOptions.slices[i].iconScale;

                // rotating the icon
                icon.angle = startDegrees + gameOptions.slices[i].degrees / 2 + 90;

                // add icon to iconArray
                iconArray.push(icon);
            }

            // add slice text, if any
            if(gameOptions.slices[i].sliceText != undefined){

                // the text
                let text = this.add.text(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.slices[i].sliceText, gameOptions.slices[i].sliceTextStyle);

                // set text origin to its center
                text.setOrigin(0.5, 0);

                // set text angle
                text.angle = startDegrees + gameOptions.slices[i].degrees / 2 + 90;

                // stroke text, if required
                if(gameOptions.slices[i].sliceTextStroke && gameOptions.slices[i].sliceTextStrokeColor){
                    text.setStroke(gameOptions.slices[i].sliceTextStrokeColor, gameOptions.slices[i].sliceTextStroke);
                }

                // add text to iconArray
                iconArray.push(text);
            }

            // updating degrees
            startDegrees += gameOptions.slices[i].degrees;

        }

        // adding all iconArray items to the container
        this.wheelContainer.add(iconArray);

        // creating a sprite with wheel image as if it was a preloaded image
        let wheel = this.add.sprite(0, 0, "wheel");
	
	//this.CategoriesJSON = this.load.cacheManager.json.entries.entries["Categories"]
        for(let i = 0; i < this.list_prizes.length; i++){
	    if (! eval("this."+this.list_prizes[i]+"JSON") ) {
		eval("this."+this.list_prizes[i]+"JSON=this.load.cacheManager.json.entries.entries[\""+this.list_prizes[i]+"\"]")
	    }
	}

        // adding the text field
        //this.wheel = this.add.sprite(this.wheelwidth/2,this.wheelheight/2, "wheel");
	
        // adding the wheel to the container
        this.wheelContainer.add(wheel);

        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(this.wheelwidth/2+Wheel_center[0],this.wheelheight/2+Wheel_center[1], "pin");


	if (this.sys.game.device.os.desktop){
	    Title.setOrigin(0.4);
	    //Title.setX(this.wheelwidth/2);
	    //Title.setY(40);
	    this.children.getAll()[0].setX(this.wheelwidth/2)
	    this.children.getAll()[0].setY(40)
	    //logo_mdb.setX(60);
	    //logo_mdb.setY(60);
	    this.children.getAll()[1].setX(60)
	    this.children.getAll()[1].setY(60)
	    //logo_orsay.setX(this.wheelwidth+60);
	    //logo_orsay.setX(60);
	    this.children.getAll()[2].setX(this.wheelwidth+60)
	    this.children.getAll()[2].setY(60)
	}
	else{
	    Title.setOrigin(0.4);
	    this.children.getAll()[0].setX(this.wheelwidth/2+200)
	    this.children.getAll()[0].setY(40)
	    //logo_mdb.setX(60);
	    //logo_mdb.setY(60);
	    this.children.getAll()[1].setX(60)
	    this.children.getAll()[1].setY(60)
	    //logo_orsay.setX(this.wheelwidth+60);
	    //logo_orsay.setX(60);
	    this.children.getAll()[2].setX(this.wheelwidth+500)
	    this.children.getAll()[2].setY(60)
	}
	
	
	this.initprize="Tourne la roue !";
	this.prizeText = this.add.text(10,10, this.initprize, {
            font: "bold 32px Arial",
            align: "justify",
            color: "white",
	    fixedHeight:200,
	    fixedWidth:800
        });
	//align: "center",
            
	this.initquestion="Question :";
	this.questionText = this.add.text(10,10, this.initquestion, {
            font: "bold 32px Arial",
            align: "justify",
            color: "white",
	    fixedHeight:400,
            fixedWidth:800});

	//console.log(this.wheelwidth,Wheel_center,this.wheelheight+Wheel_center[1]);
	if (this.sys.game.device.os.desktop){
            // center the text
            this.prizeText.setOrigin(0.5);
	    this.prizeText.setX(this.wheelwidth/2+Wheel_center[0]);
	    this.prizeText.setY(this.wheelheight+Wheel_center[1]+40);
            this.questionText.setOrigin(0);
	    this.questionText.setX(parseInt(1.2*this.wheelwidth));
	    this.questionText.setY(parseInt(0.5*this.wheelheight));
	}
	else{
            // center the text
            //this.prizeText.setOrigin(5);
	    this.prizeText.setX(this.wheelwidth/4)
	    this.prizeText.setY(parseInt(1.4*this.wheelheight))
            //this.questionText.setOrigin(5);
	    this.questionText.setX(parseInt(this.wheelwidth/4));
	    this.questionText.setY(parseInt(1.8*this.wheelheight));
	}
	//this.add.rectangle(this.prizeText.x, this.prizeText.y, this.prizeText.width, this.prizeText.height, 0xffff00);
	//this.add.rectangle(this.questionText.x, this.questionText.y, this.questionText.width, this.questionText.height,0xffdd00);
	//console.log(this.prizeText.x, this.prizeText.y, this.prizeText.width, this.prizeText.height);
	//console.log(this.questionText.x, this.questionText.y, this.questionText.width, this.questionText.height)
	this.len_questionText=Math.round(this.questionText.width/parseInt(this.questionText.style.fontSize)*1.2);

        // the game has just started = we can spin the wheel
        this.canSpin = true;
	
        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
        // waiting for your input, then calling "spinWheel" function
        //this.input.on("keyup-SPACE", this.spinWheel, this);

    }

    build_justif(answer) {
	var justifQ = answer.split(" ")
	var completeJustif = ""
	let ilen=0
	let prev=0
	let s=0
	for (s in justifQ) {
	    ilen=ilen+justifQ[s].length
	    if (ilen > this.len_questionText) {
		justifQ.slice(prev,s).map(x=>completeJustif=completeJustif+x+" ");
		completeJustif=completeJustif+"\n"
		prev=s
		ilen=0
	    }
	}
	justifQ.slice(prev,s+1).map(x=>completeJustif=completeJustif+x+" ")

	return completeJustif;
    }
    
    callQuestion(list_prizes,dict_prize,questions_prize,numQ) {
	var titre_prize=dict_prize["titre"]
	
	// displaying prize text
	//this.prizeText.setText(gameOptions.slices[prize].text+" "+numQ);
	
	if ( list_prizes == "Panneaux" ) {
	    let thisImage=this.PanneauxJSON["questions"][numQ][0];
	    if (! thisImage in this.textures.list) {
		this.canSpin = true;
		console.log("Unknonw "+numQ+" image : "+thisImage)
		return
	    }
	    this.prizeText.setText("Que signifie ce panneau ?");
	    
	    if (this.sys.game.device.os.desktop){
		this.PtrImage=this.add.image(this.wheelwidth+100,400,thisImage)
	    }
	    else{
		this.PtrImage=this.add.image(this.wheelwidth,this.wheelheight,thisImage)
	    }
	} else {
	    let completeJustif=this.build_justif(questions_prize[numQ][0]);
	    this.questionText.setText(titre_prize+"\n\n"+completeJustif);
	}
	
        this.input.on("pointerdown", event =>
	    {
		let completeJustif=""
		if ( list_prizes == "Panneaux" ) {
		    completeJustif=this.build_justif(this.PanneauxJSON["questions"][numQ][2]);
		} else {
		    completeJustif=this.build_justif(questions_prize[numQ][1]);
		}
		this.prizeText.setText(completeJustif);
		this.input.on("pointerdown", this.spinWheel, this);
	    });
	//	this.input.keyboard.on('keyup-SPACE', event =>
	
    }
    
    // function to spin the wheel
    spinWheel(){

        // can we spin the wheel?
        if(this.canSpin){

            // resetting text field
            this.prizeText.setText("");
	    this.questionText.setText("");
	    try {
		this.PtrImage.destroy();
	    } catch(e) {}
            //this.input.keyboard.off('keyup-SPACE');
	    this.input.off('pointerdown');
	    
            // the wheel will spin round for some times. This is just coreography
            let rounds = Phaser.Math.Between(gameOptions.wheelRounds.min, gameOptions.wheelRounds.max);

            // then will rotate by a random amount of degrees picked among the allowed degrees. This is the actual spin
            let degrees = Phaser.Utils.Array.GetRandom(this.allowedDegrees);

            // then will rotate back by a random amount of degrees
            let backDegrees = Phaser.Math.Between(gameOptions.backSpin.min, gameOptions.backSpin.max);

            // before the wheel ends spinning, we already know the prize
            let prizeDegree = 0;

            // looping through slices
            for(let i = gameOptions.slices.length - 1; i >= 0; i--){

                // adding current slice angle to prizeDegree
                prizeDegree += gameOptions.slices[i].degrees;

                // if it's greater than the random angle...
                if(prizeDegree > degrees){

                    // we found the prize
                    var prize = i;
                    break;
                }
            }

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel container to tween targets
                targets: [this.wheelContainer],

                // angle destination
                angle: 360 * rounds + degrees + backDegrees,

                // tween duration
                duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max),

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function(tween){

                    // another tween to rotate a bit in the opposite direction
                    this.tweens.add({
                        targets: [this.wheelContainer],
                        angle: this.wheelContainer.angle - backDegrees,
                        duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max) / 2,
                        ease: "Cubic.easeIn",
                        callbackScope: this,
                        onComplete: function(tween){
			    
			    this.prizeText.setText("Question ?");
			    //gameOptions.slices[prize].text);
			    
			    var dict_prize=""
			    eval("dict_prize=this."+this.list_prizes[prize]+"JSON")
			    var questions_prize=dict_prize["questions"];

			    var len_prize=questions_prize.length
			    var numQ=Math.round(Math.random()*(len_prize-1))
			    
			    this.callQuestion(this.list_prizes[prize],dict_prize,questions_prize,numQ);
			    
			    // player can spin again
                            this.canSpin = true;
			    //this.input.on("keyup-SPACE", this.spinWheel, this);
                            this.prizeText.setText(this.initquestion);
                        }
                    })
                }
            });
        }
    }
}
