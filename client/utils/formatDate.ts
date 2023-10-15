import moment from "moment";
/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm:ss a");
export const formatEventDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm a");
export const formatTime = (date: Date): string => moment(date).format("h:mm:ss a");
