"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const runDay = (day, part) => {
    var _a;
    (_a = `./days/d${day}`, Promise.resolve().then(() => __importStar(require(_a)))).then(dayModule => {
        if (isNaN(part) || part === 1)
            dayModule.runPart1();
        if (isNaN(part) || part === 2)
            dayModule.runPart2();
    })
        .catch(error => console.error(error));
};
// -----------------------------------------------------------------------------
// Advent of Code CLI
//------------------------------------------------------------------------------
commander_1.program
    .requiredOption('-d, --day <number>', 'Day must be in range 1-25.')
    .option('-p, --part <number>', 'Part must be in range 1-2. By default it will run both parts.');
commander_1.program.parse();
const options = commander_1.program.opts();
const day = parseInt(options.day);
const part = parseInt(options.part);
if (day < 1 || day > 25) {
    console.error('Invalid day range. Day must be in range 1-25.');
}
else if (!isNaN(part) && (part < 1 || part > 2)) {
    console.error('Invalid part range. Part must be in range 1-2.');
}
else {
    runDay(day, part);
}
