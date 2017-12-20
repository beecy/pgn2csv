## pgn2csv

A quick and dirty command-line utility to output headers from a PGN file (chess) to a CSV file. The output CSV file will contain one column for each unique header tag found in the input PGN file.

### Usage

```
npm install
./pgn2csv some/pgn/file.pgn
```

#### Options

  -V, --version              output the version number  
  -o, --output-file [value]  specify output file  
  -h, --help                 output usage information  

### Credits

- [kevinludwig/pgn-parser](https://github.com/kevinludwig/pgn-parser)