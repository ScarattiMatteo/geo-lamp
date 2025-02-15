/**
 ** This file will contain reusable functions that can be used in multiple pages.
 */

'use strict';

/**
 * This function will return the same value inputted if it is within the specified range, otherwise it will return the specified
 * minimum or maximum value.
 * @param {Number} min - A minimum value for the range.
 * @param {Number} max - A maximum value for the range.
 * @param {Number} value - The value to contain within the range.
 * @returns The value clamped between the minimum and maximum values.
 */
function keepBetween(min, max, value) {
    /*
        1. Check if the value is larger than the maximum value.
        2. Check if that value is smaller than the minimum value.
        3. If the value is within the range, it will returned as is.
    */
    return Math.max(min, Math.min(value, max));
}

/**
 * This function sets the inputted value's decimals to "cut" them to the specified amount.
 * @param {Number} value - Any value of which we want to round the decimal numbers of.
 * @param {Integer} decimals - The number of digits we want to leave as decimals.
 * @returns The value with decimals rounded to the inputted amount.
 */
function toFixedNumber(value, decimals) {
    // Calculate 10^decimals (e.g., 100 for 2 decimals, 1000 for 3, etc.)
    const factor = Math.pow(10, decimals);

    // Round to the nearest integer after scaling, then scale back
    return Math.round(value * factor) / factor;
}