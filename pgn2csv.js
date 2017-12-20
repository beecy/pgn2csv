#!/usr/bin/env node

const pgnParser = require('pgn-parser')
const fs = require('fs')

const program = require('commander')
  .version('0.0.1')
  .usage('inputFile')
  .parse(process.argv)

const inputFile = program.args[0]
if (!inputFile) {
  console.error('No input file specified.')
  process.exit(1)
}

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.log(err.message)
    process.exit(1)
  }

  // read pgn file
  pgnParser((err, parser) => {
    if (err) {
      console.log(err.message)
      process.exit(1)
    }

    // some formatting. we don't need this extra info and it can throw errors sometimes
    // due to stuff like clock times etc, that is not handled in the pgn-parser grammar

    /* delete recursive annotation variations */
    var rav_regex = /(\([^\(\)]+\))+?/g
    while (rav_regex.test(data)) {
      data = data.replace(rav_regex, '');
    }

    data = data
      .replace(/(\{[^}]+\})+?/g, '') // remove comments
      .replace(/\$\d+/g, '') // delete numeric annotation glyphs

    // parse the modified pgn data
    const parsedGames = parser.parse(data)

    // get unique header fields
    const uniqueHeaders = []
    parsedGames.forEach(game => {
      const { headers } = game
      Object.keys(headers).forEach(header => {
        if (uniqueHeaders.indexOf(header) === -1) uniqueHeaders.push(header)
      })
    })

    const outputFile = `${inputFile}.csv`
    const outputFileStream = fs.createWriteStream(outputFile)
    // write headers line
    outputFileStream.write(`${uniqueHeaders.reduce((s, header) => `${s}"${header}",`, '').slice(0, -1)}\n`)
    parsedGames.forEach(game => {
      const { headers } = game
      var s = ''
      uniqueHeaders.forEach(header => {
        if (header in headers) s += `"${headers[header]}"`
        s += ','
      })
      outputFileStream.write(`${s.slice(0, -1)}\n`)
    })
    outputFileStream.end()

    console.log(`${parsedGames.length} game headers output to ${outputFile}.`)
  })
})
