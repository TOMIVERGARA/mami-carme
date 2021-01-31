//Imports Fs
const fs = require('fs');
//Imports Canvas Required utilities
const { createCanvas, loadImage, registerFont } = require('canvas');
//Imports Tools
const { writeText } = require('./tools/write-text.canvas');
//Imports today birthdays
const { getTodayBirthdayArray } = require('./get-birthday')
//Imports Intl Dates
const Intl = require('intl');

const getRandomStyles = () => {
    //Generates array with available backgrounds
    const backgrounds = fs.readdirSync(__dirname + '/../resources/img/stories').filter(file => file.endsWith('.png'));
    //Picks a random image from the array
    const randomBackgroundName = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    //Generates array with available fonts
    const fonts = fs.readdirSync(__dirname + '/../resources/fonts').filter(file => file.endsWith('.ttf'));
    //Picks a random font from the array
    const randomFontName = fonts[Math.floor(Math.random() * fonts.length)];

    return [randomBackgroundName, randomFontName]
}

const generateList = (ctx, canvas, startPos, birthdayList) => {
    let classes = {};
    birthdayList.map(person => {
        const year = person.class;
        const name = person.name;
        if(year in classes){
            classes[year].push(name);
        }else{
            classes[year] = [];
            classes[year].push(name);
        }
    });

    const spacer = 80

    const classesArray = Object.entries(classes);
    console.log('➥ Generating Story for the next array:')
    console.log(classesArray)
    var blockPositionCounter = startPos
    classesArray.map(year => {
       const block = generateNames(ctx, canvas, blockPositionCounter, year[1], year[0]);

       blockPositionCounter = blockPositionCounter + block + spacer;
    });
}

const generateNames = (ctx, canvas, startPos, names, title) => {
    var positionCounter = startPos;
    let isFirst = true
    names.map(name => {
        if(isFirst){
            writeText(name, 60, '#000000', [0, positionCounter], ctx, canvas, { writeTextWithTitle: title, background: '#fff' });
            isFirst = false;
        }else{
            writeText(name, 60, '#000000', [0, positionCounter], ctx, canvas, { background: '#fff' });
        }
        positionCounter = positionCounter + 120;
    });
    return positionCounter - startPos;
}

module.exports.getDynamicStoryImg = async () => {
    const [randomBackgroundName, randomFontName] = getRandomStyles();
    //Gets todays birthdays
    const people = await getTodayBirthdayArray()

    //Gets Date
    const date = new Date();
    const today = new Intl.DateTimeFormat(process.env.TIMEZONE, {
      day: '2-digit',
      month: '2-digit'
    }).format(date);

    //Registers the font
    registerFont(__dirname + `/../resources/fonts/${randomFontName}`, { family: 'random-font' });

    var canvas = createCanvas(1080, 1920); //Defines Canvas size
    var ctx = canvas.getContext('2d')

    // //Loads the image
    const background = await loadImage(__dirname +`/../resources/img/stories/${randomBackgroundName}`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height); //Sets the image as background

    // const header = 'Cumple hoy'
    const emoji = await loadImage(__dirname +`/../resources/img/emoji/sparkles_2728.png`);
    writeText('Cumple hoy', 70, '#fff', [0, 250], ctx, canvas, { background: '#000000', ornaments: emoji });
    writeText(today, 50, '#fff', [0, 360], ctx, canvas, { calculatedColor: true });

    generateList(ctx, canvas, 550, people);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(__dirname + `/../resources/img/stories/today/${new Date().getDay()}.png`, buffer);
}

