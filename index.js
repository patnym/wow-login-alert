const screenshot = require('screenshot-desktop');
const resemble = require('resemblejs');
const player = require('node-wav-player');

switch (process.argv[2]) {
    case 'find-display': 
        testDisplays();
        break;
    case 'test':
        dryRun();
        break;
    case 'go': 
        run(true);
        break;
    default:
        console.log('Please use a verified commando  [find-display, test, go]');
}

function testDisplays() {
    screenshot.listDisplays().then((displays) => {
        let index = 0;
        displays.forEach(display => {
            screenshot({ filename: `${index}-ref.png`, screen: display.id });
            index++;
        });
    })
}

function dryRun() {
    run(false);
}

const MIS_MATCH_THRESHOLD = process.argv[4] || 50.0;

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
        do {
            await screenshot({ filename: 'tmp.png', screen: display.id });
            const data = await new Promise((res) => { 
                    resemble('tmp.png')
                        .compareTo('image-ref.png')
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
                await soundAlarm(continous);
            }
        } while(continous);
    });
}

async function soundAlarm(infinite) {
    player.play({
        path: 'alarm.wav',
        loop: infinite
      }).then(() => {
        console.log('The wav file started to be played successfully.');
      }).catch((error) => {
        console.error(error);
      });
}

