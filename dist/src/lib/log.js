"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
function getLogStrs(color, prefix = '', data) {
    data = String(data);
    return data.split(/\r?\n/).map((line) => {
        const colorPrefix = typeof prefix !== 'undefined' ? chalk_1.default.grey(prefix) + ' ' : '';
        const colorData = chalk_1.default[color](line);
        return colorPrefix + colorData + '\n';
        // process.stdout.write(l + '\n')
    });
}
const errorTypes = [
    'fatal',
    'error',
    'warn',
    'success',
    'info',
    'log',
    'debug',
];
const errorColors = {
    fatal: 'redBright',
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'whiteBright',
    log: 'white',
    debug: 'grey',
};
const textPrefixes = {
    // success: "",
    fatal: 'FATAL',
    error: 'ERROR',
    warn: 'WARN',
    // info: "",
    // log: 'white',
    // debug: 'grey',
};
function log_data(errorType, prefix = '', data) {
    const color = errorColors[errorType];
    const data_ = Array.isArray(data) ? data : [data];
    const txtPrefix = textPrefixes[errorType] || '';
    const sData = data_.map((d) => debugParameter(d)).join(' ');
    const l = getLogStrs(color, prefix, sData);
    l.forEach((s) => process.stdout.write(s));
    return l.join('\n');
}
function debugParameter(value) {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    else {
        return debugPrimitive(value);
    }
}
function debugPrimitive(value) {
    let result = String(value);
    if (typeof value === 'string')
        result = `"${result}"`;
    return result;
}
/**

 //
 // Possible implementations:
 //
  const logger = new Logger({ id: 1, level: 1}).log('test')

  const logger = Logger({id, level}).log('test')
  logger2 = logger({id: 2}).log('abc').debug('def')
 */
class Logger {
    _level;
    _prefix;
    constructor(prefix, level = 'debug') {
        this._level = level;
        this._prefix = prefix;
        // this.prefix(prefix);
    }
    prefix(prefix) {
        this._prefix = prefix;
    }
    new(prefix, level = this._level) {
        return new Logger({ ...this._prefix, ...prefix }, level);
    }
    _prefixToString(prefix) {
        let p = `${this._prefix.level}/${this._prefix.id}`;
        // let namePart = prefix.name ? `/${prefix.name}` : ``;
        let namePart = prefix.name ? prefix.name : ``;
        return `[${p}] [${namePart}]`;
    }
    //
    fatal(...params) {
        const msg = log_data('fatal', this._prefixToString(this._prefix), params);
        throw new Error(params.join(' '));
    }
    error(...params) {
        if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('error'))
            log_data('error', this._prefixToString(this._prefix), params);
        return this;
    }
    warn(...params) {
        if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('warn'))
            log_data('warn', this._prefixToString(this._prefix), params);
        return this;
    }
    success(...params) {
        if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('success'))
            log_data('success', this._prefixToString(this._prefix), params);
        return this;
    }
    info(...params) {
        if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('info'))
            log_data('info', this._prefixToString(this._prefix), params);
        return this;
    }
    log(...params) {
        if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('log'))
            log_data('log', this._prefixToString(this._prefix), params);
        return this;
    }
    debug(...params) {
        if (errorTypes.indexOf(this._level) >= errorTypes.indexOf('debug'))
            log_data('debug', this._prefixToString(this._prefix), params);
        return this;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=log.js.map