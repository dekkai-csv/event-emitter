/* global chai */
import specEventEmitter from '../EventEmitter.spec.js';

async function main() {
    const env = {
        chai,
    };

    await specEventEmitter(env);
}

main();
