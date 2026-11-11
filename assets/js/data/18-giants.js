/* 18 — Open courses: standing on the shoulders of giants
   Each course is a study record, not a copy of the teaching material.
*/
CS.giants = [
  {
    id: 'nand2tetris',
    name: 'nand2tetris',
    full: 'From Nand to Tetris',
    school: 'Hebrew University · IDC Herzliya (renamed Reichman University in 2021)',
    authors: 'Noam Nisan, Shimon Schocken',
    since: '2005 (book) / 2021 (2nd edition)',
    url: 'https://www.nand2tetris.org/',
    license: 'Textbook rights reserved (MIT Press); the website is free to read, which does not make it free to republish',
    intro: 'Build a general-purpose computer that runs Tetris, starting from a NAND gate and a small HDL. The hardware half covers combinational logic, sequential logic, the ALU, the CPU and assembly.',
    why: 'Its path is close to irreplaceable: every layer is built from the one below, with no skipped steps. I go bottom-up — gates, then arithmetic, then storage, then the whole machine, and only then what the machine can run.',
    order: 'My order (not exactly the course’s chapter order)',
    notes: [['#/intro', '0 Why universal', 'Turing machine, universality, stored program', 'live'], ['#/p1', '1 Basic gates', 'NOT/AND/OR/XOR, MUX, 16-bit', 'live'], ['#/p2', '2 Adders', 'half adder, full adder, Add16, Inc16', 'live'], ['#/alu', '3 ALU', 'six control bits, 18 functions', 'live'], ['#/clock', '4 Sequential logic', 'DFF, Bit, Register, PC', 'live'], ['#/ram', '5 RAM', 'RAM8 → RAM16K, address decoding', 'live'], ['#/machine', '6 Machine spec', 'memory map, registers, one beat', 'live'], ['#/ml', '7 Machine language', 'A/C instructions, binary vs symbolic', 'live'], ['#/asm', '8 Assembly', 'two passes, symbol table', 'live'], ['#/cpu', '9 CPU', 'control bits, datapath, jumps', 'live'], ['#/computer', '10 The whole machine', 'Memory + ROM32K + CPU', 'live'], ['#/screen', '11 Screen', 'writing memory is drawing', 'live'], ['#/input', '12 Keyboard', '24576, polling', 'live'], ['#/logic', 'Appendix: gates', 'the six basic gates at a glance', 'live']]
  }
];

CS.giantPlanned = [['MIT 6.004', 'Computation Structures', 'MIT OCW'], ['MIT 6.006', 'Introduction to Algorithms', 'MIT OCW'], ['CS50', 'Introduction to Computer Science', 'Harvard']];
