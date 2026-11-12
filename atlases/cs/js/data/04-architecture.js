/* 04 — Computer architecture */
CS.addTopics([

  {
    id: 'von-neumann',
    name: 'Von Neumann Architecture',
    domain: 'architecture',
    year: 1945,
    tags: ['Stored program', 'Architecture', 'Prototype'],
    summary: 'Put program and data in the same memory and a machine can run any task by rewriting its own instructions: the prototype of the modern computer.',
    body: ['In 1945 the EDVAC report described the stored-program computer: five parts — arithmetic unit, control unit, memory, input and output — with instructions and data sharing memory, fetched and executed in address order. Before it, ENIAC was programmed by hand-patching cables; the stored program made software a thing independent of hardware.', 'The price is the “von Neumann bottleneck”: bandwidth between CPU and memory caps throughput. Hence caches, pipelines, multicore and prefetching. High-performance processors still bargain with that 1945 structure, while GPUs and neuromorphic chips try to route around it.'],
    milestones: [
      [1945, 'The EDVAC report', 'The classic description of the stored-program architecture.', 1],
      [1948, 'The Manchester Baby', 'The first machine to run a stored program.'],
      [1949, 'EDSAC goes into service', 'The first practical stored-program computer.'],
      [1951, 'UNIVAC I', 'The first commercial computer.']
    ],
    concepts: [['Stored program', 'Instructions and data live in one addressable memory.'], ['The five parts', 'Arithmetic unit, control unit, memory, input and output.'], ['Von Neumann bottleneck', 'Bandwidth between CPU and memory becomes the performance ceiling.']],
    people: [['John von Neumann', '1903 – 1957', 'Proposed the stored-program architecture and game theory.'], ['Maurice Wilkes', '1913 – 2010', 'Led EDSAC and pioneered microprogramming.']],
    related: ['transistor-ic', 'microprocessor', 'memory-hierarchy'],
    reading: [['First Draft of a Report on the EDVAC', 'John von Neumann', '1945'], ['Computer Organization and Design', 'Patterson & Hennessy', '1994']],
    practice: 'Write a 30-line interpreter for a tiny stored-program machine: memory holds both instructions and data'
  },

  {
    id: 'transistor-ic',
    name: 'Transistor & Integrated Circuit',
    domain: 'architecture',
    year: 1947,
    tags: ['Semiconductors', 'Moore’s law', 'Silicon'],
    summary: 'Transistors replaced vacuum tubes, integrated circuits packed thousands onto one die, and computing entered exponential growth.',
    body: ['In 1947 Bardeen, Brattain and Shockley made the point-contact transistor at Bell Labs; the silicon transistor followed in 1954. Compared with fragile, hot, power-hungry vacuum tubes, transistors were smaller, more reliable and cheaper to run. In 1958 Kilby built the first integrated circuit on germanium; in 1959 Noyce proposed the planar silicon process that made mass production possible.', 'In 1965 Moore observed that the component count per chip doubled every year, later revised to about two — an empirical regularity that held for half a century. It was not only a hardware victory; it reshaped software. As transistors got cheap, moving logic into software and handing generality to the compiler became the better bargain.'],
    milestones: [
      [1947, 'The point-contact transistor', 'Bardeen, Brattain and Shockley at Bell Labs.', 1],
      [1958, 'The first integrated circuit', 'Kilby puts several components on one piece of material.'],
      [1959, 'The planar process', 'Noyce and Moore make integrated circuits manufacturable.'],
      [1965, 'Moore\'s law', 'Component counts roughly double every two years.']
    ],
    concepts: [['Semiconductor', 'Conductivity controlled by doping — the physical basis of the transistor.'], ['Moore’s law', 'An empirical regularity: transistor count per area doubles about every two years.'], ['Process node', 'The naming of process generations, such as 7 nm or 3 nm, no longer matching the actual gate length.']],
    people: [['William Shockley', '1910 – 1989', 'Co-inventor of the transistor and an early force behind Silicon Valley.'], ['Robert Noyce', '1927 – 1990', 'Co-inventor of the integrated circuit and co-founder of Intel.']],
    related: ['microprocessor', 'von-neumann', 'gpu-computing'],
    reading: [['Chip War', 'Chris Miller', '2022'], ['Fire in the Valley', 'Freiberger & Swaine', '1984']],
    practice: 'Estimate how many transistors a modern GPU has and how many doublings that took since 1971 — check the exponent against Moore’s law'
  },

  {
    id: 'microprocessor',
    name: 'Microprocessor & Moore’s Law',
    domain: 'architecture',
    year: 1971,
    tags: ['CPU', 'Personal computing', 'Process'],
    summary: 'Putting the CPU on a single chip took computers from machine rooms to desks, pockets and everything else.',
    body: ['In 1971 Intel released the 4004, a 4-bit microprocessor designed for calculators. The 8080 of 1974 and the 8086 of 1978 carried it into personal computers; the 1981 IBM PC used the 8088 and established an open architecture with a clone ecosystem.', 'The microprocessor compressed a computer from a building into a chip and moved competition from system integration to process and architecture. Dennard scaling kept shrinking transistors until the power wall arrived in the 2000s; clock speeds stopped climbing and multicore plus dedicated accelerators became the new growth path.'],
    milestones: [
      [1971, 'Intel 4004', 'The first commercial microprocessor.', 1],
      [1974, 'Intel 8080', 'It fuels the personal-computer wave.'],
      [1978, 'Intel 8086', 'The starting point of x86.'],
      [1981, 'The IBM PC', 'An open architecture creates the clone industry.'],
      [2005, 'Multicore becomes mainstream', 'Clock speeds stall and parallelism becomes the main road.']
    ],
    concepts: [['Instruction cycle', 'Fetch, decode, execute, memory access, write back.'], ['Pipeline', 'Overlapping several instructions to raise throughput.'], ['Power wall', 'The thermal and energy limits that stopped frequency scaling.']],
    people: [['Federico Faggin', '1941 – ', 'Designer of the Intel 4004.'], ['Gordon Moore', '1929 – 2023', 'Formulated Moore’s law; co-founder of Intel.']],
    related: ['transistor-ic', 'risc-cisc', 'von-neumann'],
    reading: [['A Brief History of the Microprocessor', 'Michael Malone', '1995'], ['Computer Organization and Design', 'Patterson & Hennessy', '1994']],
    practice: 'Simulate a 5-stage pipeline on paper and count the penalty of a branch misprediction'
  },

  {
    id: 'risc-cisc',
    name: 'Instruction Sets: RISC vs CISC',
    domain: 'architecture',
    year: 1964,
    tags: ['ISA', 'Pipelining', 'Energy efficiency'],
    summary: 'Should an instruction set be complex or simple? A half-century argument shaped today’s ARM, RISC-V and x86.',
    body: ['In 1964 the IBM System/360 unified a product line behind one compatible complex instruction set (CISC), so software could run across models. CISC tried to make each instruction do more in order to reduce memory accesses — a sensible trade when memory was expensive.', 'In the 1980s Patterson and Hennessy proposed RISC: simple, fixed-length, pipeline-friendly instructions, with the complexity pushed onto the compiler. MIPS and SPARC demonstrated the performance advantage. But x86 absorbed RISC ideas through microcode and superscalar execution, and ARM took mobile with low power. In 2010 RISC-V appeared as an open instruction set and opened a new phase of the argument.'],
    milestones: [
      [1964, 'IBM System/360', 'The model for CISC and for compatibility.'],
      [1980, 'RISC is proposed', 'Patterson starts the RISC project at Berkeley.', 1],
      [1985, 'MIPS R2000', 'A commercial RISC processor.'],
      [1990, 'ARM is founded', 'Low-power RISC moves into mobile devices.'],
      [2010, 'RISC-V', 'An open, extensible instruction set.']
    ],
    concepts: [['Instruction set architecture', 'The contract between software and hardware: instructions, registers, memory model.'], ['Pipelining', 'Fixed-length RISC instructions make fetch and decode easier to overlap.'], ['Energy efficiency', 'Performance per watt, which matters more than peak speed in the mobile era.']],
    people: [['David Patterson', '1947 – ', 'A driving force behind RISC and RAID.'], ['John Hennessy', '1952 – ', 'RISC and computer-architecture education.']],
    related: ['microprocessor', 'memory-hierarchy', 'compilers'],
    reading: [['Computer Architecture: A Quantitative Approach', 'Hennessy & Patterson', '1990'], ['The RISC-V Reader', 'Waterman & Asanović', '2017']],
    practice: 'Hand-assemble the same loop for a 2-address and a 3-address machine, then count instruction bytes fetched'
  },

  {
    id: 'memory-hierarchy',
    name: 'Memory Hierarchy & Caches',
    domain: 'architecture',
    year: 1956,
    tags: ['Caches', 'Locality', 'Memory'],
    summary: 'Registers, caches, DRAM, disks and flash form a pyramid — faster is smaller and dearer, and locality lets fast storage masquerade as huge storage.',
    body: ['In 1956 magnetic-core memory replaced delay lines as reliable main memory. In 1965 Wilkes proposed the cache: keep recently used data in a small fast store near the CPU. The hierarchy has deepened ever since — registers, L1/L2/L3, DRAM, SSD, disk, network storage.', 'The structure works because programs show temporal and spatial locality. Cache lines, prefetching, write-back policies and coherence protocols are all engineering around locality. Today a memory access can be two orders of magnitude slower than an arithmetic operation, so understanding the memory hierarchy often matters more than understanding the instruction set.'],
    milestones: [
      [1956, 'Magnetic-core memory', 'Random-access main memory becomes real.'],
      [1965, 'The cache idea', 'Wilkes proposes a small, fast buffer memory.', 1],
      [1968, 'DRAM is invented', 'One transistor per bit.'],
      [1980, 'Multi-level caches', 'L1 and L2 become standard on processors.'],
      [2000, 'NUMA and the memory wall', 'The coherence challenge of the multicore era.']
    ],
    concepts: [['Locality', 'Programs tend to reuse recent data and nearby addresses.'], ['Cache line', 'The smallest unit moved between cache and memory, usually 64 bytes.'], ['Coherence protocol', 'Rules that keep caches consistent across cores, such as MESI.']],
    people: [['Maurice Wilkes', '1913 – 2010', 'Proposed the cache and microprogramming.'], ['Robert Dennard', '1932 – ', 'Inventor of DRAM.']],
    related: ['von-neumann', 'microprocessor', 'virtual-memory'],
    reading: [['Computer Systems: A Programmer’s Perspective', 'Bryant & O’Hallaron', '2003'], ['Cache design notes', 'Hennessy & Patterson', '2011']],
    practice: 'Measure the access time of an array with stride 1 versus stride 64, and plot the cliff when entries stop fitting in cache'
  },

  {
    id: 'gpu-computing',
    name: 'GPU & Heterogeneous Computing',
    domain: 'architecture',
    year: 1999,
    tags: ['Parallelism', 'Accelerators', 'AI compute'],
    summary: 'A parallel chip designed for triangles and pixels unexpectedly became the engine of deep learning.',
    body: ['In 1999 NVIDIA’s GeForce 256 was first called a GPU: it fixed transform, lighting and rasterisation onto a massively parallel pipeline. From 2001 programmable shaders let developers write small programs running on thousands of cores.', 'In 2006 CUDA turned the GPU into a general parallel processor. In 2012 AlexNet trained a model on two GTX 580s that stunned ImageNet, and the GPU became the infrastructure of AI. Today GPUs, TPUs and NPUs form heterogeneous computing together: the CPU controls, the accelerators deliver throughput.'],
    milestones: [
      [1999, 'GeForce 256', 'The word GPU reaches a wide audience.'],
      [2001, 'Programmable shaders', 'GPUs begin to accept general programs.'],
      [2006, 'CUDA', 'An operating system for general-purpose GPU computing.', 1],
      [2012, 'AlexNet', 'GPU-trained deep networks begin.'],
      [2017, 'TPUs and dedicated accelerators', 'Google puts tensor arithmetic into silicon.']
    ],
    concepts: [['SIMT', 'Single instruction, multiple threads: one instruction drives many threads.'], ['Heterogeneous computing', 'CPU and accelerators split the work each is good at.'], ['Memory bandwidth', 'The key constraint on GPU performance, often scarcer than raw compute.']],
    people: [['Jensen Huang', '1963 – ', 'NVIDIA co-founder; pushed general-purpose GPU computing.'], ['Ian Buck', '1970 – ', 'Early leader of CUDA.']],
    related: ['deep-learning', 'shaders', 'microprocessor'],
    reading: [['CUDA Programming Guide', 'NVIDIA', '2007'], ['Computer Architecture: A Quantitative Approach', 'Hennessy & Patterson', '2011']],
    practice: 'Write a CUDA kernel that adds two 1M-element arrays and compare its time with the CPU version'
  }

]);
