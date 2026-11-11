/* 13 — Distributed systems and the frontier */
CS.addTopics([

  {
    id: 'distributed-systems',
    name: 'Distributed Systems',
    domain: 'frontier',
    year: 1978,
    tags: ['Partial failure', 'Clocks', 'Replication'],
    summary: 'Many machines cooperating over a network must still behave like one, despite latency, failures and unsynchronised clocks.',
    body: ['In 1978 Lamport proposed logical clocks: if you cannot rely on a physical clock for absolute order, define “before” from causality between events. In 1982 he, Shostak and Pease posed the Byzantine generals problem and showed how many nodes are needed to reach agreement in the presence of traitors.', 'The core difficulty of distributed systems is partial failure: you can never tell whether a machine is slow, dead or cut off by the network. CAP, the FLP impossibility result, idempotence and retries, timeouts and backpressure are all answers to that reality. Today microservices, global databases and edge computing put these thirty-year-old theoretical problems in front of every engineer.'],
    milestones: [
      [1978, 'Logical clocks', 'Causality and partial order.', 1],
      [1982, 'The Byzantine generals problem', 'Agreement with faulty nodes.', 'undefined'],
      [1985, 'The FLP impossibility result', 'The limit of consensus in asynchronous systems.', 'undefined'],
      [2000, 'The CAP theorem', 'Consistency, availability, partition tolerance.', 'undefined']
    ],
    concepts: [['Logical clock', 'A counter that captures the causal order between events.'], ['Partial failure', 'Some nodes fail while the rest keeps working.'], ['Consistency model', 'Linearisable, sequential, eventual — contracts about what a reader may see.']],
    people: [['Leslie Lamport', '1941 – ', 'Logical clocks, Paxos and LaTeX.'], ['Barbara Liskov', '1939 – ', 'Abstract data types and the Liskov substitution principle.']],
    related: ['consensus', 'distributed-databases', 'cloud-computing'],
    reading: [['Time, Clocks, and the Ordering of Events in a Distributed System', 'Leslie Lamport', '1978'], ['Distributed Systems: Concepts and Design', 'Coulouris et al.', '1994']],
    practice: 'Run two processes on one machine with an artificial network delay and an injected partition; log what each believes'
  },

  {
    id: 'consensus',
    name: 'Consensus Algorithms',
    domain: 'frontier',
    year: 1998,
    tags: ['Paxos', 'Raft', 'Quorums'],
    summary: 'Getting machines to agree on one value is the shared core of replicated state machines, distributed databases and blockchains.',
    body: ['Lamport wrote Paxos in 1989 but it was not published until 1998. Paxos reaches agreement among a majority in two rounds of voting and tolerates a minority of failures. It is famously hard to understand, and real implementations are usually heavily simplified.', 'In 2014 Ongaro and Ousterhout proposed Raft, splitting consensus into leader election, log replication and safety, and putting comprehensibility first. Raft was adopted by etcd, Consul and TiKV. Today consensus algorithms are the invisible skeleton of cloud infrastructure — every configuration change, every failover runs on one.'],
    milestones: [
      [1989, 'Paxos is written', 'Lamport\'s consensus algorithm.', 'undefined'],
      [1998, 'Paxos is published', 'The paper appears nine years late.', 1],
      [2014, 'Raft', 'Designed for understandability.', 'undefined'],
      [2014, 'etcd adopts Raft', 'The configuration backbone of Kubernetes.', 'undefined']
    ],
    concepts: [['Quorum', 'A majority suffices to commit, tolerating a minority of failures.'], ['Log replication', 'Copy the same sequence of operations to every state machine.'], ['Leader election', 'Choose a new coordinator after the leader fails.']],
    people: [['Leslie Lamport', '1941 – ', 'Author of Paxos.'], ['Diego Ongaro', '1985 – ', 'Co-designer of Raft.']],
    related: ['distributed-systems', 'distributed-databases', 'blockchain'],
    reading: [['Paxos Made Simple', 'Leslie Lamport', '2001'], ['In Search of an Understandable Consensus Algorithm', 'Ongaro & Ousterhout', '2014']],
    practice: 'Implement Raft leader election for three nodes and force two failovers, checking the log stays identical'
  },

  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    domain: 'frontier',
    year: 2006,
    tags: ['Elasticity', 'On demand', 'Infrastructure'],
    summary: 'Turning compute, storage and network into on-demand services gave startups Google-scale elasticity.',
    body: ['In the 1960s time-sharing already imagined computing metered like water and electricity. In 2006 Amazon launched S3 and EC2: a developer with a credit card got storage and virtual machines without buying hardware. Google App Engine, Azure and OpenStack followed.', 'The core of the cloud is virtualisation plus automation: compute, storage and network become APIs billed by use. IaaS, PaaS and SaaS mark the boundaries of responsibility; containers and Kubernetes moved the unit of delivery from the machine to the application. Today the cloud is also AI infrastructure — GPU clusters, object storage and hosted inference decide whether a model can be trained and served.'],
    milestones: [
      [2006, 'AWS S3 / EC2', 'Public cloud goes commercial.', 1],
      [2008, 'Google App Engine', 'An early PaaS.', 'undefined'],
      [2010, 'OpenStack', 'The open-source cloud platform.', 'undefined'],
      [2013, 'Docker', 'The container becomes the unit of development and delivery.', 'undefined'],
      [2014, 'Kubernetes', 'Containers get a de facto orchestrator.', 'undefined']
    ],
    concepts: [['IaaS / PaaS / SaaS', 'Layers of service from infrastructure to platform to software.'], ['Elasticity', 'Scale with load automatically and pay for what you use.'], ['Multi-tenancy', 'Many customers share one physical plant while staying isolated.']],
    people: [['Werner Vogels', '1963 – ', 'Amazon CTO and an early driver of cloud computing.'], ['Andy Jassy', '1968 – ', 'Long-time leader of AWS.']],
    related: ['virtualization', 'distributed-systems', 'big-data'],
    reading: [['Cloudonomics', 'Joe Weinman', '2013'], ['AWS Well-Architected Framework', 'AWS', '2020']],
    practice: 'Deploy the same small service three ways (VM, container, serverless) and compare cold start, cost and control'
  },

  {
    id: 'blockchain',
    name: 'Blockchain & Bitcoin',
    domain: 'frontier',
    year: 2008,
    tags: ['Decentralisation', 'Ledgers', 'Smart contracts'],
    summary: 'Hash chains, consensus and cryptography maintain a tamper-evident ledger with no central authority.',
    body: ['In 2008 a pseudonymous Satoshi Nakamoto published the Bitcoin whitepaper; in 2009 the genesis block appeared. Bitcoin uses proof of work so miners compete for the right to write, the longest-chain rule to settle forks, and public-key addresses for pseudonymous payment. It was the first large-scale permissionless consensus system.', 'In 2013 Ethereum added smart contracts and turned the blockchain into a programmable state machine. DeFi, NFTs and Layer 2 scaling followed, along with fraud, energy use and regulatory argument. Whether blockchain delivers its promise is still debated, but the question it raises — how do mutually distrusting parties agree — is the central question of distributed systems.'],
    milestones: [
      [2008, 'The Bitcoin whitepaper', 'Permissionless consensus.', 1],
      [2009, 'The genesis block', 'The Bitcoin network starts.', 'undefined'],
      [2013, 'Ethereum', 'Smart contracts.', 'undefined'],
      [2015, 'Ethereum mainnet launches', 'A programmable blockchain.', 'undefined'],
      [2022, 'The Merge', 'Ethereum moves from proof of work to proof of stake.', 'undefined']
    ],
    concepts: [['Hash chain', 'Each block contains the previous block’s hash, forming a tamper-evident chain.'], ['Proof of work', 'Compete with compute for the right to write, raising the cost of misbehaviour.'], ['Smart contract', 'A program deployed on chain that executes automatically.']],
    people: [['Satoshi Nakamoto', 'unknown', 'The anonymous creator of Bitcoin.'], ['Vitalik Buterin', '1994 – ', 'Co-founder of Ethereum.']],
    related: ['hash-mac', 'consensus', 'distributed-systems'],
    reading: [['Bitcoin: A Peer-to-Peer Electronic Cash System', 'Satoshi Nakamoto', '2008'], ['Mastering Bitcoin', 'Andreas Antonopoulos', '2014']],
    practice: 'Build a 100-line blockchain with proof of work and then rewrite a block to see the chain reject it'
  },

  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    domain: 'frontier',
    year: 1981,
    tags: ['Qubits', 'Superposition', 'Error correction'],
    summary: 'Superposition and entanglement let a quantum computer take an exponentially different path on certain problems.',
    body: ['In 1981 Feynman proposed simulating quantum systems with quantum systems; in 1985 Deutsch gave the quantum Turing machine. In 1994 Shor’s algorithm showed that a quantum computer could factor large integers efficiently; in 1996 Grover’s algorithm gave a quadratic speed-up for search. Quantum computing now had its killer application.', 'Qubits are fragile, and decoherence plus gate error are the engineering core of the field. Superconducting, trapped-ion, photonic and topological qubits are all being explored. In 2019 Google’s Sycamore claimed “quantum supremacy”; error-correcting codes and logical qubits are now the competitive front. Quantum computers will not replace classical ones, but they will change cryptography, materials simulation and optimisation.'],
    milestones: [
      [1981, 'Feynman\'s idea of quantum simulation', 'The starting thought of quantum computing.', 'undefined'],
      [1985, 'The quantum Turing machine', 'Deutsch\'s model.', 'undefined'],
      [1994, 'Shor\'s algorithm', 'Quantum factoring and discrete logarithms.', 1],
      [1996, 'Grover\'s algorithm', 'A quadratic speed-up for search.', 'undefined'],
      [2019, 'Quantum supremacy', 'The Sycamore sampling experiment.', 'undefined']
    ],
    concepts: [['Qubit', 'A bit that can sit in a superposition of 0 and 1.'], ['Superposition and entanglement', 'The two resources behind quantum parallelism and strong correlation.'], ['Quantum error correction', 'Encode one logical qubit in many physical ones to resist noise.']],
    people: [['Richard Feynman', '1918 – 1988', 'Proposed quantum simulation.'], ['Peter Shor', '1963 – ', 'The quantum factoring algorithm.']],
    related: ['post-quantum', 'turing-machine', 'information-theory'],
    reading: [['Quantum Computation and Quantum Information', 'Nielsen & Chuang', '2000'], ['Quantum Supremacy Using a Programmable Superconducting Processor', 'Arute et al.', '2019']],
    practice: 'Run a Bell-state circuit on a simulator, then explain why measuring one qubit fixes the other'
  },

  {
    id: 'bioinformatics',
    name: 'Bioinformatics',
    domain: 'frontier',
    year: 1970,
    tags: ['Sequences', 'Omics', 'Structure'],
    summary: 'Algorithms for understanding life: sequence alignment, assembly, structure prediction and omics make the computer biology’s microscope.',
    body: ['In 1970 Needleman and Wunsch published sequence alignment; in 1977 Sanger invented DNA sequencing, and read lengths and throughput kept climbing. The Human Genome Project began in 1990 and its draft appeared in 2001. The explosion of sequence data made algorithms indispensable to biology.', 'CRISPR gene editing and high-throughput sequencing accelerated data production further after 2012. In 2020 AlphaFold 2 pushed protein structure prediction to near-experimental accuracy at CASP14, showing what deep learning could do for discovery. Today bioinformatics works on terabytes of omics data with graph algorithms, hidden Markov models, alignment indexes and large-scale parallelism.'],
    milestones: [
      [1970, 'Needleman–Wunsch', 'Dynamic programming for biological sequence alignment.', 'undefined'],
      [1977, 'Sanger sequencing', 'Where DNA sequencing begins.', 'undefined'],
      [1990, 'The Human Genome Project', 'Large-scale collaboration.', 1],
      [2001, 'The human genome draft', 'Sequence data explodes.', 'undefined'],
      [2020, 'AlphaFold 2', 'A breakthrough in protein structure prediction.', 'undefined']
    ],
    concepts: [['Sequence alignment', 'Find the best matches and gaps between two sequences.'], ['Assembly', 'Stitch short reads into a whole genome.'], ['Structure prediction', 'Infer a three-dimensional structure from an amino-acid sequence.']],
    people: [['Michael Waterman', '1942 – ', 'Sequence analysis algorithms and bioinformatics.'], ['John Jumper', '1985 – ', 'Core author of AlphaFold; Nobel Prize in Chemistry 2024.']],
    related: ['dynamic-programming', 'deep-learning', 'cloud-computing'],
    reading: [['Biological Sequence Analysis', 'Durbin, Eddy, Krogh & Mitchison', '1998'], ['Highly Accurate Protein Structure Prediction with AlphaFold', 'Jumper et al.', '2021']],
    practice: 'Align two short protein sequences with Needleman–Wunsch by hand and check against Biopython'
  }

]);
