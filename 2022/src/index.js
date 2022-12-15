"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var runDay = function (day, part) {
    var _a;
    (_a = "./days/d".concat(day), Promise.resolve().then(function () { return require(_a); })).then(function (dayModule) {
        if (isNaN(part) || part === 1)
            dayModule.runPart1();
        if (isNaN(part) || part === 2)
            dayModule.runPart2();
    })["catch"](function (error) { return console.error(error); });
};
// -----------------------------------------------------------------------------
// Advent of Code CLI
// -----------------------------------------------------------------------------
commander_1.program
    .requiredOption('-d, --day <number>', 'Day must be in range 1-25.')
    .option('-p, --part <number>', 'Part must be in range 1-2. By default it will run both parts.');
commander_1.program.parse();
var options = commander_1.program.opts();
var day = parseInt(options.day);
var part = parseInt(options.part);
if (day < 1 || day > 25) {
    console.error('Invalid day range. Day must be in range 1-25.');
}
else if (!isNaN(part) && (part < 1 || part > 2)) {
    console.error('Invalid part range. Part must be in range 1-2.');
}
else {
    runDay(day, part);
}
