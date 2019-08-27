const screenshot = require('screenshot-desktop');
const resemble = require('resemblejs');

switch (process.argv[2]) {
    case 'find-display': 
        testDisplays();
        break;
    case 'test':
        dryRun();
        break;
    case 'go': 
        run();
        break;
    default:
        console.log('Please use a verified commando  [find-display, test, go]');
}

function testDisplays() {
    screenshot.listDisplays().then((displays) => {
        let index = 0;
        displays.forEach(display => {
            screenshot({ filename: `${index}-test.png`, screen: display.id });
            index++;
        });
    })
}

function dryRun() {
    run(false);
}

const MIS_MATCH_THRESHOLD = 50.0;

function run(continous) {
    let displayIndex = process.argv[3];
    if(!displayIndex) {
        console.warn('Not specified a display, defaulting to 0');
        displayIndex = 0;
    } else {
        console.log(`Running on display ${displayIndex}`);
    }
    screenshot.listDisplays().then(async (displays) => {
        const display = displays[displayIndex];
        const displayArea = display.height * display.width;
        const imgPath = await screenshot({ filename: 'tmp.png', screen: display.id });
        const data = await new Promise((res) => { 
                resemble('tmp.png')
                    .compareTo('window-border.png')
                    .ignoreColors()
                    .onComplete(function(data) {
                        res(data);
                    })
                    .scaleToSameSize();
            });
        
        if(MIS_MATCH_THRESHOLD > data.rawMisMatchPercentage) {
            // This is still a loading screen
            console.log('Still on loading screen, sorry! Hang in there!');
        } else {
            // BEEP BEEP WAKE UP, TIME TO GO!
            console.log('You are no longer on a loading screen, time ta PLAY!');
        }
    })
}

