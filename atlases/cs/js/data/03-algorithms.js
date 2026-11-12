/* 03 — Algorithms and data structures */
CS.addTopics([

  {
    id: 'algorithm-analysis',
    name: 'Algorithm Analysis',
    domain: 'algorithms',
    year: 1968,
    tags: ['Complexity', 'Asymptotics', 'Lower bounds'],
    summary: 'Asymptotic notation and probabilistic models predict an algorithm’s cost, turning “which one is better” into something you can compute.',
    body: ['In 1894 Bachmann introduced O notation to describe how functions grow; it was Knuth who made it the language of algorithms. From 1968, in The Art of Computer Programming, he used asymptotic analysis, sums and generating functions systematically, freeing algorithm study from any particular machine.', 'Analysis is not just counting loops. The average case needs probabilistic assumptions, amortised analysis spreads the cost of a sequence of operations over each one, and lower bounds tell us when faster is impossible. Today complexity analysis is the first filter in engineering decisions — though before the data grows tenfold, constant factors and cache locality often matter more than the asymptotic order.'],
    milestones: [
      [1894, 'Bachmann introduces O notation', 'An upper bound on how fast a function grows.'],
      [1968, 'Knuth systematises algorithm analysis', 'The first volume of The Art of Computer Programming appears.', 1],
      [1973, 'Amortised analysis', 'Spread the cost of a whole sequence of operations across each one.'],
      [1970, 'Decision-tree lower bounds', 'Comparison sorting needs Omega(n log n).']
    ],
    concepts: [['Asymptotic notation', 'O, Ω and Θ describe upper, lower and tight bounds on growth.'], ['Average and worst case', 'The first depends on assumptions about input; the second gives a guarantee.'], ['Amortised analysis', 'Spreads rare expensive operations across the whole sequence.']],
    people: [['Donald Knuth', '1938 – ', 'Author of The Art of Computer Programming and TeX.'], ['Paul Bachmann', '1837 – 1920', 'Introduced big-O notation.']],
    related: ['sorting-searching', 'data-structures', 'complexity-theory'],
    reading: [['The Art of Computer Programming, Volume 1', 'Donald Knuth', '1968'], ['Introduction to Algorithms', 'Cormen et al.', '1990']],
    practice: 'Time the same algorithm at n=1e3…1e6, then use log-log axes to decide whether it is n log n or n²'
  },

  {
    id: 'sorting-searching',
    name: 'Sorting & Searching',
    domain: 'algorithms',
    year: 1945,
    tags: ['Divide and conquer', 'Comparison', 'Engineering'],
    summary: 'Sorting was the first battlefield of algorithmics: merge sort, quicksort and Timsort condense divide-and-conquer, randomness and engineering trade-offs.',
    body: [
      'Sorting was the first problem algorithmics treated as a science rather than a craft, because it is the rare case where the question has a provable answer. Any algorithm that learns about the data only by comparing pairs must make at least about n log n comparisons in the worst case. That lower bound is the reason sorting is taught first: it shows what a proof about an algorithm looks like, and it tells you exactly what you must give up to go faster.',
      'The two classic divide-and-conquer answers differ in where the work happens. Merge sort splits the array in half, sorts each half, then merges — the splitting is trivial and the combining is the work, and the cost is predictable plus a second array. Quicksort partitions around a pivot so that the array is nearly sorted relative to that pivot, then recurses; the combining is free and the partitioning is the work, and it sorts in place. Both are O(n log n) on average and both rest on the same idea, arranged differently.',
      'Quicksort\'s weakness is worth understanding precisely. Its worst case is O(n²), and it happens when the pivot is consistently the smallest or largest element — which is exactly what a sorted or reverse-sorted input does to a naive first-element pivot. Randomising the pivot, or taking the median of three, makes the bad case astronomically unlikely rather than impossible. Heapsort, described by Williams in 1964, removes the worst case entirely while keeping O(1) extra space, at the cost of worse cache behaviour.',
      'Beating the lower bound requires not comparing. Counting sort assumes small integer keys and counts occurrences; radix sort processes one digit at a time and needs no comparisons between keys; bucket sort assumes a roughly uniform distribution and places elements into ranges. Each is linear in the number of elements, and each is a promise about the data rather than about the algorithm. Choosing one is a statement that the keys are known to be small integers or well distributed.',
      'Real sorting engines are not one algorithm. Timsort, designed by Tim Peters for Python in 2002 and later adopted by Java and Android, detects already-sorted runs, merges them in a balanced way, and switches to insertion sort for short runs — so partly sorted input, the common case in practice, costs far less than the worst case. Stability matters for the same reason: if equal elements keep their relative order, you can sort by one key and then another to get a multi-key result, which is why merge sort and Timsort are stable and plain quicksort is not.',
      'Searching follows from the same logic. Linear search needs no assumptions and pays n. Binary search needs sorted data and pays log n, which is why sorting is often a one-time cost paid to make many later lookups cheap — the reason databases keep indexes. Hash tables give expected constant-time lookup with no ordering assumption at all; balanced trees give logarithmic lookup and keep the order, which is what range queries need. The choice between them is a choice about which operations you will perform often.'
    ],
    milestones: [
      [1945, 'Merge sort', 'von Neumann implements it on the EDVAC.'],
      [1960, 'Quicksort', 'Hoare\'s in-place divide and conquer.', 1],
      [1964, 'Heapsort', 'Williams gives an in-place algorithm with worst-case O(n log n).'],
      [2002, 'Timsort', 'An adaptive merge sort designed for real-world data.']
    ],
    concepts: [['Divide and conquer', 'Split the problem into subproblems, solve recursively, then merge.'], ['Comparison lower bound', 'A comparison sort needs at least Ω(n log n) comparisons.'], ['Stability', 'Equal elements keep their relative order after sorting.']],
    people: [['Tony Hoare', '1934 – ', 'Quicksort and Hoare logic.'], ['John von Neumann', '1903 – 1957', 'Merge sort and the stored-program computer.']],
    related: ['algorithm-analysis', 'data-structures', 'dynamic-programming'],
    reading: [
      ['Quicksort', 'C. A. R. Hoare', '1961', 'https://academic.oup.com/comjnl/article/5/1/10/395338', 'paper'],
      ['Sorting algorithm', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Sorting_algorithm', 'wiki'],
      ['Introduction to Algorithms', 'Cormen et al.', '1990', '', 'book'],
      ['Timsort', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Timsort', 'wiki']
    ],
    practice: 'Implement three-way quicksort and compare it with the built-in sort on data with many duplicate keys'
  },

  {
    id: 'graph-algorithms',
    name: 'Graph Algorithms',
    domain: 'algorithms',
    year: 1736,
    tags: ['Networks', 'Shortest paths', 'Graph theory'],
    summary: 'From Euler\'s seven bridges to Dijkstra and max-flow, graph algorithms turn relationships into objects you can compute with.',
    body: ['In 1736 Euler proved that the seven bridges of Königsberg cannot all be crossed once: he abstracted vertices and edges and showed that the number of odd-degree vertices decides whether an Euler tour exists. It is regarded as the start of graph theory and of network science.', 'In the twentieth century graph algorithms became a core tool of computer science. Dijkstra gave shortest paths in 1956; Prim and Kruskal gave minimum spanning trees in 1957; Floyd solved all-pairs shortest paths in 1962. Max flow, bipartite matching and topological sorting underpin scheduling, networks and dependency management. Social networks, map navigation and compilers all still run these sixty-year-old algorithms.'],
    milestones: [
      [1736, 'Euler solves the seven bridges', 'Graph theory is born.', 1],
      [1956, 'Dijkstra\'s shortest paths', 'Single-source shortest paths with non-negative weights.'],
      [1957, 'Prim and Kruskal: minimum spanning trees', 'Two greedy strategies for the same problem.'],
      [1962, 'Floyd–Warshall', 'All-pairs shortest paths by dynamic programming.'],
      [1972, 'Edmonds–Karp max flow', 'Breadth-first search keeps it polynomial.']
    ],
    concepts: [['Graph representations', 'Adjacency lists and matrices decide the cost of traversal and storage.'], ['Shortest paths', 'Finding the cheapest route through a weighted graph.'], ['Minimum spanning tree', 'n−1 edges connecting every vertex with the least total weight.']],
    people: [['Leonhard Euler', '1707 – 1783', 'Solved the seven bridges and founded graph theory.'], ['Edsger Dijkstra', '1930 – 2002', 'Shortest paths, structured programming and semaphores.']],
    related: ['data-structures', 'dynamic-programming', 'packet-switching'],
    reading: [['Introduction to Algorithms, Part VI', 'Cormen et al.', '1990'], ['Graph Theory', 'Reinhard Diestel', '2000']],
    practice: 'Run Dijkstra on a real map extract, then re-run it with negative weights and watch it break'
  },

  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    domain: 'algorithms',
    year: 1953,
    tags: ['Optimisation', 'State', 'Memoisation'],
    summary: 'Split a problem into overlapping subproblems and remember the answers: DP trades space for time, from sequence alignment to speech recognition.',
    body: ['In the 1950s Bellman introduced dynamic programming while studying multi-stage decisions, characterising a class of decomposable problems by optimal substructure: the global optimum is built from optimal sub-solutions. The key is to eliminate recomputation — store the answers for subproblems in a table.', 'DP then became a cross-disciplinary method: edit distance and Needleman–Wunsch made biological sequence alignment possible; Viterbi finds the most likely path in a hidden Markov model; knapsack, interval scheduling and matrix-chain multiplication are the standard exercises. The hard part is not writing the recurrence but defining the state — design the state well and half the problem is solved.'],
    milestones: [
      [1953, 'Bellman introduces dynamic programming', 'Optimising decisions made in stages.', 1],
      [1967, 'The Viterbi algorithm', 'The best path through a hidden Markov model.'],
      [1970, 'Needleman–Wunsch', 'Dynamic programming for biological sequence alignment.'],
      [1970, 'Knapsack and interval DP systematised', 'Both enter the algorithms textbooks.']
    ],
    concepts: [['Optimal substructure', 'The global optimum contains optimal solutions to subproblems.'], ['State and transition', 'Describe a subproblem with parameters and write the recurrence between states.'], ['Memoisation', 'Cache computed subproblems in top-down recursion.']],
    people: [['Richard Bellman', '1920 – 1984', 'Dynamic programming and the Bellman equation.'], ['Andrew Viterbi', '1935 – ', 'The Viterbi algorithm and CDMA.']],
    related: ['algorithm-analysis', 'graph-algorithms', 'bioinformatics'],
    reading: [['Dynamic Programming and Optimal Control', 'Richard Bellman', '1957'], ['Introduction to Algorithms, Chapter 15', 'Cormen et al.', '1990']],
    practice: 'Implement edit distance and print the full table, not just the answer — then trace back the alignment'
  },

  {
    id: 'data-structures',
    name: 'Data Structures',
    domain: 'algorithms',
    year: 1953,
    tags: ['Abstraction', 'Indexing', 'Memory'],
    summary: 'Arrays, lists, hash tables, trees and heaps decide how data is organised — and therefore how fast an algorithm can be.',
    body: ['Hash tables appeared in 1953; linked lists entered programming practice in 1955. In 1962 B-trees were designed for large on-disk indexes and became the default structure of nearly every database. In 1972 red–black trees used colour constraints to bring the cost of a balanced tree within engineering reach.', 'The choice of data structure often matters more than the algorithm: contiguous arrays are cache-friendly, linked lists insert cheaply but lose locality; hash tables are O(1) on average yet face collisions and worst cases. Union–find, segment trees, skip lists and Bloom filters each solve a particular problem. Understanding their cost models is the prerequisite for writing fast code.'],
    milestones: [
      [1953, 'Hash tables', 'Average constant-time lookup through a hash function.'],
      [1962, 'B-trees', 'A multiway balanced tree designed for disk indexes.', 1],
      [1964, 'Union–find', 'Near-constant-time merging and querying of sets.'],
      [1972, 'Red–black trees', 'A balanced binary search tree you can actually implement.'],
      [1989, 'Skip lists', 'Probabilistic balance instead of strict rotations.']
    ],
    concepts: [['Abstract data type', 'Defines a structure by its operations rather than its implementation.'], ['Hashing and collisions', 'Map keys to buckets; resolve collisions with chaining or open addressing.'], ['Balanced trees', 'Keep height at O(log n) with rotations or colour constraints.']],
    people: [['Rudolf Bayer', '1925 – 2013', 'Co-inventor of the B-tree.'], ['Robert Tarjan', '1948 – ', 'Union–find, amortised analysis and graph algorithms.']],
    related: ['algorithm-analysis', 'sorting-searching', 'relational-model'],
    reading: [['Data Structures and Algorithm Analysis', 'Mark Allen Weiss', '1995'], ['The Algorithm Design Manual', 'Steven Skiena', '2008']],
    practice: 'Implement a hash table with open addressing, measure the load factor against probe count, and compare with a tree map'
  }

]);
