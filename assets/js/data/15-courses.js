/* 15 — Courses and labs: what each domain looks like in a degree
   type: lab (standalone lab / project) | mixed (in-class labs + project) | none (problem sets and proofs)
*/
CS.courses = {
  foundations: {
    type: 'none',
    courses: ['Discrete Mathematics', 'Linear Algebra', 'Probability and Statistics', 'Mathematical Logic (elective)'],
    en: ['MIT 6.042J Mathematics for Computer Science', 'Berkeley CS 70 Discrete Mathematics and Probability Theory'],
    note: 'Courses like these have almost no lab sessions; assessment is problem sets and proofs, with programming only a supporting tool. Boolean algebra and Karnaugh maps appear as paper exercises inside discrete mathematics.',
    labs: [['Programming assignments', 'Enumerate properties of sets, relations and graphs with code, or check probability results by Monte Carlo', ''], ['Truth tables and Karnaugh maps', 'The Boolean-algebra chapter of discrete mathematics: simplify expressions and draw maps, all on paper, with no lab', ''], ['Proof grading', 'Most schools assess written proofs; lab hours are close to zero', '']]
  },
  theory: {
    type: 'none',
    courses: ['Formal Languages and Automata', 'Theory of Computation / Computability', 'Computational Complexity (graduate)'],
    en: ['MIT 6.045 Automata, Computability and Complexity', 'Berkeley CS 172 Computability and Complexity'],
    note: 'There is almost no lab work. The only programming assignment is usually “write a simulator for an automaton or a Turing machine”.',
    labs: [['Turing machine / DFA simulator', 'The one programming task most courses set: implement transitions and run test strings', ''], ['Reduction exercises', 'Reducing 3-SAT to independent set and the like — paper work, not lab work', '']]
  },
  algorithms: {
    type: 'mixed',
    courses: ['Data Structures', 'Algorithm Design and Analysis'],
    en: ['MIT 6.006 Introduction to Algorithms', 'Princeton COS 226 Algorithms'],
    note: 'Labs are mostly “code it and let the judge check”, once a week, with no separate lab credit.',
    labs: [['Online judge', 'Solve set problems with automatic scoring and time limits — the closest thing to industry practice', ''], ['Algorithm visualisation', 'Watch sorting, shortest paths and balanced trees execute in a visualiser', '']]
  },
  architecture: {
    type: 'lab',
    courses: ['Digital Logic', 'Computer Organisation', 'Computer Architecture'],
    en: ['CMU 15-213 Introduction to Computer Systems (CSAPP)', 'Berkeley CS 61C Great Ideas in Computer Architecture'],
    note: 'There is a separate project course (usually 1–2 credits, two intensive weeks) in which you build a working CPU. Boolean algebra becomes a circuit here for the first time.',
    labs: [['Digital logic lab', 'Simplify expressions with Boolean algebra, then build them from gates: the first time a truth table becomes a circuit', ''], ['CPU design', 'Go from single cycle to pipeline (MIPS / RISC-V) in Logisim or Verilog, and pass the instruction tests', ''], ['The seven CSAPP labs', 'data, bomb, attack, cache, malloc, shell, proxy — each one teaches a layer of abstraction', '']]
  },
  systems: {
    type: 'lab',
    courses: ['Operating Systems', 'Operating Systems Project'],
    en: ['MIT 6.1810 Operating System Engineering', 'Berkeley CS 162 Operating Systems'],
    note: 'The most demanding lab course of the degree: you add system calls, change the scheduler and write a file system inside a real kernel.',
    labs: [['xv6 labs', 'MIT 6.1810: util, syscall, pgtbl, traps, cow, thread, net, lock, fs, mmap — ten labs', ''], ['ucore / rCore', 'Tsinghua’s ucore and rCore, from bootloader all the way to file systems and processes', ''], ['Nachos / Pintos', 'Classic teaching kernels, used by Berkeley CS 162 and many other schools', '']]
  },
  network: {
    type: 'mixed',
    courses: ['Computer Networks', 'Network Programming (elective)'],
    en: ['Stanford CS 144 Introduction to Computer Networking', 'Berkeley CS 168 Introduction to the Internet'],
    note: 'Most schools run in-class labs (packet capture plus socket programming); a few offer a project course that writes TCP from scratch.',
    labs: [['Wireshark capture analysis', 'Walk one HTTP / DNS / TCP exchange layer by layer and attribute every field', ''], ['TCP stack', 'Stanford CS 144: byte stream → receiver → sender → router, four labs', ''], ['Socket programming', 'Build a small HTTP server, a chat room or a proxy', '']]
  },
  languages: {
    type: 'lab',
    courses: ['Compiler Design', 'Principles of Programming Languages (elective)'],
    en: ['Stanford CS 143 Compilers', 'CMU 15-312 Foundations of Programming Languages'],
    note: 'There is a project: write a compiler that turns real programs into assembly, usually in four or five stages.',
    labs: [['Cool compiler', 'Stanford CS 143: lexing, parsing, semantics and code generation, ending with a complete language', ''], ['SysY compiler', 'The Chinese national compiler contest: compile a C subset to RISC-V against an official test suite', ''], ['PL/0 compiler', 'The smallest usable compiler in Chinese textbooks; a good first project', '']]
  },
  engineering: {
    type: 'mixed',
    courses: ['Software Engineering', 'Software Engineering Project'],
    en: ['CMU 17-313 Foundations of Software Engineering', 'Berkeley CS 169 Software Engineering'],
    note: 'The lab is a team project: four to eight people for a semester, graded on deliverables, reviews and test coverage rather than lines of code.',
    labs: [['Team project', 'Walk the whole path from requirements to delivery, with weight on version control, code review and automated tests', ''], ['Open-source contribution', 'Some courses require a pull request to a real project that passes maintainer review', '']]
  },
  data: {
    type: 'lab',
    courses: ['Database Systems', 'Database Project'],
    en: ['CMU 15-445 Database Systems', 'Berkeley CS 186 Introduction to Database Systems'],
    note: 'The labs are substantial: CMU’s BusTub has you implement core components inside a real DBMS skeleton.',
    labs: [['The four BusTub projects', 'CMU 15-445: buffer pool manager, B+ tree index, query execution, concurrency control', ''], ['SQL and transactions', 'Create tables and indexes, then use two sessions to see the four isolation levels differ', ''], ['A small DBMS', 'Implement storage, an index and a simple SQL parser yourself', '']]
  },
  ai: {
    type: 'mixed',
    courses: ['Introduction to AI', 'Machine Learning', 'Deep Learning (elective)'],
    en: ['Berkeley CS 188 Introduction to AI', 'Stanford CS 231N Deep Learning for Computer Vision'],
    note: 'Labs are scaffolded assignments plus a project: the assignments give you the framework and the tests, the project usually reproduces a paper or enters a competition.',
    labs: [['The Pacman assignments', 'Berkeley CS 188: search, games, MDPs and reinforcement learning, all inside one game', ''], ['CS231n assignments', 'From kNN to CNN and RNN, with backpropagation written by hand and no autograd allowed', ''], ['Paper reproduction or contest', 'The usual project: reproduce a conference paper or submit a Kaggle score', '']]
  },
  interaction: {
    type: 'mixed',
    courses: ['Computer Graphics', 'Human–Computer Interaction (elective)'],
    en: ['Berkeley CS 184 Computer Graphics', 'Stanford CS 147 Introduction to Human-Computer Interaction'],
    note: 'Graphics has cumulative programming assignments; HCI labs are a loop of design, prototype and user testing.',
    labs: [['The eight GAMES101 assignments', 'Rasterisation, geometry, ray tracing, animation — the most popular graphics lab course in China', ''], ['A renderer', 'Write an offline renderer with BRDFs and global illumination, and produce one final image', ''], ['Prototype and usability test', 'Build a prototype in Figma or on the web, test it with five users and record time on task', '']]
  },
  security: {
    type: 'mixed',
    courses: ['Introduction to Information Security', 'Cryptography', 'Systems Security (elective)'],
    en: ['MIT 6.858 Computer Systems Security', 'Berkeley CS 161 Computer Security'],
    note: 'Labs are attack-and-defend ranges: you are given a vulnerable system, you break it, then you fix it.',
    labs: [['SEED Labs', 'More than thirty labs covering buffer overflows, SQL injection, TLS and DNS cache poisoning', ''], ['CTF ranges', 'DVWA, pwn.college, Hack The Box — advance level by level', ''], ['Cryptography programming', 'Implement AES, RSA and SHA-256 and compare byte for byte with the standard library', '']]
  },
  frontier: {
    type: 'lab',
    courses: ['Distributed Systems (elective/graduate)', 'Parallel Computing', 'Introduction to Quantum Computing (elective)'],
    en: ['MIT 6.5840 Distributed Systems', 'Stanford CS 149 Parallel Computing'],
    note: 'Graduate labs are the most demanding: you must pass consistency checks under a fault-injecting test framework.',
    labs: [['The four 6.5840 labs', 'MIT: MapReduce, Raft, KV Raft, sharded KV — each with fault-injection tests', ''], ['Parallel computing labs', 'CS149 / 15-418: SIMD, OpenMP, CUDA, optimising step by step towards peak', ''], ['Quantum computing labs', 'Implement Deutsch–Jozsa and Grover in Qiskit and compare with the classical cost', '']]
  }
};
