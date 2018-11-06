
class Emitter {
    constructor(context, handler, count, frequency) {
        this.context = context;
        this.handler = handler;
        this.count = count <= 0 ? Infinity : count;
        this.frequency = frequency <= 0 ? 1 : frequency;
        this.counter = 0;
    }

    emit() {
        if (this.counter < this.count && (this.counter % this.frequency) === 0) {
            this.handler.call(this.context);
        }
        this.counter++;
    }
}

let map = new Map();

function addEvent(event, emitter) {
    if (map.has(event)) {
        map.get(event).push(emitter);
    } else {
        map.set(event, [emitter]);
    }
}

function deleteContext(event, context) {
    if (map.has(event)) {
        map.set(event, map.get(event).filter(without, context));
    }
}

function takeEvents(event) {
    let result = [];
    while (event.indexOf('.') > 0) {
        result.push(event);
        event = event.slice(0, event.indexOf('.'));
    }
    result.push(event);

    return result;
}

function without(context) {
    return !context.includes(this);
}

map.set(1, ['232', '212', '111']);

console.info(map)

deleteEvent(1, '2')

console.info(map)

console.info('232'.includes('23'))
