export var METERS_TO_MILES = 0.000621371;

export function padDigits(number, digits) {
    return new Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}