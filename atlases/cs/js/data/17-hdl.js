/* 17 — HDL reference: the chips used across the hardware course */

CS.hdl = {
  not: {
    title: 'Not',
    note: 'Both inputs of one NAND are tied together: Nand(a=in, b=in). Inversion needs no extra part.',
    code: `CHIP Not {
  IN in;
  OUT out;
  PARTS:
  Nand(a=in, b=in, out=out);
}`
  },
  and: {
    title: 'And',
    note: 'NAND first, then invert. The inversion is itself a NAND — two in total.',
    code: `CHIP And {
  IN a, b;
  OUT out;
  PARTS:
  Nand(a=a, b=b, out=n);
  Not(in=n, out=out);
}`
  },
  or: {
    title: 'Or',
    note: 'Invert both inputs, then combine with NAND: ¬(¬a ∧ ¬b) = a ∨ b.',
    code: `CHIP Or {
  IN a, b;
  OUT out;
  PARTS:
  Not(in=a, out=na);
  Not(in=b, out=nb);
  Nand(a=na, b=nb, out=out);
}`
  },
  xor: {
    title: 'Xor',
    note: 'Four NANDs: n1 = ¬(a∧b), n2 = ¬(a∧n1), n3 = ¬(b∧n1), out = ¬(n2∧n3).',
    code: `CHIP Xor {
  IN a, b;
  OUT out;
  PARTS:
  Nand(a=a, b=b, out=n1);
  Nand(a=a, b=n1, out=n2);
  Nand(a=b, b=n1, out=n3);
  Nand(a=n2, b=n3, out=out);
}`
  },
  mux: {
    title: 'Mux(2:1)',
    note: 'One sel bit, with a, b and out all 1 bit wide; Mux16 is just sixteen copies of this.',
    code: `CHIP Mux {
  IN a, b, sel;
  OUT out;
  PARTS:
  Not(in=sel, out=notsel);
  And(a=a, b=notsel, out=x1);
  And(a=b, b=sel, out=x2);
  Or(a=x1, b=x2, out=out);
}`
  },
  dmux: {
    title: 'DMux(1:2)',
    note: 'Exactly symmetric to Mux: sel chooses which output gets in, and the other is forced to 0.',
    code: `CHIP DMux {
  IN in, sel;
  OUT a, b;
  PARTS:
  Not(in=sel, out=notsel);
  And(a=in, b=notsel, out=a);
  And(a=in, b=sel, out=b);
}`
  },
  not16: {
    title: 'Not16',
    note: 'Sixteen Not gates: gate i touches only in[i] and out[i]; none affects another.',
    code: `CHIP Not16 {
  IN in[16];
  OUT out[16];
  PARTS:
  Not(in=in[0], out=out[0]);
  Not(in=in[1], out=out[1]);
  Not(in=in[2], out=out[2]);
  Not(in=in[3], out=out[3]);
  Not(in=in[4], out=out[4]);
  Not(in=in[5], out=out[5]);
  Not(in=in[6], out=out[6]);
  Not(in=in[7], out=out[7]);
  Not(in=in[8], out=out[8]);
  Not(in=in[9], out=out[9]);
  Not(in=in[10], out=out[10]);
  Not(in=in[11], out=out[11]);
  Not(in=in[12], out=out[12]);
  Not(in=in[13], out=out[13]);
  Not(in=in[14], out=out[14]);
  Not(in=in[15], out=out[15]);
}`
  },
  and16: {
    title: 'And16',
    note: 'Sixteen And gates: no carry, no shared state, each bit on its own.',
    code: `CHIP And16 {
  IN a[16], b[16];
  OUT out[16];
  PARTS:
  And(a=a[0], b=b[0], out=out[0]);
  And(a=a[1], b=b[1], out=out[1]);
  And(a=a[2], b=b[2], out=out[2]);
  And(a=a[3], b=b[3], out=out[3]);
  And(a=a[4], b=b[4], out=out[4]);
  And(a=a[5], b=b[5], out=out[5]);
  And(a=a[6], b=b[6], out=out[6]);
  And(a=a[7], b=b[7], out=out[7]);
  And(a=a[8], b=b[8], out=out[8]);
  And(a=a[9], b=b[9], out=out[9]);
  And(a=a[10], b=b[10], out=out[10]);
  And(a=a[11], b=b[11], out=out[11]);
  And(a=a[12], b=b[12], out=out[12]);
  And(a=a[13], b=b[13], out=out[13]);
  And(a=a[14], b=b[14], out=out[14]);
  And(a=a[15], b=b[15], out=out[15]);
}`
  },
  or16: {
    title: 'Or16',
    note: 'Sixteen Or gates. Same as And16, only the gate changes.',
    code: `CHIP Or16 {
  IN a[16], b[16];
  OUT out[16];
  PARTS:
  Or(a=a[0], b=b[0], out=out[0]);
  Or(a=a[1], b=b[1], out=out[1]);
  Or(a=a[2], b=b[2], out=out[2]);
  Or(a=a[3], b=b[3], out=out[3]);
  Or(a=a[4], b=b[4], out=out[4]);
  Or(a=a[5], b=b[5], out=out[5]);
  Or(a=a[6], b=b[6], out=out[6]);
  Or(a=a[7], b=b[7], out=out[7]);
  Or(a=a[8], b=b[8], out=out[8]);
  Or(a=a[9], b=b[9], out=out[9]);
  Or(a=a[10], b=b[10], out=out[10]);
  Or(a=a[11], b=b[11], out=out[11]);
  Or(a=a[12], b=b[12], out=out[12]);
  Or(a=a[13], b=b[13], out=out[13]);
  Or(a=a[14], b=b[14], out=out[14]);
  Or(a=a[15], b=b[15], out=out[15]);
}`
  },
  mux16: {
    title: 'Mux16',
    note: 'Copied bit by bit: bit i depends only on a[i], b[i] and the same sel.',
    code: `CHIP Mux16 {
  IN a[16], b[16], sel;
  OUT out[16];
  PARTS:
  Mux(a=a[0], b=b[0], sel=sel, out=out[0]);
  Mux(a=a[1], b=b[1], sel=sel, out=out[1]);
  Mux(a=a[2], b=b[2], sel=sel, out=out[2]);
  Mux(a=a[3], b=b[3], sel=sel, out=out[3]);
  Mux(a=a[4], b=b[4], sel=sel, out=out[4]);
  Mux(a=a[5], b=b[5], sel=sel, out=out[5]);
  Mux(a=a[6], b=b[6], sel=sel, out=out[6]);
  Mux(a=a[7], b=b[7], sel=sel, out=out[7]);
  Mux(a=a[8], b=b[8], sel=sel, out=out[8]);
  Mux(a=a[9], b=b[9], sel=sel, out=out[9]);
  Mux(a=a[10], b=b[10], sel=sel, out=out[10]);
  Mux(a=a[11], b=b[11], sel=sel, out=out[11]);
  Mux(a=a[12], b=b[12], sel=sel, out=out[12]);
  Mux(a=a[13], b=b[13], sel=sel, out=out[13]);
  Mux(a=a[14], b=b[14], sel=sel, out=out[14]);
  Mux(a=a[15], b=b[15], sel=sel, out=out[15]);
}`
  },
  dff: {
    title: 'DFF',
    primitive: true,
    note: 'A primitive: no PARTS, implemented directly in hardware. The course does not ask you to build it from gates; doing so would be two latches making the “edge”, and the timing only gets subtler.',
    code: `CHIP DFF {
  IN in;
  OUT out;
  // latch in to out every clock cycle; hold it otherwise
}`
  },
  bit: {
    title: 'Bit',
    note: 'With load=0 the DFF output is fed back (outv), which holds the value; load=1 writes in. Note that out is the chip’s output pin and cannot be used as an input.',
    code: `CHIP Bit {
  IN in, load;
  OUT out;
  PARTS:
  // outv is an internal net: the DFF output drives both out and outv
  Mux(a=outv, b=in, sel=load, out=x);
  DFF(in=x, out=out, out=outv);
}`
  },
  register: {
    title: 'Register (16 bits)',
    note: 'Sixteen Bit chips share one load: either all 16 bits are written, or none move.',
    code: `CHIP Register {
  IN in[16], load;
  OUT out[16];
  PARTS:
  Bit(in=in[0], load=load, out=out[0]);
  Bit(in=in[1], load=load, out=out[1]);
  Bit(in=in[2], load=load, out=out[2]);
  Bit(in=in[3], load=load, out=out[3]);
  Bit(in=in[4], load=load, out=out[4]);
  Bit(in=in[5], load=load, out=out[5]);
  Bit(in=in[6], load=load, out=out[6]);
  Bit(in=in[7], load=load, out=out[7]);
  Bit(in=in[8], load=load, out=out[8]);
  Bit(in=in[9], load=load, out=out[9]);
  Bit(in=in[10], load=load, out=out[10]);
  Bit(in=in[11], load=load, out=out[11]);
  Bit(in=in[12], load=load, out=out[12]);
  Bit(in=in[13], load=load, out=out[13]);
  Bit(in=in[14], load=load, out=out[14]);
  Bit(in=in[15], load=load, out=out[15]);
}`
  },
  pc: {
    title: 'PC (program counter)',
    note: 'Three MUXes in series, the later one winning: reset overrides load, load overrides inc. A copy of the output (outv) feeds Inc16, which gives the increment.',
    code: `CHIP PC {
  IN in[16], load, inc, reset;
  OUT out[16];
  PARTS:
  // outv is an internal copy of out: an output pin cannot be used as an input
  Inc16(in=outv, out=incout);                 // +1
  Mux16(a=outv, b=incout, sel=inc, out=o1);
  Mux16(a=o1,  b=in,      sel=load, out=o2);
  Mux16(a=o2,  b=false,   sel=reset, out=o3);
  Register(in=o3, load=true, out=out, out=outv);
}`
  },
  cpu: {
    title: 'CPU',
    note: 'A uses ARegister and D uses DRegister: these are the course’s observable registers, and the test files read their state. A plain Register works the same, but the DRegister column in the compare file stays 0.',
    code: `
// Hack CPU: A and D registers + ALU + PC
CHIP CPU {
  IN inM[16], instruction[16], reset;
  OUT outM[16], writeM, addressM[15], pc[15];

  PARTS:
  // A input: an A-instruction writes a constant, a C-instruction writes the ALU result
  Mux16(a=instruction, b=aluOut, sel=instruction[15], out=aIn);
  Not(in=instruction[15], out=notInstruction);

  // A register: always written by an A-instruction; a C-instruction looks at d1
  Or(a=notInstruction, b=instruction[5], out=loadA);
  ARegister(in=aIn, load=loadA, out=aOut, out[0..14]=addressM);

  // ALU y: the a bit picks A or M
  Mux16(a=aOut, b=inM, sel=instruction[12], out=yIn);

  // ALU control: on an A-instruction, pass D through (zy=ny=1, f=0 → D ∧ -1)
  And(a=instruction[11], b=instruction[15], out=zx);
  And(a=instruction[10], b=instruction[15], out=nx);
  Or(a=instruction[9],  b=notInstruction, out=zy);
  Or(a=instruction[8],  b=notInstruction, out=ny);
  And(a=instruction[7], b=instruction[15], out=f);
  And(a=instruction[6], b=instruction[15], out=no);

  ALU(x=dOut, y=yIn,
      zx=zx, nx=nx, zy=zy, ny=ny, f=f, no=no,
      out=outM, out=aluOut, zr=zr, ng=ng);

  // write memory: only a C-instruction with d3
  And(a=instruction[15], b=instruction[3], out=writeM);

  // D register: only a C-instruction with d2
  And(a=instruction[15], b=instruction[4], out=loadD);
  DRegister(in=aluOut, load=loadD, out=dOut);

  // jump: j1 = less, j2 = equal, j3 = greater
  Or(a=zr, b=ng, out=notPos);
  Not(in=notPos, out=pos);
  And(a=instruction[0], b=pos, out=jgt);
  And(a=instruction[1], b=zr,  out=jeq);
  And(a=instruction[2], b=ng,  out=jlt);
  Or(a=jgt, b=jeq, out=j1);
  Or(a=j1, b=jlt, out=jCond);
  And(a=jCond, b=instruction[15], out=jump);

  // PC: load A on a jump, otherwise increment
  PC(in=aOut, load=jump, reset=reset, inc=true, out[0..14]=pc);
}`
  },
  halfAdder: {
    title: 'HalfAdder',
    note: 'Two gates are enough: sum is XOR, carry is AND.',
    code: `CHIP HalfAdder {
  IN a, b;
  OUT sum, carry;
  PARTS:
  Xor(a=a, b=b, out=sum);
  And(a=a, b=b, out=carry);
}`
  },
  fullAdder: {
    title: 'FullAdder',
    note: 'Two half adders and an Or: the first adds a and b, the second adds c in.',
    code: `CHIP FullAdder {
  IN a, b, c;
  OUT sum, carry;
  PARTS:
  HalfAdder(a=a, b=b, sum=ab, carry=c1);
  HalfAdder(a=ab, b=c, sum=sum, carry=c2);
  Or(a=c1, b=c2, out=carry);
}`
  },
  add16: {
    title: 'Add16',
    note: 'Sixteen FullAdder chips chained, each passing its carry out into the carry in of the next.',
    code: `CHIP Add16 {
  IN a[16], b[16];
  OUT out[16];
  PARTS:
  HalfAdder(a=a[0], b=b[0], sum=out[0], carry=carry1);
  FullAdder(a=a[1], b=b[1], c=carry1, sum=out[1], carry=carry2);
  FullAdder(a=a[2], b=b[2], c=carry2, sum=out[2], carry=carry3);
  FullAdder(a=a[3], b=b[3], c=carry3, sum=out[3], carry=carry4);
  FullAdder(a=a[4], b=b[4], c=carry4, sum=out[4], carry=carry5);
  FullAdder(a=a[5], b=b[5], c=carry5, sum=out[5], carry=carry6);
  FullAdder(a=a[6], b=b[6], c=carry6, sum=out[6], carry=carry7);
  FullAdder(a=a[7], b=b[7], c=carry7, sum=out[7], carry=carry8);
  FullAdder(a=a[8], b=b[8], c=carry8, sum=out[8], carry=carry9);
  FullAdder(a=a[9], b=b[9], c=carry9, sum=out[9], carry=carry10);
  FullAdder(a=a[10], b=b[10], c=carry10, sum=out[10], carry=carry11);
  FullAdder(a=a[11], b=b[11], c=carry11, sum=out[11], carry=carry12);
  FullAdder(a=a[12], b=b[12], c=carry12, sum=out[12], carry=carry13);
  FullAdder(a=a[13], b=b[13], c=carry13, sum=out[13], carry=carry14);
  FullAdder(a=a[14], b=b[14], c=carry14, sum=out[14], carry=carry15);
  FullAdder(a=a[15], b=b[15], c=carry15, sum=out[15], carry=carry16);
}`
  },
  inc16: {
    title: 'Inc16',
    note: 'Just Add16 with b = 1.',
    code: `CHIP Inc16 {
  IN in[16];
  OUT out[16];
  PARTS:
  // or as one line: Add16(a=in, b[0]=true, b[1..15]=false, out=out);
  Add16(a=in,
        b[0]=true,
        b[1]=false,
        b[2]=false,
        b[3]=false,
        b[4]=false,
        b[5]=false,
        b[6]=false,
        b[7]=false,
        b[8]=false,
        b[9]=false,
        b[10]=false,
        b[11]=false,
        b[12]=false,
        b[13]=false,
        b[14]=false,
        b[15]=false,
        out=out);
}`
  },
  or8way: {
    title: 'Or8Way',
    note: 'Eight inputs chained into one OR — if any bit is 1, the result is 1.',
    code: `CHIP Or8Way {
  IN in[8];
  OUT out;
  PARTS:
  Or(a=in[0], b=in[1], out=t1);
  Or(a=t1, b=in[2], out=t2);
  Or(a=t2, b=in[3], out=t3);
  Or(a=t3, b=in[4], out=t4);
  Or(a=t4, b=in[5], out=t5);
  Or(a=t5, b=in[6], out=t6);
  Or(a=t6, b=in[7], out=out);
}`
  },
  alu: {
    title: 'ALU',
    note: 'All six control bits go to Mux16 selectors. Since out is an output pin, it cannot be read back, so it is also wired to the internal nets lo / hi / msb, and the flags read those nets.',
    code: `CHIP ALU {
  IN x[16], y[16], zx, nx, zy, ny, f, no;
  OUT out[16], zr, ng;
  PARTS:
  Mux16(a=x, b=false, sel=zx, out=x1);    // zx: zero x
  Not16(in=x1, out=nx1);
  Mux16(a=x1, b=nx1, sel=nx, out=x2);     // nx: invert x
  Mux16(a=y, b=false, sel=zy, out=y1);    // zy
  Not16(in=y1, out=ny1);
  Mux16(a=y1, b=ny1, sel=ny, out=y2);     // ny
  And16(a=x2, b=y2, out=andxy);
  Add16(a=x2, b=y2, out=addxy);
  Mux16(a=andxy, b=addxy, sel=f, out=o1); // f: 0 = AND, 1 = add
  Not16(in=o1, out=no1);
  Mux16(a=o1, b=no1, sel=no, out=out, out[0..7]=lo, out[8..15]=hi, out[15]=msb);  // no: invert the result
  Or8Way(in=lo, out=z1);                  // zr: all-zero test (reads internal nets, not out)
  Or8Way(in=hi, out=z2);
  Or(a=z1, b=z2, out=z);
  Not(in=z, out=zr);
  And(a=msb, b=true, out=ng);             // ng: sign bit
}`
  },
  mux4way16: {
    title: 'Mux4Way16',
    note: 'Two levels of Mux16: sel[0] picks one of (a,b) and one of (c,d), then sel[1] picks between those two results.',
    code: `CHIP Mux4Way16 {
  IN a[16], b[16], c[16], d[16], sel[2];
  OUT out[16];
  PARTS:
  Mux16(a=a, b=b, sel=sel[0], out=ab);
  Mux16(a=c, b=d, sel=sel[0], out=cd);
  Mux16(a=ab, b=cd, sel=sel[1], out=out);
}`
  },
  mux8way16: {
    title: 'Mux8Way16',
    note: 'Three levels of Mux16: 4 → 2 → 1, one sel bit per level.',
    code: `CHIP Mux8Way16 {
  IN a[16], b[16], c[16], d[16], e[16], f[16], g[16], h[16], sel[3];
  OUT out[16];
  PARTS:
  Mux16(a=a, b=b, sel=sel[0], out=ab);
  Mux16(a=c, b=d, sel=sel[0], out=cd);
  Mux16(a=e, b=f, sel=sel[0], out=ef);
  Mux16(a=g, b=h, sel=sel[0], out=gh);
  Mux16(a=ab, b=cd, sel=sel[1], out=abcd);
  Mux16(a=ef, b=gh, sel=sel[1], out=efgh);
  Mux16(a=abcd, b=efgh, sel=sel[2], out=out);
}`
  },
  dmux4way: {
    title: 'DMux4Way',
    note: 'Split by sel[1] into halves, then by sel[0] into two each; the other outputs are forced to 0 by And gates.',
    code: `CHIP DMux4Way {
  IN in, sel[2];
  OUT a, b, c, d;
  PARTS:
  Not(in=sel[0], out=ns0);
  Not(in=sel[1], out=ns1);
  And(a=in, b=ns1, out=t1);
  And(a=t1, b=ns0, out=a);
  And(a=t1, b=sel[0], out=b);
  And(a=in, b=sel[1], out=t2);
  And(a=t2, b=ns0, out=c);
  And(a=t2, b=sel[0], out=d);
}`
  },
  dmux8way: {
    title: 'DMux8Way',
    note: 'Three levels of DMux4Way: every output is an And gate, decided by all three sel bits.',
    code: `CHIP DMux8Way {
  IN in, sel[3];
  OUT a, b, c, d, e, f, g, h;
  PARTS:
  Not(in=sel[0], out=ns0);
  Not(in=sel[1], out=ns1);
  Not(in=sel[2], out=ns2);
  And(a=in, b=ns2, out=t1);
  And(a=t1, b=ns1, out=t2);
  And(a=t2, b=ns0, out=a);
  And(a=t2, b=sel[0], out=b);
  And(a=t1, b=sel[1], out=t3);
  And(a=t3, b=ns0, out=c);
  And(a=t3, b=sel[0], out=d);
  And(a=in, b=sel[2], out=t4);
  And(a=t4, b=ns1, out=t5);
  And(a=t5, b=ns0, out=e);
  And(a=t5, b=sel[0], out=f);
  And(a=t4, b=sel[1], out=t6);
  And(a=t6, b=ns0, out=g);
  And(a=t6, b=sel[0], out=h);
}`
  },
  ram8: {
    title: 'RAM8',
    note: 'Eight Register chips with one DMux8Way (write) and one Mux8Way16 (read). The same address decides which one is written and which one is read.',
    code: `CHIP RAM8 {
  IN in[16], load, address[3];
  OUT out[16];
  PARTS:
  DMux8Way(in=load, sel=address, a=l0, b=l1, c=l2, d=l3, e=l4, f=l5, g=l6, h=l7);
  Register(in=in, load=l0, out=r0);
  Register(in=in, load=l1, out=r1);
  Register(in=in, load=l2, out=r2);
  Register(in=in, load=l3, out=r3);
  Register(in=in, load=l4, out=r4);
  Register(in=in, load=l5, out=r5);
  Register(in=in, load=l6, out=r6);
  Register(in=in, load=l7, out=r7);
  Mux8Way16(a=r0, b=r1, c=r2, d=r3, e=r4, f=r5, g=r6, h=r7, sel=address, out=out);
}`
  },
  ram64: {
    title: 'RAM64',
    note: 'Eight RAM8 blocks: address[3..5] picks the block, address[0..2] picks the register inside it.',
    code: `CHIP RAM64 {
  IN in[16], load, address[6];
  OUT out[16];
  PARTS:
  DMux8Way(in=load, sel=address[3..5], a=l0, b=l1, c=l2, d=l3, e=l4, f=l5, g=l6, h=l7);
  RAM8(in=in, load=l0, address=address[0..2], out=r0);
  RAM8(in=in, load=l1, address=address[0..2], out=r1);
  RAM8(in=in, load=l2, address=address[0..2], out=r2);
  RAM8(in=in, load=l3, address=address[0..2], out=r3);
  RAM8(in=in, load=l4, address=address[0..2], out=r4);
  RAM8(in=in, load=l5, address=address[0..2], out=r5);
  RAM8(in=in, load=l6, address=address[0..2], out=r6);
  RAM8(in=in, load=l7, address=address[0..2], out=r7);
  Mux8Way16(a=r0, b=r1, c=r2, d=r3, e=r4, f=r5, g=r6, h=r7, sel=address[3..5], out=out);
}`
  },
  ram512: {
    title: 'RAM512',
    note: 'Eight RAM64 blocks: the top 3 bits pick the block, the low 6 are the address inside it.',
    code: `CHIP RAM512 {
  IN in[16], load, address[9];
  OUT out[16];
  PARTS:
  DMux8Way(in=load, sel=address[6..8], a=l0, b=l1, c=l2, d=l3, e=l4, f=l5, g=l6, h=l7);
  RAM64(in=in, load=l0, address=address[0..5], out=r0);
  RAM64(in=in, load=l1, address=address[0..5], out=r1);
  RAM64(in=in, load=l2, address=address[0..5], out=r2);
  RAM64(in=in, load=l3, address=address[0..5], out=r3);
  RAM64(in=in, load=l4, address=address[0..5], out=r4);
  RAM64(in=in, load=l5, address=address[0..5], out=r5);
  RAM64(in=in, load=l6, address=address[0..5], out=r6);
  RAM64(in=in, load=l7, address=address[0..5], out=r7);
  Mux8Way16(a=r0, b=r1, c=r2, d=r3, e=r4, f=r5, g=r6, h=r7, sel=address[6..8], out=out);
}`
  },
  ram4k: {
    title: 'RAM4K',
    note: 'Eight RAM512 blocks: the top 3 bits pick the block, the low 9 go inside.',
    code: `CHIP RAM4K {
  IN in[16], load, address[12];
  OUT out[16];
  PARTS:
  DMux8Way(in=load, sel=address[9..11], a=l0, b=l1, c=l2, d=l3, e=l4, f=l5, g=l6, h=l7);
  RAM512(in=in, load=l0, address=address[0..8], out=r0);
  RAM512(in=in, load=l1, address=address[0..8], out=r1);
  RAM512(in=in, load=l2, address=address[0..8], out=r2);
  RAM512(in=in, load=l3, address=address[0..8], out=r3);
  RAM512(in=in, load=l4, address=address[0..8], out=r4);
  RAM512(in=in, load=l5, address=address[0..8], out=r5);
  RAM512(in=in, load=l6, address=address[0..8], out=r6);
  RAM512(in=in, load=l7, address=address[0..8], out=r7);
  Mux8Way16(a=r0, b=r1, c=r2, d=r3, e=r4, f=r5, g=r6, h=r7, sel=address[9..11], out=out);
}`
  },
  ram16k: {
    title: 'RAM16K',
    note: 'Four RAM4K blocks: 16K ÷ 4K = 4, so this level uses DMux4Way and Mux4Way16.',
    code: `CHIP RAM16K {
  IN in[16], load, address[14];
  OUT out[16];
  PARTS:
  DMux4Way(in=load, sel=address[12..13], a=l0, b=l1, c=l2, d=l3);
  RAM4K(in=in, load=l0, address=address[0..11], out=r0);
  RAM4K(in=in, load=l1, address=address[0..11], out=r1);
  RAM4K(in=in, load=l2, address=address[0..11], out=r2);
  RAM4K(in=in, load=l3, address=address[0..11], out=r3);
  Mux4Way16(a=r0, b=r1, c=r2, d=r3, sel=address[12..13], out=out);
}`
  },
  memory: {
    title: 'Memory',
    note: 'RAM16K (0–16383), Screen (16384–24575) and Keyboard (24576) sit side by side, decoded by address[14] and address[13].',
    code: `CHIP Memory {
  IN in[16], load, address[15];
  OUT out[16];
  PARTS:
  // address[14]: 0 → RAM, 1 → screen / keyboard
  DMux(in=load, sel=address[14], a=loadRAM, b=loadDevice);

  // address[13]: 0 → screen, 1 → keyboard (read-only, no load)
  Not(in=address[13], out=notA13);
  And(a=loadDevice, b=notA13, out=loadScreen);

  RAM16K(in=in, load=loadRAM, address=address[0..13], out=outRAM);
  Screen(in=in, load=loadScreen, address=address[0..12], out=outScreen);
  Keyboard(out=outKbd);

  // read: pick screen/keyboard first, then RAM vs device
  Mux16(a=outScreen, b=outKbd, sel=address[13], out=outSK);
  Mux16(a=outRAM, b=outSK, sel=address[14], out=out);
}`
  },
  computer: {
    title: 'Computer',
    note: 'Three chips make the whole machine: ROM32K (built in), CPU and Memory. pc points the way, instruction carries it back, addressM/outM/writeM go out, inM comes back.',
    code: `CHIP Computer {
  IN reset;
  PARTS:
  ROM32K(address=pc, out=instruction);
  CPU(inM=inM, instruction=instruction, reset=reset,
      outM=outM, writeM=writeM, addressM=addressM, pc=pc);
  Memory(in=outM, load=writeM, address=addressM, out=inM);
}`
  }
};


CS.hdlView = (function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  function highlight(code) {
    return escapeHtml(code).split('\n').map(function (line) {
      var ci = line.indexOf('//');
      var head = ci >= 0 ? line.slice(0, ci) : line;
      var tail = ci >= 0 ? line.slice(ci) : '';
      head = head
        .replace(/\b(CHIP|IN|OUT|PARTS)\b/g, '<span class="t-k">$1</span>')
        .replace(/\b(true|false)\b/g, '<span class="t-c">$1</span>');
      return head + (tail ? '<span class="t-m">' + tail + '</span>' : '');
    }).join('\n');
  }

  return function (id, opts) {
    var item = CS.hdl[id];
    if (!item) return '';
    opts = opts || {};
    return '<div class="hdl-block' + (opts.compact ? ' is-compact' : '') + '">' +
      '<div class="hdl-head"><span class="hdl-title">' + item.title + '</span>' +
      '<span class="hdl-tag">HDL</span>' +
      (opts.link === false ? '' : '<a class="hdl-link" href="https://nand2tetris.github.io/web-ide/chip" target="_blank" rel="noopener">Verify in the Web IDE ↗</a>') +
      '</div>' +
      '<pre class="hdl-code">' + highlight(item.code) + '</pre>' +
      (item.note ? '<p class="hdl-note">' + item.note + '</p>' : '') +
      '</div>';
  };
})();
