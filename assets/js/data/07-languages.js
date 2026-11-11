/* 07 — Programming languages and compilers */
CS.addTopics([

  {
    id: 'fortran',
    name: 'FORTRAN',
    domain: 'languages',
    year: 1957,
    tags: ['Scientific computing', 'Compilers', 'High-level languages'],
    summary: 'The first widely used high-level language, and the proof that a compiler could match hand-written assembly.',
    body: ['In the 1950s scientific code was written directly in assembly: hard to port and easy to get wrong. Backus proposed FORTRAN (formula translation) at IBM in 1954, and the compiler shipped in 1957 producing code close to hand-written assembly. That settled the doubt that high-level languages must be slow.', 'FORTRAN introduced variables, arrays, loops and subroutines, and optimised for numerical work. Its standards kept evolving: FORTRAN 77, then Fortran 90 with modules and array operations, and it is still alive in high-performance computing and climate modelling. It proved one thing: abstraction need not cost performance.'],
    milestones: [
      [1954, 'The FORTRAN proposal', 'Backus starts it at IBM.', 'undefined'],
      [1957, 'The FORTRAN compiler ships', 'The first widely used high-level language.', 1],
      [1966, 'The first standard', 'FORTRAN 66.', 'undefined'],
      [1977, 'FORTRAN 77', 'Structured control flow.', 'undefined'],
      [1990, 'Fortran 90', 'Modules, array operations and free-form source.', 'undefined']
    ],
    concepts: [['Compiler optimisation', 'Translating loops and arrays of a high-level language into efficient machine code.'], ['Numerical computing', 'Floating point and arrays — Fortran’s home ground.'], ['Backwards compatibility', 'Decades-old scientific code still compiles and runs.']],
    people: [['John Backus', '1924 – 2007', 'Proposed FORTRAN; a pioneer of functional programming.'], ['Frances Allen', '1932 – 2020', 'A pioneer of compiler optimisation.']],
    related: ['compilers', 'algol', 'gpu-computing'],
    reading: [['The FORTRAN Automatic Coding System', 'Backus & Heising', '1957'], ['Modern Fortran', 'Stephen Chapman', '2018']],
    practice: 'Rewrite a 20-line numerical loop from your language of choice in FORTRAN fixed-form, then compare the compiled assembly'
  },

  {
    id: 'lisp',
    name: 'LISP & Functional Programming',
    domain: 'languages',
    year: 1958,
    tags: ['Functions', 'Symbols', 'Macros'],
    summary: 'Code is data, recursion is computation. LISP brought the lambda calculus into engineering — and gave us garbage collection and the REPL.',
    body: ['In 1958 McCarthy designed LISP at MIT, initially for symbolic differentiation and AI research. S-expressions represent both code and data, and eval lets a program build and run programs. That homoiconicity is what makes macros possible.', 'LISP also gave us much of today’s infrastructure: McCarthy proposed garbage collection in 1960, the REPL made interactive development a habit, and Scheme brought tail calls and lexical scope into teaching. Clojure and Racket continue the line, and many of JavaScript’s design choices trace back to it.'],
    milestones: [
      [1958, 'LISP appears', 'McCarthy designs it at MIT, bringing the lambda calculus into programming languages.', 1],
      [1960, 'Garbage collection', 'The beginning of automatic memory management.', 'undefined'],
      [1975, 'Scheme', 'A minimalist Lisp dialect.', 'undefined'],
      [1984, 'Common Lisp', 'A large, standardised Lisp.', 'undefined'],
      [2007, 'Clojure', 'A modern Lisp on the JVM.', 'undefined']
    ],
    concepts: [['S-expressions', 'Code and data in one uniform notation of parentheses and prefixes.'], ['Homoiconicity', 'A program can be read, modified and generated like data.'], ['Macros', 'Transform code at compile time and extend the syntax of the language.']],
    people: [['John McCarthy', '1927 – 2011', 'Inventor of LISP; a pioneer of AI.'], ['Guy Steele', '1954 – ', 'Co-designer of Scheme; parallelism and language design.']],
    related: ['lambda-calculus', 'compilers', 'java-jvm'],
    reading: [['Structure and Interpretation of Computer Programs', 'Abelson & Sussman', '1985'], ['LISP 1.5 Programmer’s Manual', 'McCarthy et al.', '1962']],
    practice: 'Implement a 40-line Lisp interpreter that supports define, lambda, if and arithmetic'
  },

  {
    id: 'algol',
    name: 'ALGOL & Structured Programming',
    domain: 'languages',
    year: 1958,
    tags: ['Syntax', 'Block structure', 'BNF'],
    summary: 'ALGOL defined the syntax of modern languages: block structure, lexical scope and BNF, all still with us.',
    body: ['In 1958 computer scientists from Europe and the US formed a committee to design a universal algorithmic language. ALGOL 58 set out the concepts, and ALGOL 60 delivered a full report: block structure, recursion, lexical scope, pass-by-value and BNF syntax. It was no commercial success, yet every later language was designed against it.', 'The ALGOL 60 report ran to a dozen pages and was extremely precise. It gave rise to structured programming, compiler theory — parsing above all — and formal semantics. Pascal, C and Ada all inherit its syntactic tradition. And in 1968 Dijkstra’s “goto considered harmful” pushed structured control flow into the mainstream.'],
    milestones: [
      [1958, 'ALGOL 58', 'An international committee starts the design.', 'undefined'],
      [1960, 'The ALGOL 60 report', 'BNF, block structure and lexical scope.', 1],
      [1968, 'Dijkstra on goto', 'A manifesto for structured programming.', 'undefined'],
      [1970, 'Pascal', 'The model teaching language.', 'undefined']
    ],
    concepts: [['Block structure', 'Scope and lifetime delimited by begin/end.'], ['Lexical scope', 'A variable’s visibility follows the nesting of the source text.'], ['BNF', 'A formal notation describing syntax with productions.']],
    people: [['Peter Naur', '1926 – 2016', 'The ALGOL 60 report and compiler theory.'], ['Edsger Dijkstra', '1930 – 2002', 'Structured programming and shortest paths.']],
    related: ['fortran', 'c-language', 'compilers'],
    reading: [['Revised Report on the Algorithmic Language ALGOL 60', 'Naur et al.', '1960'], ['Notes on Structured Programming', 'Edsger Dijkstra', '1968']],
    practice: 'Write the ALGOL 60 report grammar for a tiny subset in BNF and generate a parser from it'
  },

  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    domain: 'languages',
    year: 1967,
    tags: ['Objects', 'Inheritance', 'Polymorphism'],
    summary: 'Bundle data with the operations on it and organise complexity with inheritance and polymorphism: objects changed how software is designed.',
    body: ['In 1967 Simula 67 in Norway introduced classes and objects for simulation work: state and behaviour bundled together, reused through inheritance. In 1972 Alan Kay designed Smalltalk at Xerox PARC, emphasising message passing rather than function calls, and wrapped the whole development environment in a graphical interface.', 'In the 1980s C++ carried objects into systems programming; in 1995 Java lowered the barrier with a virtual machine and garbage collection. UML and design patterns then turned OOP into an engineering methodology. Today objects are no longer the only paradigm, but encapsulation, composition and polymorphism remain the basic tools for organising large codebases.'],
    milestones: [
      [1967, 'Simula 67', 'Where classes and inheritance begin.', 1],
      [1972, 'Smalltalk', 'Message passing and a pure object environment.', 'undefined'],
      [1983, 'C++', 'Objects enter systems programming.', 'undefined'],
      [1995, 'Java', 'Portability and garbage collection.', 'undefined'],
      [1994, 'Design Patterns', 'The GoF formalise experience.', 'undefined']
    ],
    concepts: [['Encapsulation', 'Hide internal state and expose only a stable interface.'], ['Inheritance', 'Extend or override behaviour on top of an existing class.'], ['Polymorphism', 'One interface, different implementations per type.']],
    people: [['Ole-Johan Dahl', '1931 – 2002', 'A founder of Simula and of object orientation.'], ['Alan Kay', '1940 – ', 'Smalltalk, and the populariser of the term “object-oriented”.']],
    related: ['c-language', 'java-jvm', 'software-crisis'],
    reading: [['Design Patterns', 'Gamma et al.', '1994'], ['Smalltalk-80: The Language and its Implementation', 'Goldberg & Robson', '1983']],
    practice: 'Model a small library system twice: with inheritance, then with composition only — compare which one you can change'
  },

  {
    id: 'c-language',
    name: 'The C Programming Language',
    domain: 'languages',
    year: 1972,
    tags: ['Systems programming', 'Pointers', 'Portability'],
    summary: 'Close to the hardware, portable, abstract enough: C became the lingua franca of operating systems, compilers and embedded devices.',
    body: ['In 1972 Ritchie designed C at Bell Labs to rewrite Unix. It inherited the economy of B and BCPL and added types and structs. In 1978 Kernighan and Ritchie published The C Programming Language, which served both as a textbook and as the de facto standard.', 'C’s philosophy is to trust the programmer: pointers address memory directly, arrays are unchecked, conversions are free. That made it fast and flexible — and made buffer overflows the dominant vulnerability for decades. ANSI C standardised it in 1989, and C is still the first choice for kernels, embedded systems and high-performance libraries.'],
    milestones: [
      [1972, 'C is created', 'Designed to rewrite Unix.', 1],
      [1978, 'The K&R book', 'The de facto standard.', 'undefined'],
      [1989, 'C89', 'Standardised by ANSI.', 'undefined'],
      [1999, 'C99', 'Variable-length arrays and inline functions.', 'undefined'],
      [2022, 'C23', 'A modern revision.', 'undefined']
    ],
    concepts: [['Pointers', 'Holding a memory address directly: flexible, and dangerous.'], ['Manual memory management', 'malloc/free hand lifetime decisions to the programmer.'], ['Undefined behaviour', 'The standard says nothing about the result, so the compiler may optimise freely.']],
    people: [['Dennis Ritchie', '1941 – 2011', 'Creator of C and Unix.'], ['Brian Kernighan', '1942 – ', 'Co-author of The C Programming Language.']],
    related: ['unix', 'compilers', 'vulnerabilities'],
    reading: [['The C Programming Language', 'Kernighan & Ritchie', '1978'], ['C Traps and Pitfalls', 'Andrew Koenig', '1988']],
    practice: 'Write a linked list in C, then deliberately overflow a buffer and watch what valgrind and ASan report'
  },

  {
    id: 'java-jvm',
    name: 'Java & the JVM',
    domain: 'languages',
    year: 1995,
    tags: ['Bytecode', 'JIT', 'Portability'],
    summary: 'Write once, run anywhere: Java hid platform differences behind bytecode and a virtual machine.',
    body: ['In 1991 Sun’s Green project designed Oak for consumer electronics; in 1995 it shipped as Java. Java compiles to bytecode, which the JVM interprets or just-in-time compiles. Garbage collection freed developers from manual memory management, and a large standard library plus enterprise frameworks made it the default for big systems.', 'The JVM’s real contribution is the idea of a runtime: bytecode runs on different hardware, a JIT optimises hot code using runtime information, and Android’s ART follows the same path. Today Kotlin, Scala and Clojure share the JVM ecosystem, proof that a virtual machine can be a platform for many languages.'],
    milestones: [
      [1991, 'Project Oak', 'Designed for consumer electronics.', 'undefined'],
      [1995, 'Java is released', 'Write once, run anywhere.', 1],
      [1996, 'JDK 1.0', 'The first official release.', 'undefined'],
      [2006, 'HotSpot goes open source', 'JIT compilation and runtime optimisation.', 'undefined'],
      [2008, 'Android', 'Java reaches mobile.', 'undefined']
    ],
    concepts: [['Bytecode', 'An intermediate instruction set aimed at a virtual machine.'], ['JIT', 'Compiling hot bytecode to native code at run time.'], ['Garbage collection', 'Automatically reclaiming objects that are no longer reachable.']],
    people: [['James Gosling', '1955 – ', 'The father of Java.'], ['Bill Joy', '1954 – ', 'Co-founder of Sun; involved in BSD and vi.']],
    related: ['oop', 'compilers', 'distributed-systems'],
    reading: [['Thinking in Java', 'Bruce Eckel', '1998'], ['Inside the Java Virtual Machine', 'Bill Venners', '1997']],
    practice: 'Compile a small Java class, disassemble it with javap, and explain what the bytecode actually does'
  },

  {
    id: 'compilers',
    name: 'Compilers & Optimization',
    domain: 'languages',
    year: 1952,
    tags: ['Translation', 'Intermediate representation', 'Optimisation'],
    summary: 'Compilers translate intent into machine instructions and optimise along the way — one of computer science’s most mature pieces of engineering.',
    body: ['In 1952 Grace Hopper’s A-0 system translated symbolic code into machine code and is regarded as the forerunner of the compiler. In 1957 the FORTRAN compiler showed that generated code could compete with hand-written assembly. In the 1960s Chomsky’s formal-language theory gave lexical and syntactic analysis its mathematical basis.', 'A modern compiler is usually split into a front end (lexing, parsing, semantics), a middle end (intermediate representation and optimisation) and a back end (instruction selection, register allocation). SSA form, data-flow analysis and loop optimisation are its core. In 2000 LLVM modularised the infrastructure, and today JIT compilation and machine-learning-driven heuristics are changing how optimisation is done.'],
    milestones: [
      [1952, 'The A-0 system', 'A compiler pioneer.', 'undefined'],
      [1957, 'A FORTRAN compiler', 'Generated code reaches usable speed.', 1],
      [1960, 'Parsing theory', 'LL and LR analysis mature.', 'undefined'],
      [1986, 'The Dragon Book', 'The classic compiler textbook.', 'undefined'],
      [2000, 'LLVM', 'Modular compiler infrastructure.', 'undefined']
    ],
    concepts: [['Lexical analysis', 'Cutting a character stream into tokens, usually with a finite automaton.'], ['Intermediate representation', 'A program form independent of both source language and target machine, convenient for optimisation.'], ['SSA', 'Each variable is assigned once, which simplifies data-flow analysis.']],
    people: [['Grace Hopper', '1906 – 1992', 'A pioneer of compilers and COBOL.'], ['Frances Allen', '1932 – 2020', 'Optimising compilers and parallelisation.']],
    related: ['algol', 'c-language', 'risc-cisc'],
    reading: [['Compilers: Principles, Techniques, and Tools', 'Aho, Lam, Sethi & Ullman', '1986'], ['Advanced Compiler Design and Implementation', 'Steven Muchnick', '1997']],
    practice: 'Write a compiler for a tiny expression language down to a stack machine, then run it'
  }

]);
