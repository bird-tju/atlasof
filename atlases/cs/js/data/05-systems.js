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
      [1956, 'GM-NAA I/O', 'An early batch-processing operating system.'],
      [1961, 'CTSS goes live', 'The first time-sharing system.', 1],
      [1964, 'Multics begins', 'Hierarchical file systems and virtual memory.'],
      [1969, 'Unix is born', 'It grows out of the ruins of Multics.']
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
      [1973, 'Unix rewritten in C', 'Portability brings wide adoption.'],
      [1983, 'System V and BSD diverge', 'Two branches: commercial and academic.'],
      [1988, 'The POSIX standard', 'An effort to standardise the interfaces.'],
      [1991, 'The Linux kernel is released', 'The start of open-source Unix-compatible systems.']
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
      [1971, 'Unix fork/exec', 'Lightweight process creation.'],
      [1985, 'The Mach microkernel', 'User-level threads and message passing.'],
      [1995, 'Threads built into Java', 'Concurrency enters a mainstream language.'],
      [2005, 'Multicore goes mainstream', 'Concurrency becomes a general programming problem.']
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
    body: [
      'Every process on a modern machine behaves as if it owns a clean, contiguous block of memory starting at address zero. No two processes can see each other, none of them knows how much physical RAM exists, and a program can allocate more than the machine actually has. None of that is true at the hardware level: physical memory is shared, fragmented and finite. Virtual memory is the layer of indirection that makes the comfortable story work.',
      'The mechanism is a translation performed on every memory access. The address a program uses is virtual; the memory management unit splits it into a page number and an offset, looks the page number up in a page table, and produces a physical frame. The page table is itself a tree — usually four levels on x86-64 — so a single lookup can cost several memory reads. That is why CPUs keep a translation cache, the TLB, holding the most recent mappings; a TLB hit costs nothing, a miss costs a walk.',
      'A page fault is the interesting case. If the table entry says the page is not present, the hardware traps and the kernel decides what to do: read the page from disk, copy it from another process, allocate a fresh zero-filled page, or refuse and deliver a segmentation fault. Demand paging means a program\'s pages are only loaded when touched, which is why a large executable starts instantly — most of it is never read.',
      'Three properties come out of this, and they are worth separating because they are often conflated. Isolation: a process cannot address another\'s memory, because its page table simply has no entry for it. Abstraction: the address space can exceed physical RAM, with cold pages parked on disk. Sharing: several processes can map the same physical frame, so a shared library occupies one copy of memory rather than one per process.',
      'Copy-on-write is the trick that makes both fork and shared libraries cheap. When a process forks, the kernel copies neither the data nor the pages — it copies the page table and marks every page read-only in both. The first write to any page traps, the kernel copies that one page, and both processes continue with private copies from then on. A fork that is immediately followed by exec, the common case in Unix, never copies anything at all.',
      'The costs are the reason this layer is where performance arguments happen. Every TLB miss is a tree walk, and a program that touches memory randomly across a large working set misses constantly; that is what huge pages exist to mitigate, by covering more address space per TLB entry. Page faults are enormously more expensive than TLB misses, so the working set — the pages a program actually touches in a time window — is the quantity that decides whether a machine feels fast or is thrashing.'
    ],
    milestones: [
      [1962, 'Atlas demand paging', 'The first implementation of virtual memory.', 1],
      [1969, 'Unix virtual memory', 'fork and copy-on-write.'],
      [1980, 'PCs enter protected mode', 'Virtual memory reaches personal computers.'],
      [2000, 'Huge pages and TLB tuning', 'A response to the memory wall.']
    ],
    concepts: [['Page table', 'A structure mapping virtual page numbers to physical frames.'], ['Page fault', 'Raised when a page is not in memory; the OS brings it in.'], ['Copy-on-write', 'After fork parent and child share pages; a write triggers the copy.']],
    people: [['Tom Kilburn', '1921 – 2001', 'Virtual memory and the Atlas operating system.'], ['Maurice Wilkes', '1913 – 2010', 'Led the Atlas computer project.']],
    related: ['processes-threads', 'memory-hierarchy', 'virtualization'],
    reading: [
      ['Virtual Memory', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Virtual_memory', 'wiki'],
      ['Operating Systems: Three Easy Pieces (Memory chapter)', 'Remzi & Andrea Arpaci-Dusseau', '2015', 'https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf', 'book'],
      ['Intel 64 and IA-32 Architectures Software Developer\'s Manual, Vol. 3A', 'Intel', '2024', 'https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html', 'article'],
      ['Operating System Concepts', 'Silberschatz et al.', '1983', '', 'book']
    ],
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
      [1999, 'VMware is founded', 'x86 virtualisation becomes a business.'],
      [2003, 'Xen', 'Paravirtualisation, an early foundation of cloud computing.'],
      [2013, 'Docker', 'The container becomes the unit of development and delivery.'],
      [2014, 'Kubernetes', 'Containers get a de facto orchestrator.']
    ],
    concepts: [['Hypervisor', 'The layer that divides resources between hardware and guest operating systems.'], ['Namespaces', 'Give a process its own view of PIDs, network and file systems.'], ['cgroups', 'Limit and account for the CPU, memory and I/O of a group of processes.']],
    people: [['Mendel Rosenblum', '1958 – ', 'Co-founder of VMware.'], ['Solomon Hykes', '1984 – ', 'Creator of Docker.']],
    related: ['virtual-memory', 'cloud-computing', 'unix'],
    reading: [['Computer Systems: A Programmer’s Perspective', 'Bryant & O’Hallaron', '2003'], ['Kubernetes Up & Running', 'Burns et al.', '2017']],
    practice: 'Run the same service in a container and a VM; measure start-up time, memory overhead and isolation'
  }

]);
