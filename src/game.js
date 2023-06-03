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
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1920,
            height: 1080
        },

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

	this.wheelwidth=800
	this.wheelheight=800

	
    }

    // method to be executed once the scene has been created
    create(){

	this.add.image(60,60,"logo_mdb")
	this.add.image(this.wheelwidth+60,60,"logo_orsay")

	var Title = this.add.text(this.wheelwidth/2,40, "Roue de Vélo du Code de la Route !", {
            font: "bold 48px Gabriola",
            align: "center",
            color: "white"
        });
	Title.setOrigin(0.4);
	var Wheel_center=[40,100]

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
        this.wheelContainer = this.add.container(this.wheelwidth/2+Wheel_center[0],this.wheelheight/2+Wheel_center[1]);

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

	this.initprize="Tourne la roue !";
	this.prizeText = this.add.text(this.wheelwidth/2+Wheel_center[0],this.wheelheight+Wheel_center[1]+40, this.initprize, {
            font: "bold 32px Arial",
            align: "center",
            color: "white"
        });

	this.initquestion="Question :";
	this.questionText = this.add.text(this.wheelwidth+50,150, this.initquestion, {
            font: "bold 32px Arial",
            align: "justify",
            color: "white",
	    fixedHeight:400,
            fixedWidth:800});
	
        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);

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
            this.input.keyboard.off('keyup-SPACE');
	    
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
			    var titre_prize=dict_prize["titre"]
			    var questions_prize=dict_prize["questions"]
			    var len_prize=questions_prize.length
			    var numQ=Math.round(Math.random()*(len_prize-1))
			    var len_questionTest=Math.round(this.questionText.width/parseInt(this.questionText.style.fontSize)*1.2)
				
			    // displaying prize text
			    //this.prizeText.setText(gameOptions.slices[prize].text+" "+numQ);
			    
			    if ( this.list_prizes[prize] == "Panneaux" ) {
				let thisImage=this.PanneauxJSON["questions"][numQ][0];
				if (! thisImage in this.textures.list) {
				    this.canSpin = true;
				    console.log("Unknonw "+numQ+" image : "+thisImage)
				    return
				}
				this.prizeText.setText("Que signifie ce panneau ?");
				this.PtrImage=this.add.image(this.wheelwidth+100,400,thisImage)
			    } else {
				var justifQ = questions_prize[numQ][0].split(" ")
				var completeJustif = ""
				let ilen=0
				let prev=0
				let s=0
				for (s in justifQ) {
				    ilen=ilen+justifQ[s].length
				    if (ilen > len_questionTest) {
					justifQ.slice(prev,s).map(x=>completeJustif=completeJustif+x+" ");
					completeJustif=completeJustif+"\n"
					prev=s
					ilen=0
				    }
				    }
				justifQ.slice(prev,s+1).map(x=>completeJustif=completeJustif+x+" ")
				
				this.questionText.setText(titre_prize+"\n\n"+completeJustif);
			    }

			    this.input.keyboard.on('keyup-SPACE', event =>
				{
				    if ( this.list_prizes[prize] == "Panneaux" ) {
					this.prizeText.setText(this.PanneauxJSON["questions"][numQ][2]);
				    } else {
					this.prizeText.setText(questions_prize[numQ][1]);
				    }
				});
			    
			    // player can spin again
                            this.canSpin = true;
                            //this.prizeText.setText(this.initquestion);
                        }
                    })
                }
            });
        }
    }
}
