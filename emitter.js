'use strict';

class Emitter {
    constructor(context, handler, times, frequency) {
        this.context = context;
        this.handler = handler;
        this.times = times <= 0 ? Infinity : times;
        this.frequency = frequency <= 0 ? 1 : frequency;
        this.counter = 0;
    }

    static createEmitter(context, handler, times = Infinity, frequency = 1) {
        return new Emitter(context, handler, times, frequency);
    }

    emit() {
        if (this.counter < this.times && (this.counter % this.frequency) === 0) {
            this.handler.call(this.context);
        }
        this.counter++;
    }
}

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
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
        return context.context !== this;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);

            addEvent(event, Emitter.createEmitter(context, handler));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            console.info(event, context);

            for (let key of map.keys()) {
                if (key === event || key.startsWith(event + '.')) {
                    deleteContext(key, context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            console.info(event);

            takeEvents(event).forEach(x => {
                if (!map.has(x)) {
                    return;
                }
                map.get(x).forEach(em => em.emit());
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);

            addEvent(event, Emitter.createEmitter(context, handler, times, 1));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);

            addEvent(event, Emitter.createEmitter(context, handler, Infinity, frequency));

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
