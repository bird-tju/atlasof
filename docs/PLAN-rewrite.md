# Hardware line — rewrite plan (executed)

Status: **done**. Kept as a record of the editorial decisions behind the hardware course.

## 1. Three principles

1. Every page answers a question the previous page raised.
2. Every chip is introduced as the solution to a crisis, not as a specification.
3. Anything that can be shown is shown: a diagram, a table you can click, or a panel you can drive.

## 2. Narrative: each chip = the answer to one crisis

### 2.1 Opening template

Each hardware page opens with: what breaks if we stop here → what the new part must do → what it costs.

### 2.2 Page-by-page crisis

| Page | Crisis it answers |
| --- | --- |
| intro | A machine that only adds is not universal; a program must be data |
| p1 | Gates are given, but only NAND is complete — every other gate is a construction |
| p2 | Adding two bits needs a carry, and a carry has to travel |
| alu | One adder is not enough; operations must be selectable |
| clock | Combinational logic forgets; state needs an edge |
| ram | One register does not scale; addresses need decoding |
| machine | The parts exist but nobody has said what the machine promises |
| ml | The promise has to be written in 16 bits |
| asm | Nobody writes 16 bits by hand; symbols need a compiler |
| cpu | The control bits must be wired to the parts |
| computer | The chips must be connected into one machine |
| screen | Output must be reachable without new instructions |
| input | So must input |

### 2.3 Effort

Roughly one round of work per page: prose, one or two figures, one interactive panel, one HDL block.

## 3. Cognition: turn rules into necessities

### 3.1 Two's complement = the clock face

Placed in the subtraction part of `#/alu` rather than its own section: a 12-hour dial makes "subtract by adding 65536 − X" obvious.

### 3.2 Bistable → edge triggering

Implemented on `#/clock`: two NOTs hold each other; an odd number of stages oscillates; the DFF is the sluice gate that only lets settled values through.

### 3.3 Two passes = forward references

On `#/asm`: a jump to a label defined later cannot be encoded in one pass, which is exactly why assemblers scan twice.

### 3.4 CPU = a railway switchyard

On `#/cpu`: the 16-bit instruction as a work order for an automatic switch operator.

## 4. Not doing

- No new topics, no new domains.
- No second language: the site is English-only at `/cs/…`.
- No build step for authoring: data files are edited directly.
