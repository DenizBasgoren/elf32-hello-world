
let fs = require("fs")

if ( !process.argv[2]) throw 'ERROR: No input file specified'

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    if (err) throw "ERROR: No such file, or couldn't parse file."
    
    let lines = data.split(/\n/im)

    let codeLines = lines.map( line => line.split(/\/\//)[0] )

    let stringsSplitted = codeLines.map( line => line.split(`"`) )

    stringsSplitted = stringsSplitted.map( line => {
        line = line.map( (token, i) => {
            if (i % 2 == 0) return token

            return ' ' + token.split('').map( char => char.charCodeAt().toString(16)).join(' ') + ' '
        })

        return line.join('')
    })

    let numbersSplitted = stringsSplitted.map( line => line.split(/[\(\)]/i)).map( line => {
        line = line.map( (token, i) => {
            if (i % 2 == 0) return token

            let byte = ''
            let num = Number(token)
            if (num < -128 || num > 255) throw "ERROR: Number out of bounds."
            if (num < 0) num += 256

            byte = num.toString(16)
            if ( byte.length == 1) byte = `0${byte}`

            return byte


        })

        return line.join('')
    })

    let bytes = numbersSplitted.join(' ')

    bytes = bytes.split(/\s+/im)

    let hexToNum = hex => {
        let code = hex.charCodeAt()

        if (code > 47 && code < 58) return code - 48
        else if (code > 64 && code < 71) return code - 55
        else if (code > 96 && code < 103) return code - 87
        else throw "ERROR: No such hex value"
    }

    bytes = bytes.filter(byte => byte.length).map( byte => {
        if (byte.length == 2) {
            return 16 * hexToNum(byte[0]) + hexToNum(byte[1])
        }
        else if (byte.length == 8) {
            return (
                2**0 * hexToNum(byte[7]) +
                2**1 * hexToNum(byte[6]) +
                2**2 * hexToNum(byte[5]) +
                2**3 * hexToNum(byte[4]) +
                2**4 * hexToNum(byte[3]) +
                2**5 * hexToNum(byte[2]) +
                2**6 * hexToNum(byte[1]) +
                2**7 * hexToNum(byte[0])
            )
        }
        else throw 'ERROR: Cannot parse byte'
    })

    let bin = Buffer.from(bytes)

    fs.writeFile('a.out', bin, 'binary', er => {
        if (er) throw 'ERROR: Couldnt save binary buffer'
    })

    // console.log( JSON.stringify(bytes) )
    // console.log(data)
})