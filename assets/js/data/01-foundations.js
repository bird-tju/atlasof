/* 01 — Foundations: mathematics and logic */
CS.addTopics([

  {
    id: 'formal-logic',
    name: 'Formal Logic',
    domain: 'foundations',
    year: -350,
    tags: ['Logic', 'Proof', 'Symbols'],
    summary: 'From Aristotle\'s syllogisms to Boolean algebra and first-order logic, formal logic turned valid reasoning into symbol manipulation a machine can check.',
    body: ['Logic began as part of philosophy. Aristotle’s Organon gives the syllogism: from “all men are mortal” and “Socrates is a man” it derives “Socrates is mortal”. What matters is not whether the conclusion is true but whether the form is valid — already a sketch of symbol manipulation.', 'In the nineteenth century Boole turned logic into algebra: and, or and not became multiplication, addition and complement. Frege then added quantifiers and predicates to build first-order logic. By the twentieth century logic had become the foundational language of mathematics — and the starting point of computer science: circuits, programs, database queries and theorem provers all manipulate formal statements.'],
    milestones: [
      [-350, 'Aristotle, Organon', 'Systematised the syllogism and introduced the idea of formal validity.', 'undefined'],
      [1854, 'Boole, The Laws of Thought', 'Described propositional logic in algebra: truth values 0/1, with and, or, not as multiply, add, complement.', 'undefined'],
      [1879, 'Frege, Begriffsschrift', 'Introduced quantifiers and predicates, building the first complete first-order logic.', 'undefined'],
      [1930, 'Gödel\'s completeness theorem', 'Semantic entailment and formal provability in first-order logic coincide exactly.', 1]
    ],
    concepts: [['Propositional logic', 'Combines atomic propositions with truth-functional connectives; it is decidable.'], ['Predicate logic', 'Adds objects, predicates and quantifiers — enough to express almost all of mathematics.'], ['Inference rules', 'Mechanical rules that derive conclusions from premises, such as modus ponens and resolution.']],
    people: [['Aristotle', '384 – 322 BC', 'Built the syllogism and the first system of formal logic.'], ['George Boole', '1815 – 1864', 'Turned logical operations into algebra; Boolean algebra carries his name.'], ['Gottlob Frege', '1848 – 1925', 'Founder of modern mathematical logic.']],
    related: ['boolean-algebra', 'set-theory', 'godel-incompleteness', 'turing-machine'],
    reading: [['Organon', 'Aristotle', '-350'], ['Begriffsschrift', 'Gottlob Frege', '1879']],
    practice: 'Verify with a truth table that (p→q) ∧ p → q is a tautology, then write a 20-line truth-table printer'
  },

  {
    id: 'set-theory',
    name: 'Set Theory & Infinity',
    domain: 'foundations',
    year: 1874,
    tags: ['Infinity', 'Cardinality', 'Axioms'],
    summary: 'Cantor used sets and cardinality to tame infinity and gave mathematics one language; Russell\'s paradox then exposed the cracks in it.',
    body: ['In 1874 Cantor proved that the reals are “more numerous” than the naturals: the two cannot be put into one-to-one correspondence. That broke the intuition that all infinities are alike, and set theory was born. His diagonal construction of a real missing from any list was later borrowed by Turing to prove the halting problem.', 'Naive set theory soon ran into trouble: in 1901 Russell formed “the set of all sets that do not contain themselves”, which contradicts itself either way. Zermelo and Fraenkel answered with axiomatic set theory (ZFC), constraining which sets may exist. Today almost every mathematical object can be encoded as a set, and the independence of the continuum hypothesis shows that some questions cannot be settled from the axioms at all.'],
    milestones: [
      [1874, 'Cantor proves the reals uncountable', 'The diagonal argument appears, and infinity splits into different cardinalities.', 1],
      [1901, 'Russell\'s paradox', 'Naive set theory develops a crack.', 'undefined'],
      [1908, 'Zermelo\'s axiomatisation', 'The axiom of separation restricts how sets may be constructed.', 'undefined'],
      [1922, 'ZFC takes shape', 'Fraenkel and Skolem complete the axiom of replacement.', 'undefined'],
      [1963, 'The continuum hypothesis is independent', 'Cohen\'s forcing shows CH cannot be decided from ZFC.', 'undefined']
    ],
    concepts: [['Cardinality', 'The naturals, integers and rationals are equinumerous; the reals are not.'], ['Diagonal argument', 'Build an object that differs from every item on the list — proving uncountability or undecidability.'], ['Axiom of choice', 'Pick one element from each of arbitrarily many non-empty sets; equivalent to Zorn’s lemma.']],
    people: [['Georg Cantor', '1845 – 1918', 'Founder of set theory and of transfinite numbers.'], ['Bertrand Russell', '1872 – 1970', 'Found Russell’s paradox; co-wrote Principia Mathematica.'], ['Paul Cohen', '1934 – 2007', 'Invented forcing and proved the continuum hypothesis independent.']],
    related: ['formal-logic', 'godel-incompleteness', 'computability'],
    reading: [['Principia Mathematica', 'Russell & Whitehead', '1910'], ['Set Theory', 'Thomas Jech', '2003']],
    practice: 'Write a program that enumerates decimals in [0,1], constructs one that is not on the list by the diagonal method, and confirms it differs'
  },

  {
    id: 'godel-incompleteness',
    name: 'Gödel’s Incompleteness Theorems',
    domain: 'foundations',
    year: 1931,
    tags: ['Proof', 'Self-reference', 'Limits'],
    summary: 'Any sufficiently strong, consistent formal system contains true statements it cannot prove — the first precise map of mathematics’ limits.',
    body: ['In 1928 Hilbert posed the Entscheidungsproblem: is there an algorithm that decides whether any first-order statement is provable? He believed mathematics could be fully formalised, and that the formalisation could itself be proved consistent.', 'In 1931 Gödel encoded “this statement is unprovable” as an arithmetic sentence: every symbol, formula and proof received a unique number, so the system could talk about itself. Two theorems followed: any consistent system containing arithmetic has undecidable statements, and no such system can prove its own consistency. This was not only an earthquake in logic; it directly pushed Turing to redefine what a mechanical procedure is.'],
    milestones: [
      [1928, 'Hilbert poses the Entscheidungsproblem', 'He asks for a decision procedure for predicate logic.', 'undefined'],
      [1931, 'The incompleteness theorems', 'Self-reference and coding expose the intrinsic limits of formal systems.', 1],
      [1936, 'Turing defines computability', 'The Turing machine reformulates \'algorithm\' and proves the halting problem undecidable.', 'undefined'],
      [1953, 'Rice\'s theorem', 'Every non-trivial semantic property of programs is undecidable.', 'undefined']
    ],
    concepts: [['Formal system', 'Symbols, axioms and inference rules, forming proofs a machine can check.'], ['Gödel numbering', 'Maps symbols and proofs to natural numbers so the system can talk about itself.'], ['Self-reference', 'Constructing a statement that points at itself is the core trick of the proof.']],
    people: [['Kurt Gödel', '1906 – 1978', 'Author of the incompleteness theorems and of a rotating-universe solution.'], ['David Hilbert', '1862 – 1943', 'Set out the formalist programme and its 23 problems.']],
    related: ['formal-logic', 'computability', 'turing-machine'],
    reading: [['On Formally Undecidable Propositions of Principia Mathematica and Related Systems', 'Kurt Gödel', '1931'], ['Gödel, Escher, Bach', 'Douglas Hofstadter', '1979']],
    practice: 'Hand-encode the formula 0=0 as a Gödel number, walking through symbol → number → formula number'
  },

  {
    id: 'information-theory',
    name: 'Information Theory',
    domain: 'foundations',
    year: 1948,
    tags: ['Entropy', 'Communication', 'Coding'],
    summary: 'Shannon measured uncertainty with entropy and bounded reliable communication with channel capacity, turning a craft into mathematics.',
    body: ['In 1948 Shannon argued in A Mathematical Theory of Communication that the amount of information has nothing to do with content and everything to do with uncertainty. A fair coin carries one bit because it has two equally likely outcomes; the entropy of a text depends on how often each character occurs. That definition gave compression, error correction and cryptography one common measure.', 'Shannon also proved that below channel capacity some coding scheme makes the error probability arbitrarily small, and above it none exists. The theorem named no particular code, yet it set the target for seventy years of coding theory. From LDPC codes on disks to Polar codes in 5G, engineering keeps closing in on that limit.'],
    milestones: [
      [1928, 'Hartley measures information in logarithms', 'A precursor to Shannon\'s theory.', 'undefined'],
      [1948, 'A Mathematical Theory of Communication', 'Entropy, channel capacity and rate–distortion arrive together.', 1],
      [1950, 'Hamming codes', 'The first practical error-correcting code.', 'undefined'],
      [1993, 'Turbo codes', 'Iterative decoding that approaches the Shannon limit.', 'undefined'],
      [2008, 'Polar codes', 'Adopted for 5G control channels.', 'undefined']
    ],
    concepts: [['Entropy', 'A measure of uncertainty, and the theoretical lower bound on lossless compression.'], ['Channel capacity', 'The maximum rate at which information can cross a noisy channel reliably.'], ['Error-correcting codes', 'Add redundancy so the receiver can detect and repair transmission errors.']],
    people: [['Claude Shannon', '1916 – 2001', 'Founder of information theory and of digital circuit design.'], ['Richard Hamming', '1915 – 1998', 'Invented Hamming codes and the Hamming distance.']],
    related: ['probability-statistics', 'tcp-ip', 'tls'],
    reading: [['A Mathematical Theory of Communication', 'Claude Shannon', '1948'], ['Elements of Information Theory', 'Thomas Cover', '2006']],
    practice: 'Compute the character entropy of a 1 KB text, compare it with the size after gzip, and explain the gap'
  },

  {
    id: 'probability-statistics',
    name: 'Probability & Statistics',
    domain: 'foundations',
    year: 1654,
    tags: ['Uncertainty', 'Inference', 'Bayes'],
    summary: 'Born from a gambling question about dividing stakes, probability became the language of uncertainty; statistics infers the world back from data.',
    body: ['In 1654 Pascal and Fermat settled the problem of points in their letters, and probability was on its way. Jacob Bernoulli proved the law of large numbers: observed frequencies settle near the probability. Laplace applied probability to celestial mechanics and to evidence, and Bayes gave the rule for updating belief in the light of new evidence.', 'In 1933 Kolmogorov put probability on measure-theoretic axioms and made it a rigorous branch of mathematics. Statistical inference, Markov chain Monte Carlo and Bayesian networks matured in the second half of the century. Today, from A/B tests to machine learning, probability is the most general language we have for saying “I do not know”.'],
    milestones: [
      [1654, 'Pascal and Fermat correspond', 'Probability is born from a problem about gambling.', 'undefined'],
      [1713, 'Bernoulli, Ars Conjectandi', 'The law of large numbers is proved for the first time.', 'undefined'],
      [1763, 'Bayes\' theorem published', 'Inverse probability and the updating of belief.', 1],
      [1933, 'Kolmogorov\'s axiomatisation', 'Probability becomes part of measure theory.', 'undefined'],
      [1990, 'MCMC becomes practical', 'High-dimensional posterior inference becomes feasible.', 'undefined']
    ],
    concepts: [['Law of large numbers', 'As the sample grows, the sample mean converges to the expectation.'], ['Bayesian inference', 'Prior times likelihood gives the posterior, updated as evidence arrives.'], ['Central limit theorem', 'The sum of many independent random variables is approximately normal.']],
    people: [['Blaise Pascal', '1623 – 1662', 'A pioneer of probability and of the calculating machine.'], ['Andrey Kolmogorov', '1903 – 1987', 'Built the axiomatic foundation of probability.']],
    related: ['information-theory', 'statistical-learning', 'quantum-computing'],
    reading: [['Ars Conjectandi', 'Jacob Bernoulli', '1713'], ['Foundations of the Theory of Probability', 'Andrey Kolmogorov', '1933']],
    practice: 'Verify the central limit theorem with 100,000 simulations: sum uniform variables, plot the histogram, compare with the normal curve'
  },

  {
    id: 'boolean-algebra',
    name: 'Boolean Algebra & Switching Circuits',
    domain: 'foundations',
    year: 1854,
    tags: ['Boole', 'Logic gates', 'Simplification'],
    summary: 'Treat true and false as 1 and 0 and reasoning becomes arithmetic; eighty-three years later Shannon noticed relay circuits obey exactly the same rules.',
    body: ['In 1854 Boole did something that looked odd at the time: he wrote true and false as 1 and 0, and mapped and, or and not onto multiplication, addition and complement. Reasoning could then be computed like an equation. For a long while the algebra was treated as an elegant toy — beautiful, apparently useless.', 'In 1937 a 21-year-old Shannon showed in his master’s thesis A Symbolic Analysis of Relay and Switching Circuits that a circuit’s open and closed contacts are isomorphic to 1 and 0: series is and, parallel is or, a normally-closed contact is not. Designing a circuit became simplifying an expression. Often called one of the most important master’s theses of the century, it turned digital design from craft into mathematics.', 'The simplification methods are still in use: write the truth table, read off the canonical sum of products, then reduce it with a Karnaugh map or Quine–McCluskey. Modern synthesis tools do the same, only the variable count grows from four to millions. And “one NAND gate suffices to express any Boolean function” is exactly why a whole computer can be built from NAND.'],
    milestones: [
      [1854, 'Boole, The Laws of Thought', 'Described propositional logic in algebra: truth values 0/1, with and, or, not as multiply, add, complement.', 1],
      [1937, 'Shannon\'s master\'s thesis', 'Proves switching circuits are isomorphic to Boolean algebra: circuit design gains a mathematical tool.', 1],
      [1952, 'Quine–McCluskey algorithm', 'A tabular method for minimal sum-of-products, implementable as a program.', 'undefined'],
      [1953, 'Karnaugh maps', 'Adjacent minterms in a grid make hand simplification visual.', 'undefined'],
      [1970, 'Logic synthesis tools appear', 'Simplification moves from paper into programs, and scale takes off.', 'undefined']
    ],
    concepts: [['Truth table', 'Enumerates every input combination; the plainest representation of a Boolean function and the standard test for equivalence.'], ['Canonical sum of products', 'One minterm per input combination that outputs 1, ORed together; every Boolean function can be written this way.'], ['Karnaugh map', 'Puts adjacent minterms in adjacent cells; the bigger the group, the fewer the terms — the standard hand method.'], ['De Morgan’s laws', '¬(A∧B) = ¬A∨¬B; this is why NAND alone can build every gate.'], ['Functional completeness', 'NAND (or NOR) alone expresses any Boolean function — the starting point of nand2tetris.']],
    people: [['George Boole', '1815 – 1864', 'Turned logic into algebra; Boolean algebra carries his name.'], ['Claude Shannon', '1916 – 2001', 'Proved in 1937 that switching circuits are isomorphic to Boolean algebra.'], ['Maurice Karnaugh', '1924 – 2022', 'Invented the Karnaugh map, making simplification pencil-and-paper work.']],
    related: ['formal-logic', 'transistor-ic', 'von-neumann', 'complexity-theory', 'information-theory'],
    reading: [['An Investigation of the Laws of Thought', 'George Boole', '1854'], ['A Symbolic Analysis of Relay and Switching Circuits', 'Claude Shannon', '1937'], ['Discrete Mathematics and Its Applications', 'Kenneth Rosen', '1988']],
    practice: 'Reduce a four-variable truth table to a minimal sum of products: draw the Karnaugh map, check it with Quine–McCluskey, then build it from Nand gates and run the tests'
  }

]);
