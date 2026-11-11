/* 08 — Software engineering */
CS.addTopics([

  {
    id: 'software-crisis',
    name: 'The Software Crisis',
    domain: 'engineering',
    year: 1968,
    tags: ['Scale', 'Method', 'Structure'],
    summary: 'Hardware got faster while software got harder to deliver; the 1968 “software crisis” gave birth to software engineering.',
    body: ['Through the 1960s large software projects ran over budget, slipped or failed outright. In 1968 NATO held a conference in Garmisch, Germany, that put the term “software engineering” on the table, hoping to bring engineering discipline to software. That same year Dijkstra published his short note “Go To Statement Considered Harmful”, arguing for structured control flow over arbitrary jumps.', 'The crisis was not a one-off but the normal condition of scale: requirements change, people leave, systems age. It produced lifecycle models, structured methods, modularity and eventually the agile movement. Every change of methodology is really an answer to the same question: how do you keep software written by many hands understandable over time?'],
    milestones: [
      [1968, 'The NATO software engineering conference', 'The moment the discipline is named.', 1],
      [1968, 'Dijkstra on goto', 'A manifesto for structured programming.', 'undefined'],
      [1975, 'The Mythical Man-Month', 'Brooks\'s law: adding people does not speed things up.', 'undefined']
    ],
    concepts: [['The software crisis', 'Cost, schedule and quality that consistently miss what was promised.'], ['Structured programming', 'Organising control flow with sequence, selection and iteration only.'], ['Brooks’s law', 'Adding people to a late project makes it later.']],
    people: [['Fred Brooks', '1931 – 2022', 'Author of The Mythical Man-Month; managed IBM OS/360.'], ['Edsger Dijkstra', '1930 – 2002', 'A pioneer of structured programming and algorithm design.']],
    related: ['waterfall', 'agile', 'algol'],
    reading: [['The Mythical Man-Month', 'Fred Brooks', '1975'], ['Notes on Structured Programming', 'Edsger Dijkstra', '1968']],
    practice: 'Take a real project’s bug list and classify each bug by which phase should have caught it — then say what you would change'
  },

  {
    id: 'waterfall',
    name: 'Waterfall & the Software Lifecycle',
    domain: 'engineering',
    year: 1970,
    tags: ['Process', 'Documentation', 'Phases'],
    summary: 'Requirements, design, implementation, testing, maintenance: waterfall made development a sequence of controllable stages — and exposed how rigid that is.',
    body: ['In 1970 Royce drew the “waterfall” in a paper: each phase completes before the next begins, with backtracking where needed. He himself argued for iteration, but the simplified diagram was widely adopted and became the standard process of governments and large enterprises.', 'Waterfall suits projects with stable requirements and heavy compliance, and struggles with uncertainty. Document-driven stage gates make change expensive, and users often see the product only at the end. The spiral model of the 1980s and the iterative methods of the 1990s were corrections. Waterfall never disappeared; it now appears mixed with agile in aviation, medical and infrastructure software.'],
    milestones: [
      [1970, 'Royce\'s waterfall paper', 'The classic statement of staged process.', 1],
      [1970, 'The SDLC spreads', 'The software lifecycle becomes a management framework.', 'undefined'],
      [1986, 'The spiral model', 'Boehm introduces risk management.', 'undefined'],
      [2001, 'The Agile Manifesto', 'A reaction against document-heavy process, written at Snowbird.', 'undefined']
    ],
    concepts: [['Lifecycle', 'The division into phases from requirements to maintenance.'], ['Stage gate', 'A review and a set of deliverables at the end of each phase.'], ['Requirements freeze', 'Requirements locked before development, assuming change is expensive.']],
    people: [['Winston Royce', '1929 – 1995', 'Formulated the waterfall model.'], ['Barry Boehm', '1935 – ', 'The spiral model and software economics.']],
    related: ['software-crisis', 'agile', 'open-source'],
    reading: [['Managing the Development of Large Software Systems', 'Winston Royce', '1970'], ['Software Engineering Economics', 'Barry Boehm', '1981']],
    practice: 'Write a one-page plan for a small feature in waterfall style, then rewrite it as two-week iterations; note what became unknowable'
  },

  {
    id: 'agile',
    name: 'Agile Software Development',
    domain: 'engineering',
    year: 2001,
    tags: ['Iteration', 'Feedback', 'Collaboration'],
    summary: 'Responding to change over following a plan: agile turned delivery into short, runnable iterations.',
    body: ['In the 1990s XP, Scrum and Crystal each explored lightweight processes. In 2001 seventeen practitioners met at Snowbird, Utah, and published the Agile Manifesto: individuals and interactions, working software, customer collaboration and responding to change, valued above process, documentation, contracts and plans.', 'The core of agile is a shorter feedback loop: two-week iterations, continuous integration, automated tests, pair programming. It is not “no process” but a smaller, more adjustable one. Twenty-odd years on agile is mainstream, and often criticised as ritualised — stand-ups and boards standing in for real autonomy and experiment.'],
    milestones: [
      [1999, 'Extreme Programming Explained', 'Kent Beck systematises XP.', 'undefined'],
      [2001, 'The Agile Manifesto', 'A reaction against document-heavy process, written at Snowbird.', 1],
      [2002, 'Scrum spreads', 'Iterations and role separation.', 'undefined'],
      [2010, 'Agile at scale', 'Frameworks such as SAFe appear.', 'undefined']
    ],
    concepts: [['Iteration', 'Deliver a runnable increment inside a fixed time box.'], ['User story', 'Describe a requirement from the user’s point of view so it can be prioritised.'], ['Continuous integration', 'Merge code often and build and test it automatically.']],
    people: [['Kent Beck', '1961 – ', 'Extreme programming and test-driven development.'], ['Jeff Sutherland', '1941 – ', 'Co-creator of Scrum.']],
    related: ['waterfall', 'open-source', 'version-control'],
    reading: [['Manifesto for Agile Software Development', 'Beck et al.', '2001'], ['Extreme Programming Explained', 'Kent Beck', '1999']],
    practice: 'Run a two-week iteration on your own project: board, daily notes, review — and record what the process did not catch'
  },

  {
    id: 'open-source',
    name: 'The Open Source Movement',
    domain: 'engineering',
    year: 1983,
    tags: ['Collaboration', 'Licences', 'Community'],
    summary: 'Public source code and licences that permit modification and redistribution: open source scaled collaboration worldwide and reshaped business models.',
    body: ['In 1983 Stallman launched the GNU project to build a free operating system; in 1985 the Free Software Foundation was founded, and the GPL used copyleft to keep code and its derivatives free. In 1991 the Linux kernel was released, and GNU tools plus Linux formed a complete system.', 'In 1998 the Open Source Initiative coined “open source”, softening the ideology and emphasising the development method. Apache, MySQL, Eclipse and later GitHub made open source the default way to collaborate. Today almost all commercial software depends on open-source components — and supply-chain security has become the new problem.'],
    milestones: [
      [1983, 'The GNU project', 'The free-software movement begins.', 1],
      [1985, 'The Free Software Foundation', 'An organisational and legal home for GNU.', 'undefined'],
      [1989, 'The GPL, version 1', 'Copyleft becomes law.', 'undefined'],
      [1991, 'The Linux kernel', 'A model of global collaboration.', 'undefined'],
      [1998, 'The OSI is founded', 'The term \'open source\' is coined.', 'undefined'],
      [2008, 'GitHub', 'Social collaboration for code.', 'undefined']
    ],
    concepts: [['Licences', 'Legal text setting the conditions for use, modification and redistribution.'], ['Copyleft', 'Derivative works must keep the same free licence.'], ['Community governance', 'The decision structure among maintainers, contributors and foundations.']],
    people: [['Richard Stallman', '1953 – ', 'Founder of GNU and the Free Software Foundation.'], ['Linus Torvalds', '1969 – ', 'Creator of Linux and Git.']],
    related: ['unix', 'version-control', 'cloud-computing'],
    reading: [['The Cathedral and the Bazaar', 'Eric Raymond', '1999'], ['Free Software, Free Society', 'Richard Stallman', '2002']],
    practice: 'Pick a small open-source project, read its licence, and send one documentation fix through the full PR process'
  },

  {
    id: 'version-control',
    name: 'Version Control & Git',
    domain: 'engineering',
    year: 1972,
    tags: ['History', 'Branches', 'Collaboration'],
    summary: 'From SCCS to Git, version control made history traceable, branches parallel and collaboration mergeable.',
    body: ['In 1972 SCCS stored source versions as deltas; in 1982 RCS simplified single-file version control; in 1990 CVS supported many files and many people and became the default for open-source projects. In 2000 SVN improved on centralised repositories with atomic commits.', 'In 2005 the Linux community needed a new distributed system, and Torvalds wrote Git in about two weeks: every clone is a full repository, commits are identified by content hashes, and a branch is just a pointer. Git’s snapshot model and cheap branches changed workflows, and GitHub turned code hosting into a social network. Today a commit history is itself a form of engineering documentation.'],
    milestones: [
      [1972, 'SCCS', 'One of the first version-control systems.', 'undefined'],
      [1982, 'RCS', 'Version control for single files.', 'undefined'],
      [1990, 'CVS', 'Multi-person collaboration and open source.', 'undefined'],
      [2000, 'SVN', 'A central repository with atomic commits.', 'undefined'],
      [2005, 'Git', 'Distributed version control.', 1]
    ],
    concepts: [['Commit', 'An immutable snapshot identified by a content hash.'], ['Branch', 'A lightweight pointer to a commit, almost free to create.'], ['Merge', 'Bring the changes of two histories back together.']],
    people: [['Mark Rochkind', '1953 – ', 'Author of RCS.'], ['Linus Torvalds', '1969 – ', 'Creator of Git.']],
    related: ['open-source', 'agile', 'software-crisis'],
    reading: [['Pro Git', 'Chacon & Straub', '2009'], ['Pragmatic Version Control', 'Mike Mason', '2005']],
    practice: 'Rebuild the same three-branch history twice: once with merge commits, once rebased — then argue which is easier to audit'
  }

]);
