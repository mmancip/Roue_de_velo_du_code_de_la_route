# Roue_de_velo_du_code_de_la_route
Small game to learn french Code de la Route laws with bicycles or not.

Préparation de la Roue du Code de la Route :
https://semestriel.framapad.org/p/yTPZUXHI3Iaj9ScHutrs#L85
(Merci de ne pas modifier sans l'accord du développeur, please don't change without agreement)

Questions :
https://semestriel.framapad.org/p/Roue_du_code_de_la_route
(Merci de ne pas modifier sans l'accord du développeur, please don't change without agreement)

Install :
install on Windows or Linux OS :
Download last version of node on official
	 https://nodejs.org/en/download

And use administration PowerShell window
* nvm install 18.16.0
* nvm use 18.16.0
In source dir (Roue/src) use :
```
> npm install
```

Error PowerShell Policy with this npm install:
```
Get-ExecutionPolicy -List
Set-ExecutionPolicy -Scope CurrentUser  -ExecutionPolicy RemoteSigned
```

Not for local usr :
```
npm audit fix --force
```

Execution (temporaire) :
```
> cd src
> ..\node_modules\.bin\http-server -s -o --trace-deorecation
```
sous cygwin :
```
../node_modules/.bin/http-server -s -o --trace-deorecation
```

Données ; les données de questions sont dans les fichiers json (très facile à modifier) dans src/data.
Si vous voulez les améliorer, passer les moi (issue sous Github ou mèl) après avoir modifié, sauvé, relancé la page et testé.


Phaser 3 :
Use Phaser 3 HTML5 web game developpement
    https://cdnjs.com/libraries/phaser/3.60.0
Site
	https://phaser.io/games/
Doc
	https://newdocs.phaser.io/docs/3.60.0
Github :
       https://github.com/photonstorm/phaser/releases/
Examples:
	https://github.com/photonstorm/phaser3-examples

Thank to Emanuele Feronato for base source code on Phaser 3
Blog
	https://www.emanueleferonato.com/
His book :
    https://triqui.gumroad.com/l/odKJf
Example of code
https://github.com/RARM/PhaserBook-by-Emanuele-Feronato/blob/master/src/game.js

