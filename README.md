# elf32-hello-world
Let's write hello world in machine code!

- System: Linux
- Machine: x86-64
- Emulated machine: x86
- Executable format: elf (v1.2)

To avoid programming using a hex editor, I've written a small tool, compiler.js, that will compile txt file into a binary file.
How to use compiler.js:

- Install NodeJS
- Run `node compiler your_file.txt` to compile your bytes.
- You should get your `a.out` file.
- Make it executable by running `chmod 777 ./a.out`
- And run it! `./a.out`

# Custom txt format

Custom format accepts raw bytes, raw bits, single byte numbers (both signed and unsigned), and strings (in ascii only), and comments.

Raw bytes have to be seperated by 1+ whitespaces. Should be grouped in two characters as shown. Can be on different lines. Letters a-f and A-F are acceptable.
```
7f 45 4c 46
01
02
03 04 05 AA
```

Raw bits forming one byte can be used instead of hex.
```
12 00 BA
00010010 00000000 10111010
```

Numbers should be surrounded by parantheses `(` and `)`. Numbers can be 0..255 (unsigned) and -128..127 (signed).
```
(-1) 00000000 01 02 03 (4) (5)
```

Strings should be surrounded by double quotes `"` and `"`. Only 7-bit ascii supported. Escape characters are NOT supported.
```
"Hello" " " "world!" 0A
```

Code can be commented using single line comments only.
```
// Print hello world

b8 04 00 00 00				// write operation
bb 01 00 00 00				// to stdout
b9 54 00 66 60				// starting address of the string
ba 0f 00 00 00				// length of the string
cd 80					// system call (interrupt 80h)
```

# References
- ELF Spec: https://refspecs.linuxfoundation.org/elf/elf.pdf
- Online x86 assembler: https://defuse.ca/online-x86-assembler.htm#disassembly
- ELF usage examples: http://www.muppetlabs.com/~breadbox/software/tiny/teensy.html
