/* ============================================================
   CS Atlas — data core
   Domains, main learning paths and the global registry.
   Topic data lives in files 01–13.
   ============================================================ */
window.CS = window.CS || {};
var CS = window.CS;

/* Global registry: topic files 01–13 call CS.addTopics([...]) */
CS.topics = CS.topics || [];
CS.addTopics = function (list) { CS.topics = CS.topics.concat(list); };

CS.domains = [
  {
    id: 'foundations', name: 'Foundations & Mathematics',
    color: '#5b8def',
    short: 'The grammar and limits of computation',
    blurb: 'Before machines existed, logicians were already designing reasoning that could be executed mechanically. This domain provides the coordinate system for the whole map: what a proof is, what infinity is, what information is — and where computation itself runs out.',
    start: 'formal-logic'
  },
  {
    id: 'theory', name: 'Theory of Computation',
    color: '#8b6cf0',
    short: 'What can be computed, and how fast',
    blurb: 'Turing machines and lambda calculus define computation itself; automata capture what a machine can remember; complexity theory asks why some problems have answers we can never wait for.',
    start: 'turing-machine'
  },
  {
    id: 'algorithms', name: 'Algorithms & Data Structures',
    color: '#17a58f',
    short: 'Solving problems with finite resources',
    blurb: 'Algorithms are the heart of computer science. Sorting, graph search, dynamic programming and clever data organisation form the shared toolbox behind everything from compilers to recommendation systems.',
    start: 'algorithm-analysis'
  },
  {
    id: 'architecture', name: 'Computer Architecture',
    color: '#c98a2b',
    short: 'Turning logic into silicon',
    blurb: 'From relays and vacuum tubes to transistors and integrated circuits, we learned to carve logic out of sand. Architecture asks how much computation you can buy with a given die area, power budget and clock.',
    start: 'von-neumann'
  },
  {
    id: 'systems', name: 'Operating Systems',
    color: '#e0525c',
    short: 'The first layer above the hardware',
    blurb: 'Processes, virtual memory, files and containers: the operating system turns one bare machine into many isolated worlds that can be used at once. It is also the starting point for understanding everything above it.',
    start: 'unix'
  },
  {
    id: 'network', name: 'Computer Networks',
    color: '#2b8fd8',
    short: 'Making independent machines talk',
    blurb: 'Packet switching broke a centralised telephone network into countless autonomous networks, and layered protocols let machines from different vendors and media interconnect. The Internet is the largest undesigned system in engineering history.',
    start: 'packet-switching'
  },
  {
    id: 'languages', name: 'Programming Languages & Compilers',
    color: '#d24d9c',
    short: 'How humans express intent to machines',
    blurb: 'From machine code to functional, object-oriented and typed languages, programming languages are the interface between people and machines. Compilers translate intent into instructions silicon can run — and quietly optimise along the way.',
    start: 'fortran'
  },
  {
    id: 'engineering', name: 'Software Engineering',
    color: '#6f9b34',
    short: 'When a program becomes infrastructure',
    blurb: 'One person\'s program is a craft; ten thousand people\'s program is engineering. Software engineering deals with what scale brings: requirements, collaboration, versions, testing, delivery — and keeping a system changeable years later.',
    start: 'software-crisis'
  },
  {
    id: 'data', name: 'Data & Databases',
    color: '#b8912a',
    short: 'Storing the world durably, concurrently, queryably',
    blurb: 'The relational model unified data as a table; transactions make concurrent writes as reliable as serial ones. Today\'s data systems must answer both \'what is it\' and \'why\' at global scale.',
    start: 'relational-model'
  },
  {
    id: 'ai', name: 'Artificial Intelligence',
    color: '#9b59d0',
    short: 'Making machines perceive, reason and generate',
    blurb: 'From the Dartmouth workshop to models that write code, draw and converse, AI has passed through symbolic ambition, a connectionist winter and the deep-learning surge. It is still answering the same question: can intelligence be computed?',
    start: 'dartmouth'
  },
  {
    id: 'interaction', name: 'Graphics & Human–Computer Interaction',
    color: '#2a8fa8',
    short: 'Making computation visible, touchable, usable',
    blurb: 'Computers began without screens. Graphics invented pixels, lighting and real-time rendering; HCI invented the mouse, the window and touch. Today we understand machines through graphics and interfaces — and they understand us through them too.',
    start: 'gui-hci'
  },
  {
    id: 'security', name: 'Security & Cryptography',
    color: '#d2552b',
    short: 'Building trust in an untrusted world',
    blurb: 'Cryptography uses mathematics to turn secrets into things that can be sent in the open; systems security hunts for holes in implementations, protocols and people. It is an endless arms race, and the precondition for any networked system.',
    start: 'public-key'
  },
  {
    id: 'frontier', name: 'Distributed Systems & Frontiers',
    color: '#2f9e8f',
    short: 'Many machines working as one',
    blurb: 'When one machine is not fast enough, reliable enough or close enough, computation goes distributed. Consensus, cloud, blockchains and quantum computing are rewriting what "a computer" even means.',
    start: 'distributed-systems'
  }
];

CS.paths = [
  {
    id: 'logic-to-machines',
    title: 'From Logic to Machines',
    blurb: 'A road from Aristotle to Turing: how people wrote reasoning down as formal rules, and then discovered the limits of those rules.',
    level: 'Theory',
    steps: ['formal-logic', 'set-theory', 'godel-incompleteness', 'turing-machine', 'computability', 'complexity-theory']
  },
  {
    id: 'silicon-to-cloud',
    title: 'From Transistor to Cloud',
    blurb: 'How computing went from vacuum tubes in one room to data centres around the world — hardware, abstraction and scale in three movements.',
    level: 'Systems',
    steps: ['transistor-ic', 'von-neumann', 'microprocessor', 'memory-hierarchy', 'virtualization', 'cloud-computing']
  },
  {
    id: 'arpanet-to-web',
    title: 'From ARPANET to the Web',
    blurb: 'How a group of people trying to connect computers accidentally built the infrastructure modern society runs on.',
    level: 'Networks',
    steps: ['packet-switching', 'tcp-ip', 'ethernet', 'dns', 'www-http', 'wireless-mobile']
  },
  {
    id: 'perceptron-to-llm',
    title: 'From Perceptron to LLM',
    blurb: 'Two winters and three waves: seventy years of machine learning as one long experiment in representation, data and compute.',
    level: 'Intelligence',
    steps: ['dartmouth', 'perceptron', 'expert-systems', 'statistical-learning', 'deep-learning', 'transformer']
  },
  {
    id: 'code-to-software',
    title: 'From Code to Software',
    blurb: 'When a program grows from one person’s draft into infrastructure for millions, how does engineering answer scale, time and people?',
    level: 'Engineering',
    steps: ['fortran', 'algol', 'oop', 'software-crisis', 'agile', 'open-source']
  }
];
