/* 05 — Operating systems */
CS.addTopics([

  {
    id: 'time-sharing',
    name: 'Batch & Time-Sharing Systems',
    domain: 'systems',
    year: 1961,
    tags: ['Scheduling', 'Isolation', 'Interaction'],
    summary: 'Letting many users share one computer forced operating systems to learn scheduling, isolation and interaction.',
    body: ['Computers in the 1950s ran batch jobs: users handed in a stack of punched cards and collected the results hours later. In 1961 MIT’s CTSS connected several terminals to one machine so that each user felt they had it to themselves. That required the operating system to switch quickly between users and to protect their memory from each other.', 'In 1964 Multics pushed the idea further: hierarchical file systems, virtual memory, dynamic linking and a security model. Multics failed commercially, but its design directly shaped Unix. Time-sharing also changed the relationship between people and machines — computing turned from submitting a job into holding a conversation.'],
    milestones: [
      [1956, 'GM-NAA I/O', 'An early batch-processing operating system.', 'undefined'],
      [1961, 'CTSS goes live', 'The first time-sharing system.', 1],
      [1964, 'Multics begins', 'Hierarchical file systems and virtual memory.', 'undefined'],
      [1969, 'Unix is born', 'It grows out of the ruins of Multics.', 'undefined']
    ],
    concepts: [['Batch processing', 'Jobs are queued and run one after another by a monitor.'], ['Time-sharing', 'Round-robin time slices let several interactive users share the CPU.'], ['Memory protection', 'One user’s program cannot read or write another’s memory.']],
    people: [['Fernando Corbató', '1926 – 2019', 'Led CTSS and Multics.'], ['Dennis Ritchie', '1941 – 2011', 'Co-creator of Unix and C.']],
    related: ['unix', 'processes-threads', 'virtual-memory'],
    reading: [['An Experimental Time-Sharing System', 'Corbató et al.', '1962'], ['Operating System Concepts', 'Silberschatz et al.', '1982']],
    practice: 'Write a round-robin scheduler simulator with 3 processes and a 4-tick quantum, and plot their timelines'
  },

  {
    id: 'unix',
    name: 'Unix & C',
    domain: 'systems',
    year: 1969,
    tags: ['Philosophy', 'Portability', 'Tools'],
    summary: 'Small composable tools, everything is a file, rewritten in C: Unix’s design philosophy has ruled operating systems for fifty years.',
    body: ['In 1969 Ritchie and Thompson wrote the first Unix in assembly at Bell Labs; in 1973 they rewrote it in C. Portability let Unix run on many machines and carried C along with it. Pipes, redirection and the “everything is a file” abstraction let small tools compose into complex behaviour.', 'Unix split into the BSD and System V branches, and POSIX tried to unify the interfaces. In 1991 Linus Torvalds released the Linux kernel, which together with GNU tools formed a complete free operating system. Today, from servers and Android to macOS, Unix interfaces and philosophy are the common language of systems software.'],
    milestones: [
      [1969, 'Unix, first edition', 'An internal project at Bell Labs.', 1],
      [1973, 'Unix rewritten in C', 'Portability brings wide adoption.', 'undefined'],
      [1983, 'System V and BSD diverge', 'Two branches: commercial and academic.', 'undefined'],
      [1988, 'The POSIX standard', 'An effort to standardise the interfaces.', 'undefined'],
      [1991, 'The Linux kernel is released', 'The start of open-source Unix-compatible systems.', 'undefined']
    ],
    concepts: [['Pipes', 'Connect the output of one program to the input of the next.'], ['Everything is a file', 'Devices, sockets and process information are all reached through the file interface.'], ['Process model', 'fork copies a process, exec replaces its program image.']],
    people: [['Ken Thompson', '1943 – ', 'Co-creator of Unix and Go.'], ['Dennis Ritchie', '1941 – 2011', 'Co-creator of C and Unix.']],
    related: ['c-language', 'processes-threads', 'time-sharing'],
    reading: [['The Unix Programming Environment', 'Kernighan & Pike', '1984'], ['Unix: A History and a Memoir', 'Brian Kernighan', '2019']],
    practice: 'Rebuild a pipeline of five Unix tools with your own short programs, then check the output against the originals'
  },

  {
    id: 'processes-threads',
    name: 'Processes & Threads',
    domain: 'systems',
    year: 1965,
    tags: ['Concurrency', 'Scheduling', 'Synchronisation'],
    summary: 'Processes provide isolation, threads provide concurrency, and the scheduler divides CPU time between them.',
    body: ['In the 1960s Multics introduced the process as the unit of resource isolation: each process has its own address space and file descriptors. In the 1970s Unix made process creation a cheap system call with fork/exec. In the 1980s Mach pushed the thread model: several flows of execution inside one process share memory and switch more cheaply.', 'Threads brought race conditions and locks, and with them deadlock. Operating systems provide mutexes, condition variables and semaphores; languages try to lower the difficulty with actors, CSP and async/await. In the multicore era concurrency is no longer a server-only problem: every layer of software faces it.'],
    milestones: [
      [1965, 'The Multics process model', 'Address spaces and resource isolation.', 1],
      [1971, 'Unix fork/exec', 'Lightweight process creation.', 'undefined'],
      [1985, 'The Mach microkernel', 'User-level threads and message passing.', 'undefined'],
      [1995, 'Threads built into Java', 'Concurrency enters a mainstream language.', 'undefined'],
      [2005, 'Multicore goes mainstream', 'Concurrency becomes a general programming problem.', 'undefined']
    ],
    concepts: [['Processes and threads', 'The first owns an address space; the second shares its process’s resources.'], ['Context switch', 'Saving and restoring execution state — the fixed cost of concurrency.'], ['Deadlock', 'Threads wait on locks held by each other, forming a cycle.']],
    people: [['Ken Thompson', '1943 – ', 'Implemented the Unix process model.'], ['Leslie Lamport', '1941 – ', 'Concurrency theory and distributed systems.']],
    related: ['unix', 'virtual-memory', 'consensus'],
    reading: [['Operating Systems: Design and Implementation', 'Tanenbaum & Woodhull', '1987'], ['Java Concurrency in Practice', 'Brian Goetz et al.', '2006']],
    practice: 'Write a program that deadlocks on two mutexes, then fix it with a lock ordering and prove the order holds'
  },

  {
    id: 'virtual-memory',
    name: 'Virtual Memory',
    domain: 'systems',
    year: 1962,
    tags: ['Paging', 'Isolation', 'Address space'],
    summary: 'Every process believes it owns a whole memory; page tables and page faults hide the fragmentation of physical RAM.',
    body: ['In 1962 the Manchester Atlas implemented demand paging for the first time: the addresses a program uses are translated by hardware, and only pages actually touched are brought into memory. By the late 1960s virtual memory was standard on mainframes; in the 1980s it reached personal computers.', 'Virtual memory gives three things: isolation (processes cannot see each other’s memory), abstraction (an address space larger than physical RAM) and sharing (several processes mapping the same library). The price is page-table walks and TLB misses. Today containers and virtual machines stack further isolation layers on top of it.'],
    milestones: [
      [1962, 'Atlas demand paging', 'The first implementation of virtual memory.', 1],
      [1969, 'Unix virtual memory', 'fork and copy-on-write.', 'undefined'],
      [1980, 'PCs enter protected mode', 'Virtual memory reaches personal computers.', 'undefined'],
      [2000, 'Huge pages and TLB tuning', 'A response to the memory wall.', 'undefined']
    ],
    concepts: [['Page table', 'A structure mapping virtual page numbers to physical frames.'], ['Page fault', 'Raised when a page is not in memory; the OS brings it in.'], ['Copy-on-write', 'After fork parent and child share pages; a write triggers the copy.']],
    people: [['Tom Kilburn', '1921 – 2001', 'Virtual memory and the Atlas operating system.'], ['Maurice Wilkes', '1913 – 2010', 'Led the Atlas computer project.']],
    related: ['processes-threads', 'memory-hierarchy', 'virtualization'],
    reading: [['Operating System Concepts', 'Silberschatz et al.', '1982'], ['Computer Systems: A Programmer’s Perspective', 'Bryant & O’Hallaron', '2003']],
    practice: 'Write a page-fault simulator: trace an access pattern, count faults for LRU and FIFO, and compare'
  },

  {
    id: 'virtualization',
    name: 'Virtualization & Containers',
    domain: 'systems',
    year: 1967,
    tags: ['Isolation', 'Cloud', 'Orchestration'],
    summary: 'Software that imitates hardware runs several isolated systems on one machine; containers push isolation down to the process level.',
    body: ['In 1967 IBM’s CP/CMS ran a hypervisor on the System/360 so several operating systems could share one mainframe. In 1999 VMware brought x86 virtualisation to commercial servers; in 2003 Xen used paravirtualisation for speed. Virtualisation turned data centres from “one machine, one application” into elastic pools of resources.', 'In 2013 Docker wrapped Linux namespaces and cgroups into the container: shared kernel, millisecond start-up, reproducible images. In 2014 Kubernetes standardised container orchestration. Today virtual machines give strong isolation and containers give density and speed, and the two are routinely mixed on the same infrastructure.'],
    milestones: [
      [1967, 'IBM CP/CMS', 'A forerunner of the hypervisor.', 1],
      [1999, 'VMware is founded', 'x86 virtualisation becomes a business.', 'undefined'],
      [2003, 'Xen', 'Paravirtualisation, an early foundation of cloud computing.', 'undefined'],
      [2013, 'Docker', 'The container becomes the unit of development and delivery.', 'undefined'],
      [2014, 'Kubernetes', 'Containers get a de facto orchestrator.', 'undefined']
    ],
    concepts: [['Hypervisor', 'The layer that divides resources between hardware and guest operating systems.'], ['Namespaces', 'Give a process its own view of PIDs, network and file systems.'], ['cgroups', 'Limit and account for the CPU, memory and I/O of a group of processes.']],
    people: [['Mendel Rosenblum', '1958 – ', 'Co-founder of VMware.'], ['Solomon Hykes', '1984 – ', 'Creator of Docker.']],
    related: ['virtual-memory', 'cloud-computing', 'unix'],
    reading: [['Computer Systems: A Programmer’s Perspective', 'Bryant & O’Hallaron', '2003'], ['Kubernetes Up & Running', 'Burns et al.', '2017']],
    practice: 'Run the same service in a container and a VM; measure start-up time, memory overhead and isolation'
  }

]);
