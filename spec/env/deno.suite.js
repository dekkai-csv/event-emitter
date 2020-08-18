/* global Deno */
/* global chai */
import '../../node_modules/mocha/mocha.js';
import '../../node_modules/chai/chai.js';

import specEventEmitter from '../EventEmitter.spec.js';

async function main() {
    // setup mocha
    mocha.setup({ui: 'bdd', reporter: 'spec'});
    mocha.checkLeaks();

    function onCompleted(failures) {
        if (failures > 0) {
            Deno.exit(1);
        } else {
            Deno.exit(0);
        }
    }

    // Browser based Mocha requires `window.location` to exist.
    window.location = new URL('http://localhost:0');

    // create the environment
    const env = {
        chai,
    };

    // register tests
    await specEventEmitter(env);

    // run tests
    mocha.color(true);
    mocha.run(onCompleted).globals(['onerror']);
}

main();
