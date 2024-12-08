import { program } from "commander"

const runDay = (day: number, part: number) => {
  import(`./days/d${day}.ts`)
    .then(async (dayModule) => {
      if (isNaN(part) || part === 1) dayModule.runPart1()
      if (isNaN(part) || part === 2) dayModule.runPart2()
    })
    .catch((error) => console.error(error))
}

// -----------------------------------------------------------------------------
// Advent of Code CLI
// -----------------------------------------------------------------------------

program
  .requiredOption("-d, --day <number>", "Day must be in range 1-25.")
  .option("-p, --part <number>", "Part must be in range 1-2. By default it will run both parts.")

program.parse()

const options = program.opts()
const day = parseInt(options.day)
const part = parseInt(options.part)

if (day < 1 || day > 25) {
  console.error("Invalid day range. Day must be in range 1-25.")
} else if (!isNaN(part) && (part < 1 || part > 2)) {
  console.error("Invalid part range. Part must be in range 1-2.")
} else {
  runDay(day, part)
}
