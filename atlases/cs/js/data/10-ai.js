/* 10 — Artificial intelligence */
CS.addTopics([

  {
    id: 'dartmouth',
    name: 'Dartmouth & Symbolic AI',
    domain: 'ai',
    year: 1956,
    tags: ['Symbols', 'Search', 'Birth of a field'],
    summary: 'In the summer of 1956 a group at Dartmouth wrote down the name “artificial intelligence” and believed intelligence could be described precisely.',
    body: ['In 1956 McCarthy, Minsky, Shannon and Rochester organised a two-month workshop at Dartmouth. The proposal argued that every aspect of learning or any other feature of intelligence could in principle be described so precisely that a machine could simulate it. The meeting produced no breakthrough, but it named the field.', 'For the next twenty years symbolism dominated: the Logic Theorist proved mathematical theorems, GPS solved problems by means–ends analysis, ELIZA mimicked conversation with pattern matching. Researchers believed that the right symbolic representation plus the right search strategy would bring intelligence with it. That belief met its first winter in the 1970s.'],
    milestones: [
      [1956, 'The Dartmouth workshop', 'Artificial intelligence gets its name.', 1],
      [1957, 'GPS, the General Problem Solver', 'Newell and Simon.'],
      [1958, 'LISP', 'The programming language of AI.'],
      [1966, 'ELIZA', 'One of the first chatbots.']
    ],
    concepts: [['Symbolism', 'Intelligence is the manipulation of symbols; the core problems are representation and search.'], ['Heuristic search', 'Prune with rules of thumb to shrink the search space.'], ['General problem solving', 'Cast a problem as a state space and look for a path from start to goal.']],
    people: [['John McCarthy', '1927 – 2011', 'Coined “artificial intelligence” and created LISP.'], ['Marvin Minsky', '1927 – 2016', 'Co-founder of the MIT AI Lab.']],
    related: ['perceptron', 'expert-systems', 'lisp'],
    reading: [['A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence', 'McCarthy et al.', '1955'], ['Computation: Finite and Infinite Machines', 'Marvin Minsky', '1967']],
    practice: 'Write a 30-line solver for the missionaries and cannibals puzzle using breadth-first search, then add a heuristic'
  },

  {
    id: 'perceptron',
    name: 'Perceptron & Connectionism',
    domain: 'ai',
    year: 1958,
    tags: ['Neurons', 'Learning', 'The first winter'],
    summary: 'A layer of learnable weights imitating a neuron: the perceptron launched connectionism, and met its first refutation.',
    body: ['In 1943 McCulloch and Pitts proposed an artificial neuron; in 1958 Rosenblatt built the perceptron: a weighted sum of inputs, a threshold, and weights corrected by mistakes. It could learn any linearly separable problem and was used for simple image recognition.', 'In 1969 Minsky and Papert published Perceptrons, proving that a single layer cannot solve non-linear problems such as XOR. The book is often misread as a refutation of neural networks in general, yet it did hasten connectionism’s first winter. Multi-layer networks and backpropagation had to wait until the 1980s.'],
    milestones: [
      [1943, 'The McCulloch–Pitts neuron', 'Neural activity described with logic gates.'],
      [1958, 'The perceptron', 'A learnable linear classifier.', 1],
      [1969, 'Perceptrons (the book)', 'It points out the limits of single-layer networks.'],
      [1986, 'Backpropagation', 'Multi-layer networks become trainable.']
    ],
    concepts: [['Linear classification', 'Separating two classes with a hyperplane.'], ['Weight learning', 'Adjusting weights from errors — the ancestor of gradient descent.'], ['The XOR problem', 'The classic linearly inseparable counter-example.']],
    people: [['Frank Rosenblatt', '1928 – 1971', 'Inventor of the perceptron.'], ['Marvin Minsky', '1927 – 2016', 'Co-author of Perceptrons.']],
    related: ['dartmouth', 'deep-learning', 'statistical-learning'],
    reading: [['Perceptrons', 'Minsky & Papert', '1969'], ['Principles of Neurodynamics', 'Frank Rosenblatt', '1962']],
    practice: 'Train a perceptron by hand on AND, OR and XOR; show why the third cannot converge'
  },

  {
    id: 'expert-systems',
    name: 'Expert Systems & AI Winter',
    domain: 'ai',
    year: 1965,
    tags: ['Rules', 'Knowledge', 'Commercialisation'],
    summary: 'Encode an expert’s knowledge as rules so a machine can diagnose and decide in a narrow domain — expert systems brought AI into industry, and exposed its fragility.',
    body: ['In 1965 DENDRAL at Stanford inferred molecular structure from mass spectra; in 1972 MYCIN diagnosed blood infections with about 600 rules, outperforming some physicians. In the 1980s XCON configured DEC computer orders and saved tens of millions of dollars a year. Expert systems were AI’s first commercial wave.', 'But knowledge acquisition was the bottleneck: experts had to distil rules by hand, maintenance was painful, and edge cases broke the system. In 1987 the market for specialised AI hardware collapsed, the boom faded and the second winter arrived. Its legacy is knowledge representation, inference engines and rule engines, all absorbed into business systems and expert-assist tools.'],
    milestones: [
      [1965, 'DENDRAL', 'An expert system for mass spectrometry.'],
      [1972, 'MYCIN', 'Rule-driven medical diagnosis.', 1],
      [1980, 'XCON', 'The commercial peak of expert systems.'],
      [1987, 'The AI winter', 'The market for specialised hardware collapses.']
    ],
    concepts: [['Knowledge base', 'Domain knowledge stored as rules or facts.'], ['Inference engine', 'The program that derives conclusions from rules and facts.'], ['Knowledge acquisition', 'Extracting rules from an expert’s head — the biggest bottleneck.']],
    people: [['Edward Feigenbaum', '1936 – ', 'A founder of expert systems and knowledge engineering.'], ['Bruce Buchanan', '1938 – ', 'Involved in DENDRAL and MYCIN.']],
    related: ['dartmouth', 'statistical-learning', 'deep-learning'],
    reading: [['Expert Systems: Principles and Programming', 'Joseph Giarratano', '1983'], ['Building Expert Systems', 'Hayes-Roth, Waterman & Lenat', '1983']],
    practice: 'Encode 15 rules for a small domain into a forward-chaining engine, then find an input that makes it contradict itself'
  },

  {
    id: 'statistical-learning',
    name: 'Statistical Learning',
    domain: 'ai',
    year: 1988,
    tags: ['Probability', 'Generalisation', 'Kernel methods'],
    summary: 'Learn from data by statistical inference instead of hand-written rules: machine learning changed paradigm in the 1990s.',
    body: ['In the 1980s the limits of expert systems turned researchers to data. In 1988 Pearl’s Probabilistic Reasoning in Intelligent Systems brought Bayesian networks into AI; in 1995 Cortes and Vapnik introduced support vector machines, handling non-linear classification with kernels and offering theoretical generalisation guarantees.', 'The keyword of the period was generalisation: a model must not merely fit the training data but perform on unseen data. Cross-validation, regularisation and the bias–variance trade-off became standard tools. Random forests (2001) and gradient-boosted trees then dominated tabular data for years. Deep learning did not replace them; it added representation learning on top.'],
    milestones: [
      [1988, 'Bayesian networks', 'Probabilistic graphical models.'],
      [1995, 'Support vector machines', 'Kernels and the maximum margin.', 1],
      [2001, 'Random forests', 'The face of ensemble learning.'],
      [2000, 'Gradient-boosted trees', 'The workhorse for tabular data.']
    ],
    concepts: [['Generalisation', 'Performance on unseen data rather than on training error.'], ['Regularisation', 'Constrain model complexity to prevent overfitting.'], ['Kernel methods', 'Map samples into a higher-dimensional space to make non-linear problems separable.']],
    people: [['Vladimir Vapnik', '1936 – ', 'Statistical learning theory and support vector machines.'], ['Judea Pearl', '1936 – ', 'Bayesian networks and causal inference.']],
    related: ['probability-statistics', 'deep-learning', 'perceptron'],
    reading: [['The Elements of Statistical Learning', 'Hastie, Tibshirani & Friedman', '2001'], ['Pattern Recognition and Machine Learning', 'Christopher Bishop', '2006']],
    practice: 'Train a decision tree and an SVM on the same small dataset; plot the bias–variance difference as you change the data size'
  },

  {
    id: 'deep-learning',
    name: 'Deep Learning',
    domain: 'ai',
    year: 1986,
    tags: ['Neural networks', 'Representation learning', 'GPUs'],
    summary: 'Many layers, backpropagation and big data let machines learn hierarchical representations directly from raw input.',
    body: ['In 1986 Rumelhart, Hinton and Williams popularised backpropagation, which made multi-layer networks trainable. In 1989 LeCun used a convolutional network to read handwritten digits, deployed on bank cheques. But limited data and compute sent neural networks quiet again in the late 1990s.', 'In 2006 Hinton’s layer-wise pretraining of deep belief networks revived “deep”; in 2012 AlexNet cut the ImageNet error rate from 26% to 15%, with GPUs, ReLU and dropout all contributing. ResNet (2015), batch normalisation and attention kept pushing the numbers down. The essence of deep learning is representation learning: instead of hand-designed features, the network discovers its own hierarchy.'],
    milestones: [
      [1986, 'Backpropagation', 'Multi-layer networks become trainable.'],
      [1989, 'LeNet', 'A convolutional network reads handwritten digits.'],
      [2006, 'Deep belief networks', 'Layer-by-layer pretraining.'],
      [2012, 'AlexNet', 'GPU-trained deep networks begin.', 1],
      [2015, 'ResNet', 'Residual connections train very deep networks.']
    ],
    concepts: [['Backpropagation', 'Compute gradients with the chain rule, from the output layer back to the input.'], ['Representation learning', 'Let the model learn features rather than relying on hand engineering.'], ['Overfitting', 'Memorising the training data while failing to generalise.']],
    people: [['Geoffrey Hinton', '1947 – ', 'A driving force behind backpropagation and deep learning.'], ['Yann LeCun', '1960 – ', 'A founder of convolutional networks.']],
    related: ['perceptron', 'gpu-computing', 'transformer'],
    reading: [['Deep Learning', 'Goodfellow, Bengio & Courville', '2016'], ['ImageNet Classification with Deep Convolutional Neural Networks', 'Krizhevsky et al.', '2012']],
    practice: 'Train a tiny CNN on MNIST, then remove the convolutions and compare accuracy and parameter count'
  },

  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    domain: 'ai',
    year: 1989,
    tags: ['Decision making', 'Trial and error', 'Games'],
    summary: 'An agent learns a policy through trial and delayed reward; from Q-learning to AlphaGo, it turns games and decisions into trainable models.',
    body: ['In the 1950s optimal control and dynamic programming supplied the theory; in 1989 Watkins proposed Q-learning, estimating action values by iterating the Bellman equation. In 1992 TD-Gammon reached expert backgammon through self-play, showing what temporal-difference learning could do.', 'In 2013 DeepMind’s deep Q-network (DQN) learned Atari games straight from pixels; in 2016 AlphaGo combined policy and value networks with Monte Carlo tree search to beat Lee Sedol; in 2017 AlphaZero learned Go, chess and shogi from scratch by self-play. Sample efficiency and reward design remain hard, but these results carried reinforcement learning into robotics, recommendation and reasoning models.'],
    milestones: [
      [1989, 'Q-learning', 'Model-free temporal-difference control.', 1],
      [1992, 'TD-Gammon', 'An early success at self-play.'],
      [2013, 'DQN', 'Deep reinforcement learning plays Atari.'],
      [2016, 'AlphaGo', 'It beats Lee Sedol.'],
      [2017, 'AlphaZero', 'General game learning from scratch.']
    ],
    concepts: [['Policy', 'The rule mapping states to actions that the agent improves.'], ['Temporal difference', 'Update an estimate from the difference between successive predictions.'], ['Exploration and exploitation', 'Try new actions, or use the best known one — a permanent tension.']],
    people: [['Richard Sutton', '1956 – ', 'Temporal-difference learning and the textbook on RL.'], ['David Silver', '1976 – ', 'Lead researcher on AlphaGo and AlphaZero.']],
    related: ['deep-learning', 'transformer', 'statistical-learning'],
    reading: [['Reinforcement Learning: An Introduction', 'Sutton & Barto', '1998'], ['Human-level control through deep reinforcement learning', 'Mnih et al.', '2015']],
    practice: 'Implement Q-learning on a 5×5 grid world and plot the learned policy after 1000 episodes'
  },

  {
    id: 'transformer',
    name: 'Transformers & Large Language Models',
    domain: 'ai',
    year: 2017,
    tags: ['Attention', 'Large models', 'Generation'],
    summary: 'Replace recurrence with self-attention: Transformers made sequence modelling massively parallel and led to large language models.',
    body: ['In 2014 Bahdanau and colleagues introduced attention into machine translation; in 2017 Google’s Attention Is All You Need proposed the Transformer: self-attention plus feed-forward layers, no recurrence, and training that parallelises heavily. Its core is that every position can attend directly to every other.', 'In 2018 BERT pretrained a bidirectional encoder and GPT an autoregressive decoder. In 2020 GPT-3’s 175 billion parameters demonstrated few-shot learning; in 2022 ChatGPT put a conversational model in front of the public. Transformers spread from language to vision (ViT), proteins (AlphaFold) and multimodality. The price is quadratic attention, and sparsity plus linear attention are still being explored.'],
    milestones: [
      [2014, 'Attention', 'Bahdanau applies it to machine translation.'],
      [2017, 'Transformer', 'The self-attention architecture.', 1],
      [2018, 'BERT and GPT', 'Pretrain then fine-tune; pretrain then generate.'],
      [2020, 'GPT-3', 'Scale brings few-shot ability.'],
      [2022, 'ChatGPT', 'Large models reach the mass market.']
    ],
    concepts: [['Self-attention', 'Each position aggregates information from others according to relevance.'], ['Positional encoding', 'Inject order information into a structure with no recurrence.'], ['Scaling laws', 'Loss falls as a power law in parameters, data and compute.']],
    people: [['Ashish Vaswani', '1986 – ', 'Lead author of the Transformer paper.'], ['Ilya Sutskever', '1986 – ', 'OpenAI co-founder; a driving force behind the GPT series.']],
    related: ['deep-learning', 'generative-models', 'gpu-computing'],
    reading: [['Attention Is All You Need', 'Vaswani et al.', '2017'], ['Language Models are Few-Shot Learners', 'Brown et al.', '2020']],
    practice: 'Implement single-head self-attention in 20 lines of NumPy and verify the output shape and the causal mask'
  },

  {
    id: 'generative-models',
    name: 'Generative Models',
    domain: 'ai',
    year: 2014,
    tags: ['GANs', 'Diffusion', 'Multimodality'],
    summary: 'From the adversarial game of GANs to the denoising of diffusion models, generative models taught machines to create images, audio and video.',
    body: ['In 2014 Goodfellow proposed generative adversarial networks: a generator fakes and a discriminator judges, and both improve through the contest. GANs produce convincing images but are hard to train and prone to mode collapse. That same year variational autoencoders (VAEs) offered another route through probabilistic latent variables.', 'In 2020 denoising diffusion models (DDPM) split generation into hundreds of steps of adding and removing noise: stable to train, high sample quality. In 2021 CLIP mapped text and images into one space, and DALL·E and Stable Diffusion made “drawing with words” a mass-market tool. Video generation arrived by 2024. The next steps are better control, lower cost and verifiable rights.'],
    milestones: [
      [2014, 'GANs', 'Adversarial training generates images.', 1],
      [2014, 'VAEs', 'Variational inference with latent variables.'],
      [2020, 'DDPM', 'Diffusion models.'],
      [2021, 'CLIP and DALL·E', 'Aligning text and images.'],
      [2022, 'Stable Diffusion', 'Open-source image generation.']
    ],
    concepts: [['Adversarial training', 'Generator and discriminator compete and approach the true distribution.'], ['Diffusion process', 'Add noise, then learn to remove it step by step to sample from noise.'], ['Multimodal alignment', 'Text and images correspond inside one semantic space.']],
    people: [['Ian Goodfellow', '1987 – ', 'Inventor of GANs.'], ['Robin Rombach', '1991 – ', 'Core author of Stable Diffusion.']],
    related: ['deep-learning', 'transformer', 'rendering'],
    reading: [['Generative Adversarial Networks', 'Goodfellow et al.', '2014'], ['Denoising Diffusion Probabilistic Models', 'Ho et al.', '2020']],
    practice: 'Train a tiny VAE on MNIST and look at reconstructions versus samples — explain the difference'
  }

]);
