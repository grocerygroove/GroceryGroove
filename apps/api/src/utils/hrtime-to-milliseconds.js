module.exports = function hrtimeToMilliseconds (hrtime) {
    return (hrtime[0] * 1000) + (hrtime[1] / 1000000.0);
};
