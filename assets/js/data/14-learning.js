/* 14 — Learning layer: prerequisites and hands-on tasks
   prereq: what to understand first (used for blind spots and ordering)
   practice: a task worth one evening to one weekend
*/

CS.prereqs = {
  'formal-logic': [],
  'boolean-algebra': [
    'formal-logic'
  ],
  'set-theory': [
    'formal-logic'
  ],
  'godel-incompleteness': [
    'formal-logic',
    'set-theory'
  ],
  'information-theory': [
    'probability-statistics'
  ],
  'probability-statistics': [],
  'turing-machine': [
    'formal-logic'
  ],
  'lambda-calculus': [
    'formal-logic'
  ],
  'computability': [
    'turing-machine',
    'godel-incompleteness'
  ],
  'automata-languages': [
    'set-theory'
  ],
  'complexity-theory': [
    'turing-machine',
    'computability'
  ],
  'algorithm-analysis': [
    'probability-statistics'
  ],
  'sorting-searching': [
    'algorithm-analysis'
  ],
  'graph-algorithms': [
    'data-structures',
    'algorithm-analysis'
  ],
  'dynamic-programming': [
    'algorithm-analysis'
  ],
  'data-structures': [
    'algorithm-analysis'
  ],
  'von-neumann': [],
  'transistor-ic': [],
  'microprocessor': [
    'transistor-ic',
    'von-neumann'
  ],
  'risc-cisc': [
    'microprocessor',
    'compilers'
  ],
  'memory-hierarchy': [
    'von-neumann'
  ],
  'gpu-computing': [
    'microprocessor',
    'memory-hierarchy'
  ],
  'time-sharing': [
    'von-neumann'
  ],
  'unix': [
    'time-sharing',
    'c-language'
  ],
  'processes-threads': [
    'unix'
  ],
  'virtual-memory': [
    'memory-hierarchy',
    'processes-threads'
  ],
  'virtualization': [
    'virtual-memory',
    'unix'
  ],
  'packet-switching': [],
  'tcp-ip': [
    'packet-switching'
  ],
  'ethernet': [
    'packet-switching'
  ],
  'dns': [
    'tcp-ip'
  ],
  'www-http': [
    'tcp-ip',
    'gui-hci'
  ],
  'wireless-mobile': [
    'ethernet',
    'tcp-ip'
  ],
  'fortran': [],
  'lisp': [
    'lambda-calculus'
  ],
  'algol': [
    'fortran'
  ],
  'oop': [
    'algol'
  ],
  'c-language': [
    'algol'
  ],
  'java-jvm': [
    'oop',
    'c-language'
  ],
  'compilers': [
    'automata-languages',
    'algol'
  ],
  'software-crisis': [
    'algol'
  ],
  'waterfall': [
    'software-crisis'
  ],
  'agile': [
    'waterfall'
  ],
  'open-source': [
    'unix',
    'version-control'
  ],
  'version-control': [],
  'relational-model': [
    'set-theory'
  ],
  'sql': [
    'relational-model'
  ],
  'transactions': [
    'relational-model',
    'processes-threads'
  ],
  'nosql': [
    'transactions'
  ],
  'big-data': [
    'nosql',
    'distributed-systems'
  ],
  'distributed-databases': [
    'transactions',
    'consensus'
  ],
  'dartmouth': [
    'formal-logic'
  ],
  'perceptron': [
    'probability-statistics'
  ],
  'expert-systems': [
    'dartmouth'
  ],
  'statistical-learning': [
    'probability-statistics'
  ],
  'deep-learning': [
    'statistical-learning',
    'perceptron'
  ],
  'reinforcement-learning': [
    'statistical-learning',
    'deep-learning'
  ],
  'transformer': [
    'deep-learning'
  ],
  'generative-models': [
    'deep-learning'
  ],
  'sketchpad': [],
  'rendering': [
    'sketchpad'
  ],
  'shaders': [
    'rendering',
    'gpu-computing'
  ],
  'gui-hci': [
    'sketchpad'
  ],
  'vr-ar': [
    'rendering',
    'gui-hci'
  ],
  'public-key': [
    'complexity-theory',
    'probability-statistics'
  ],
  'hash-mac': [
    'public-key'
  ],
  'tls': [
    'hash-mac',
    'tcp-ip'
  ],
  'vulnerabilities': [
    'c-language',
    'tls'
  ],
  'post-quantum': [
    'public-key',
    'quantum-computing'
  ],
  'distributed-systems': [
    'processes-threads',
    'tcp-ip'
  ],
  'consensus': [
    'distributed-systems'
  ],
  'cloud-computing': [
    'virtualization',
    'distributed-systems'
  ],
  'blockchain': [
    'hash-mac',
    'consensus'
  ],
  'quantum-computing': [
    'turing-machine',
    'information-theory'
  ],
  'bioinformatics': [
    'dynamic-programming',
    'deep-learning'
  ]
};

CS.practice = {
  'formal-logic': 'Verify with a truth table that (p→q) ∧ p → q is a tautology, then write a 20-line truth-table printer',
  'boolean-algebra': 'Reduce a four-variable truth table to a minimal sum of products: draw the Karnaugh map, check it with Quine–McCluskey, then build it from Nand gates and run the tests',
  'set-theory': 'Write a program that enumerates decimals in [0,1], constructs one that is not on the list by the diagonal method, and confirms it differs',
  'godel-incompleteness': 'Hand-encode the formula 0=0 as a Gödel number, walking through symbol → number → formula number',
  'information-theory': 'Compute the character entropy of a 1 KB text, compare it with the size after gzip, and explain the gap',
  'probability-statistics': 'Verify the central limit theorem with 100,000 simulations: sum uniform variables, plot the histogram, compare with the normal curve',
  'turing-machine': 'Write a Turing-machine simulator in under 60 lines and have it add 1 to a binary number',
  'lambda-calculus': 'Implement TRUE/FALSE/IF and Church-numeral addition and multiplication using only JS arrow functions',
  'computability': 'Assume halt() exists, construct the contradictory call by diagonalisation, and print each step of the contradiction',
  'automata-languages': 'Hand-write a regex → NFA → DFA converter that supports only tiny languages like a*b',
  'complexity-theory': 'Reduce 3-SAT to independent set: give the construction and check on a small instance that the two answers agree',
  'algorithm-analysis': 'Time the same algorithm at n=1e3…1e6, then use log-log axes to decide whether it is n log n or n²',
  'sorting-searching': 'Implement three-way quicksort and compare it with the built-in sort on data with many duplicate keys',
  'graph-algorithms': 'Run Dijkstra on a real map extract, then re-run it with negative weights and watch it break',
  'dynamic-programming': 'Implement edit distance and print the full table, not just the answer — then trace back the alignment',
  'data-structures': 'Implement a hash table with open addressing, measure the load factor against probe count, and compare with a tree map',
  'von-neumann': 'Write a 30-line interpreter for a tiny stored-program machine: memory holds both instructions and data',
  'transistor-ic': 'Estimate how many transistors a modern GPU has and how many doublings that took since 1971 — check the exponent against Moore’s law',
  'microprocessor': 'Simulate a 5-stage pipeline on paper and count the penalty of a branch misprediction',
  'risc-cisc': 'Hand-assemble the same loop for a 2-address and a 3-address machine, then count instruction bytes fetched',
  'memory-hierarchy': 'Measure the access time of an array with stride 1 versus stride 64, and plot the cliff when entries stop fitting in cache',
  'gpu-computing': 'Write a CUDA kernel that adds two 1M-element arrays and compare its time with the CPU version',
  'time-sharing': 'Write a round-robin scheduler simulator with 3 processes and a 4-tick quantum, and plot their timelines',
  'unix': 'Rebuild a pipeline of five Unix tools with your own short programs, then check the output against the originals',
  'processes-threads': 'Write a program that deadlocks on two mutexes, then fix it with a lock ordering and prove the order holds',
  'virtual-memory': 'Write a page-fault simulator: trace an access pattern, count faults for LRU and FIFO, and compare',
  'virtualization': 'Run the same service in a container and a VM; measure start-up time, memory overhead and isolation',
  'packet-switching': 'Simulate a 6-node network where one node fails mid-transfer; show the packets rerouting',
  'tcp-ip': 'Implement a tiny reliable transport over UDP: sequence numbers, ACKs and retransmission on timeout',
  'ethernet': 'Capture your own traffic and list the MAC addresses in the first 20 frames, marking broadcasts',
  'dns': 'Trace a full resolution with dig +trace for one domain and draw the delegation chain from root to authoritative',
  'www-http': 'Write an HTTP/1.1 server in 100 lines that serves a file, then send a raw request with netcat',
  'wireless-mobile': 'Measure Wi-Fi signal strength across a room, then explain the drop where the door is',
  'fortran': 'Rewrite a 20-line numerical loop from your language of choice in FORTRAN fixed-form, then compare the compiled assembly',
  'lisp': 'Implement a 40-line Lisp interpreter that supports define, lambda, if and arithmetic',
  'algol': 'Write the ALGOL 60 report grammar for a tiny subset in BNF and generate a parser from it',
  'oop': 'Model a small library system twice: with inheritance, then with composition only — compare which one you can change',
  'c-language': 'Write a linked list in C, then deliberately overflow a buffer and watch what valgrind and ASan report',
  'java-jvm': 'Compile a small Java class, disassemble it with javap, and explain what the bytecode actually does',
  'compilers': 'Write a compiler for a tiny expression language down to a stack machine, then run it',
  'software-crisis': 'Take a real project’s bug list and classify each bug by which phase should have caught it — then say what you would change',
  'waterfall': 'Write a one-page plan for a small feature in waterfall style, then rewrite it as two-week iterations; note what became unknowable',
  'agile': 'Run a two-week iteration on your own project: board, daily notes, review — and record what the process did not catch',
  'open-source': 'Pick a small open-source project, read its licence, and send one documentation fix through the full PR process',
  'version-control': 'Rebuild the same three-branch history twice: once with merge commits, once rebased — then argue which is easier to audit',
  'relational-model': 'Take a spreadsheet and express five of its questions as relational algebra, then as SQL — compare which one hid the work',
  'sql': 'Write the same query three ways (join, subquery, window function) and compare the three query plans',
  'transactions': 'Open two database sessions, reproduce a lost update under read committed, then fix it with the right isolation level',
  'nosql': 'Model one feature (a comment thread) in a relational schema and in a document store, then list what each makes hard',
  'big-data': 'Run word count on a 1 GB file with MapReduce and with Spark; compare wall-clock time and bytes shuffled',
  'distributed-databases': 'Split a small table across three nodes by hash, then run a cross-shard join by hand and count the round trips',
  'dartmouth': 'Write a 30-line solver for the missionaries and cannibals puzzle using breadth-first search, then add a heuristic',
  'perceptron': 'Train a perceptron by hand on AND, OR and XOR; show why the third cannot converge',
  'expert-systems': 'Encode 15 rules for a small domain into a forward-chaining engine, then find an input that makes it contradict itself',
  'statistical-learning': 'Train a decision tree and an SVM on the same small dataset; plot the bias–variance difference as you change the data size',
  'deep-learning': 'Train a tiny CNN on MNIST, then remove the convolutions and compare accuracy and parameter count',
  'reinforcement-learning': 'Implement Q-learning on a 5×5 grid world and plot the learned policy after 1000 episodes',
  'transformer': 'Implement single-head self-attention in 20 lines of NumPy and verify the output shape and the causal mask',
  'generative-models': 'Train a tiny VAE on MNIST and look at reconstructions versus samples — explain the difference',
  'sketchpad': 'Build a tiny constraint solver: two segments that must stay perpendicular while you drag one endpoint',
  'rendering': 'Render the same scene with a rasteriser and a ray tracer; compare time and one visual artefact each',
  'shaders': 'Write a fragment shader that produces a procedural checkerboard, then add one light and one shadow',
  'gui-hci': 'Prototype the same task in two interfaces (command line and GUI) and measure time-to-completion on five people',
  'vr-ar': 'Build a WebXR scene on your phone, then measure frame time and explain why latency causes nausea',
  'public-key': 'Implement Diffie–Hellman over a small prime by hand, then exchange a message with a classmate',
  'hash-mac': 'Break a toy 24-bit hash by brute force, then redo it with a salted hash and compare the effort',
  'tls': 'Run openssl s_client against a site, dump the certificate chain and explain each hop of trust',
  'vulnerabilities': 'Reproduce a classic buffer overflow in a sandboxed VM, then recompile with stack protection and retry',
  'post-quantum': 'Swap one key exchange in a test server to hybrid X25519 + ML-KEM and confirm both sides agree',
  'distributed-systems': 'Run two processes on one machine with an artificial network delay and an injected partition; log what each believes',
  'consensus': 'Implement Raft leader election for three nodes and force two failovers, checking the log stays identical',
  'cloud-computing': 'Deploy the same small service three ways (VM, container, serverless) and compare cold start, cost and control',
  'blockchain': 'Build a 100-line blockchain with proof of work and then rewrite a block to see the chain reject it',
  'quantum-computing': 'Run a Bell-state circuit on a simulator, then explain why measuring one qubit fixes the other',
  'bioinformatics': 'Align two short protein sequences with Needleman–Wunsch by hand and check against Biopython'
};
