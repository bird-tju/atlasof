/* 02 — Theory of computation */
CS.addTopics([

  {
    id: 'turing-machine',
    name: 'Turing Machine',
    domain: 'theory',
    year: 1936,
    tags: ['Computability', 'Model', 'Universal machine'],
    summary: 'An infinite tape, a read/write head and a table of states: the precise model of computability and the blueprint of the general-purpose computer.',
    body: ['In 1936, answering Hilbert’s decision problem, Turing defined an abstract machine: the tape is divided into cells, a read/write head can read, write and move left or right, and the next action is fixed by the current state and the symbol read. Any function computable by such a machine counted as “computable”.', 'He also built the universal Turing machine: encode another machine’s description on the tape and it simulates it. That is precisely the theoretical prototype of the stored-program computer. Church gave an equivalent definition with the lambda calculus almost at the same time, and together they support the Church–Turing thesis: anything intuitively computable can be computed by a Turing machine.'],
    milestones: [
      [1936, 'On Computable Numbers', 'The Turing machine — and the universal Turing machine — are born.', 1],
      [1936, 'Church introduces the lambda calculus', 'An equivalent model of computability, built from function abstraction.'],
      [1945, 'von Neumann\'s EDVAC report', 'Turns the universal Turing machine into a stored-program architecture.'],
      [1950, 'The Turing test', 'Puts an operational definition of intelligence on the table.']
    ],
    concepts: [['Tape and states', 'Finite state plus unbounded storage: the smallest model of computation.'], ['Universal Turing machine', 'A machine that simulates any other — the theoretical prototype of an interpreter.'], ['Church–Turing thesis', 'Every effectively computable function is computable by a Turing machine; a thesis, not a theorem.']],
    people: [['Alan Turing', '1912 – 1954', 'Turing machine, codebreaking and the Turing test.'], ['Alonzo Church', '1903 – 1995', 'Lambda calculus and computability theory.']],
    related: ['lambda-calculus', 'computability', 'von-neumann'],
    reading: [['On Computable Numbers, with an Application to the Entscheidungsproblem', 'Alan Turing', '1936'], ['Computing Machinery and Intelligence', 'Alan Turing', '1950']],
    practice: 'Write a Turing-machine simulator in under 60 lines and have it add 1 to a binary number'
  },

  {
    id: 'lambda-calculus',
    name: 'Lambda Calculus',
    domain: 'theory',
    year: 1936,
    tags: ['Functions', 'Reduction', 'Types'],
    summary: 'Abstraction and application alone can express computation — which is why the lambda calculus became the mathematical foundation of functional languages.',
    body: ['Church proposed the lambda calculus in 1936: everything is a function and computation is reduction. λx.x+1 is the add-one function, and (λx.x+1) 2 reduces to 3. Church encodings represent numbers, Booleans and data structures with pure functions, showing that this tiny system is as powerful as a Turing machine.', 'Its value goes beyond computability. It gave birth to LISP, ML and Haskell, and it carries type theory and program semantics. Simply typed lambda calculus corresponds to intuitionistic logic, and the Curry–Howard correspondence identifies programs with proofs — writing a well-typed program is constructing a proof of a theorem.'],
    milestones: [
      [1936, 'Church introduces the lambda calculus', 'An equivalent model of computability, built from function abstraction.', 1],
      [1940, 'Simply typed lambda calculus', 'Church adds types to avoid paradoxes.'],
      [1958, 'LISP appears', 'McCarthy designs it at MIT, bringing the lambda calculus into programming languages.'],
      [1969, 'Curry–Howard correspondence', 'Programs and proofs are shown to be the same kind of object.'],
      [1970, 'Denotational semantics', 'Scott builds a model of the lambda calculus from domain theory.']
    ],
    concepts: [['α / β reduction', 'Renaming bound variables, and applying a function to an argument.'], ['Higher-order functions', 'Functions as arguments and results: the basic unit of composition.'], ['Church encodings', 'Representing numbers, Booleans and lists with nothing but functions.']],
    people: [['Alonzo Church', '1903 – 1995', 'Inventor of the lambda calculus.'], ['Haskell Curry', '1900 – 1982', 'Combinatory logic and the Curry–Howard correspondence.']],
    related: ['turing-machine', 'lisp', 'compilers'],
    reading: [['Introduction to Combinators and λ-Calculus', 'Hindley & Seldin', '1986'], ['The Implementation of Functional Programming Languages', 'Simon Peyton Jones', '1987']],
    practice: 'Implement TRUE/FALSE/IF and Church-numeral addition and multiplication using only JS arrow functions'
  },

  {
    id: 'computability',
    name: 'Computability & the Halting Problem',
    domain: 'theory',
    year: 1936,
    tags: ['Undecidable', 'Reduction', 'Limits'],
    summary: 'The halting problem proves that no general algorithm can decide whether an arbitrary program terminates. The computable world has hard edges.',
    body: ['Having defined the Turing machine, Turing used it at once to prove the decision problem unsolvable: assume a machine H that decides whether any program P halts on input x; build a program D that halts exactly when H says it does not. The contradiction shows the halting problem is undecidable.', 'This is more than a technical result. It says some problems are not merely hard — they have no algorithmic solution at all. Rice’s theorem sharpens it: any non-trivial semantic property of programs is undecidable. In practice a compiler cannot decide every infinite loop exactly, static analysis must approximate, and a “clever enough” termination proof always needs a person.'],
    milestones: [
      [1936, 'The halting problem is undecidable', 'The diagonal argument, applied to programs.', 1],
      [1936, 'The Entscheidungsproblem has no solution', 'Hilbert\'s programme is proved impossible.'],
      [1953, 'Rice\'s theorem', 'Every non-trivial semantic property of programs is undecidable.'],
      [1970, 'Recursion theory takes shape', 'Computability becomes a branch of its own.']
    ],
    concepts: [['Decidability', 'An algorithm exists that answers yes or no for every input in finite time.'], ['Reduction', 'Turn problem A into problem B so that a solution to B solves A.'], ['Recursively enumerable', 'A set whose elements a Turing machine can enumerate — wider than decidable.']],
    people: [['Alan Turing', '1912 – 1954', 'Used the diagonal method to prove the halting problem undecidable.'], ['Emil Post', '1897 – 1954', 'Independently developed computability and the decision problem.']],
    related: ['turing-machine', 'godel-incompleteness', 'complexity-theory'],
    reading: [['Computability and Unsolvability', 'Martin Davis', '1958']],
    practice: 'Assume halt() exists, construct the contradictory call by diagonalisation, and print each step of the contradiction'
  },

  {
    id: 'automata-languages',
    name: 'Automata & Formal Languages',
    domain: 'theory',
    year: 1943,
    tags: ['Grammar', 'Parsing', 'State machines'],
    summary: 'Growing out of neuron models and formal grammar, automata theory classifies languages by how much a machine can remember.',
    body: ['In 1943 McCulloch and Pitts described neurons with logic; in 1951 Kleene proved regular expressions equivalent to finite automata. In 1956 Chomsky proposed the hierarchy: regular, context-free, context-sensitive and recursively enumerable languages, corresponding to machines of increasing power.', 'That hierarchy became the skeleton of the compiler: lexical analysis uses finite automata, parsing uses pushdown automata, and context-free grammars correspond directly to syntax trees. It also turned parsing from craft into a science with provable properties — whether a grammar is ambiguous, whether a language is regular, both have decision procedures.'],
    milestones: [
      [1943, 'The McCulloch–Pitts neuron', 'Neural activity described with logic gates.'],
      [1951, 'Kleene\'s theorem', 'Regular expressions and finite automata are equivalent.'],
      [1956, 'The Chomsky hierarchy', 'Formal languages classified by generative power.', 1],
      [1965, 'LR parsing', 'Knuth defines a grammar class that can be parsed efficiently.']
    ],
    concepts: [['Finite automaton', 'Finitely many states; recognises regular languages.'], ['Context-free grammar', 'Recursive rules that generate nested structure; the basis of parsing.'], ['Pushdown automaton', 'Finite states plus a stack; recognises context-free languages.']],
    people: [['Noam Chomsky', '1928 – ', 'The formal-language hierarchy and generative grammar.'], ['Stephen Kleene', '1909 – 1994', 'Regular expressions and automata theory.']],
    related: ['compilers', 'turing-machine', 'complexity-theory'],
    reading: [['Introduction to Automata Theory, Languages, and Computation', 'Hopcroft & Ullman', '1979'], ['Three Models for the Description of Language', 'Noam Chomsky', '1956']],
    practice: 'Hand-write a regex → NFA → DFA converter that supports only tiny languages like a*b'
  },

  {
    id: 'complexity-theory',
    name: 'Computational Complexity',
    domain: 'theory',
    year: 1965,
    tags: ['P vs NP', 'Reduction', 'Lower bounds'],
    summary: 'Computable is not the same as affordable. Complexity theory asks how much time and space a problem needs — and whether P equals NP.',
    body: ['In 1965 Cobham and Edmonds separately proposed polynomial time as the rough standard for an efficient algorithm. In 1971 Cook proved that Boolean satisfiability (SAT) is NP-complete: every NP problem reduces to it in polynomial time. Karp’s 21 problems in 1972 showed how widespread that difficulty is.', 'P vs NP is still open and is one of the Millennium Prize problems. Complexity theory also draws a finer picture: randomised algorithms, interactive proofs, approximation and parameterised algorithms are all ways out when exact solutions are too hard. And the security of cryptography rests precisely on some problems staying hard.'],
    milestones: [
      [1965, 'Polynomial time as the yardstick', 'Proposed independently by Cobham and Edmonds.'],
      [1971, 'Cook\'s theorem', 'SAT is NP-complete.', 1],
      [1972, 'Karp\'s 21 problems', 'NP-completeness turns out to be everywhere.'],
      [1992, 'The PCP theorem', 'A deep link between approximation and proof verification.'],
      [2000, 'P vs NP becomes a Millennium Problem', 'A one-million-dollar prize on the table.']
    ],
    concepts: [['P and NP', 'Solvable in polynomial time, versus verifiable in polynomial time.'], ['NP-complete', 'The hardest problems in NP; SAT is the first example.'], ['Complexity class', 'A set of problems grouped by the resources they need: time, space, randomness.']],
    people: [['Stephen Cook', '1939 – ', 'Proved the NP-completeness of SAT.'], ['Richard Karp', '1935 – ', 'Showed with 21 problems how common NP-completeness is.']],
    related: ['turing-machine', 'boolean-algebra', 'algorithm-analysis', 'public-key'],
    reading: [['Computers and Intractability', 'Garey & Johnson', '1979'], ['Computational Complexity: A Modern Approach', 'Arora & Barak', '2009']],
    practice: 'Reduce 3-SAT to independent set: give the construction and check on a small instance that the two answers agree'
  }

]);
