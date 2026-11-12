/* 08 — Software engineering */
CS.addTopics([

  {
    id: 'software-crisis',
    name: 'The Software Crisis',
    domain: 'engineering',
    year: 1968,
    tags: ['Scale', 'Method', 'Structure'],
    summary: 'Hardware got faster while software got harder to deliver; the 1968 “software crisis” gave birth to software engineering.',
    body: [
      'The crisis was arithmetically inevitable. Hardware capability grew exponentially through the 1960s while the cost of writing software stayed roughly proportional to the number of people doing it, and people do not scale exponentially. Projects that had been feasible with ten programmers became necessary at a hundred, and at that size the failure modes changed completely: nobody could hold the system in their head, so coordination cost grew faster than output.',
      'The symptoms were consistent enough to name. Projects ran over budget by multiples rather than percentages; deliveries slipped by years; systems were abandoned after being paid for. The failures were not caused by bad programmers — the same people succeeded on smaller systems — but by scale, changing requirements and the absence of any shared vocabulary for designing something large. That last gap is what a discipline was supposed to fill.',
      'In October 1968 NATO convened a working conference at Garmisch, Germany, and deliberately used the phrase "software engineering" as a provocation: the point was that software production ought to resemble engineering, with established methods, measurable quality and professional responsibility. The conference proceedings read like a diagnosis, not a solution — participants disagreed about whether the problem was technique, management or the nature of the medium.',
      'The same year produced the most influential single argument about structure. Dijkstra\'s two-page note "Go To Statement Considered Harmful" claimed that the quality of a program depends on how well its progress can be described independently of its execution order, and that unrestricted jumps destroy that property. The debate that followed was not about style. It was about whether control flow could be reasoned about at all, and it pushed the field toward structured programming, then toward modular decomposition.',
      'The response took two shapes. Structured methods — top-down design, data flow diagrams, formal lifecycle phases — tried to make large systems plannable in advance, and produced the waterfall model and its documentation gates. Iterative methods tried the opposite: accept that requirements will change, and shorten the loop between deciding and finding out. The two traditions have argued ever since, and the argument is visible on this site\'s pages for waterfall and agile.',
      'The useful reading is that the crisis never ended, it normalised. Requirements still change, people still leave, systems still age; the difference is that the industry now has vocabulary for the problem and a menu of responses. The question posed at Garmisch — how do you keep software written by many hands understandable over time — is still the correct question, and no methodology has made it disappear.'
    ],
    milestones: [
      [1968, 'The NATO software engineering conference', 'The moment the discipline is named.', 1],
      [1968, 'Dijkstra on goto', 'A manifesto for structured programming.'],
      [1975, 'The Mythical Man-Month', 'Brooks\'s law: adding people does not speed things up.']
    ],
    concepts: [['The software crisis', 'Cost, schedule and quality that consistently miss what was promised.'], ['Structured programming', 'Organising control flow with sequence, selection and iteration only.'], ['Brooks’s law', 'Adding people to a late project makes it later.']],
    people: [['Fred Brooks', '1931 – 2022', 'Author of The Mythical Man-Month; managed IBM OS/360.'], ['Edsger Dijkstra', '1930 – 2002', 'A pioneer of structured programming and algorithm design.']],
    related: ['waterfall', 'agile', 'algol'],
    reading: [
      ['Software Engineering Techniques (NATO conference report)', 'J. N. Buxton & B. Randell (eds.)', '1969', 'http://homepages.cs.ncl.ac.uk/brian.randell/NATO/nato1969.PDF', 'paper'],
      ['Go To Statement Considered Harmful', 'Edsger W. Dijkstra', '1968', 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', 'paper'],
      ['The Software Crisis', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Software_crisis', 'wiki'],
      ['The Mythical Man-Month', 'Fred Brooks', '1975', '', 'book']
    ],
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
      [1970, 'The SDLC spreads', 'The software lifecycle becomes a management framework.'],
      [1986, 'The spiral model', 'Boehm introduces risk management.'],
      [2001, 'The Agile Manifesto', 'A reaction against document-heavy process, written at Snowbird.']
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
    body: [
      'Agile began as a reaction, not a methodology. Through the 1990s a group of practitioners — Beck with Extreme Programming, Schwaber and Beedle with Scrum, Cockburn with Crystal — had each arrived at the same suspicion: the document-heavy, plan-first process that dominated large organisations was producing paper rather than working software. In February 2001 seventeen of them met at Snowbird, Utah, and wrote four sentences.',
      'The manifesto\'s form matters as much as its content. It states four preferences — individuals and interactions over processes and tools, working software over comprehensive documentation, customer collaboration over contract negotiation, responding to change over following a plan — each explicitly acknowledging that the right-hand items have value. That qualifier is what turned a slogan into something implementable, and it is also what most of the later ritual forgot.',
      'The mechanism underneath is a shorter feedback loop, and everything else follows from it. Two-week iterations mean requirements are re-examined while the cost of changing them is still small. Continuous integration means integration problems surface in minutes rather than at a quarterly merge. Automated tests mean refactoring is safe, which is what makes incremental design possible at all. Pair programming trades typing speed for review that happens before the mistake ships.',
      'That is why agile is not "no process". It is a smaller process with higher frequency: less up-front design, more frequent correction, and a deliberate bet that the cost of rework is lower than the cost of being wrong for a year. The bet fails when iterations are too long to correct anything, when tests are missing so change is unsafe, or when the customer is a proxy who cannot actually make decisions.',
      'Scaling is where the theory strains. The manifesto was written by and for small co-located teams; large organisations adopted the vocabulary while keeping the structures that make autonomy impossible. The result is what critics call "agile in name only": daily stand-ups that are status reports to a manager, story points used as a productivity metric, and sprints treated as two-week waterfalls with a fixed scope.',
      'The honest summary is that agile delivered on its technical claims and disappointed on its organisational ones. Continuous integration, automated testing and incremental delivery are now simply how good software is built. Self-organising teams and genuine customer collaboration remain rare, not because the ideas failed but because they require giving up control that most organisations are unwilling to give up.'
    ],
    milestones: [
      [1999, 'Extreme Programming Explained', 'Kent Beck systematises XP.'],
      [2001, 'The Agile Manifesto', 'A reaction against document-heavy process, written at Snowbird.', 1],
      [2002, 'Scrum spreads', 'Iterations and role separation.'],
      [2010, 'Agile at scale', 'Frameworks such as SAFe appear.']
    ],
    concepts: [['Iteration', 'Deliver a runnable increment inside a fixed time box.'], ['User story', 'Describe a requirement from the user’s point of view so it can be prioritised.'], ['Continuous integration', 'Merge code often and build and test it automatically.']],
    people: [['Kent Beck', '1961 – ', 'Extreme programming and test-driven development.'], ['Jeff Sutherland', '1941 – ', 'Co-creator of Scrum.']],
    related: ['waterfall', 'open-source', 'version-control'],
    reading: [
      ['Manifesto for Agile Software Development', 'Beck et al.', '2001', 'https://agilemanifesto.org/', 'article'],
      ['Extreme Programming Explained', 'Kent Beck', '1999', '', 'book'],
      ['Agile software development', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Agile_software_development', 'wiki'],
      ['The Scrum Guide', 'Schwaber & Sutherland', '2020', 'https://scrumguides.org/scrum-guide.html', 'article']
    ],
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
      [1985, 'The Free Software Foundation', 'An organisational and legal home for GNU.'],
      [1989, 'The GPL, version 1', 'Copyleft becomes law.'],
      [1991, 'The Linux kernel', 'A model of global collaboration.'],
      [1998, 'The OSI is founded', 'The term \'open source\' is coined.'],
      [2008, 'GitHub', 'Social collaboration for code.']
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
      [1972, 'SCCS', 'One of the first version-control systems.'],
      [1982, 'RCS', 'Version control for single files.'],
      [1990, 'CVS', 'Multi-person collaboration and open source.'],
      [2000, 'SVN', 'A central repository with atomic commits.'],
      [2005, 'Git', 'Distributed version control.', 1]
    ],
    concepts: [['Commit', 'An immutable snapshot identified by a content hash.'], ['Branch', 'A lightweight pointer to a commit, almost free to create.'], ['Merge', 'Bring the changes of two histories back together.']],
    people: [['Mark Rochkind', '1953 – ', 'Author of RCS.'], ['Linus Torvalds', '1969 – ', 'Creator of Git.']],
    related: ['open-source', 'agile', 'software-crisis'],
    reading: [['Pro Git', 'Chacon & Straub', '2009'], ['Pragmatic Version Control', 'Mike Mason', '2005']],
    practice: 'Rebuild the same three-branch history twice: once with merge commits, once rebased — then argue which is easier to audit'
  }

]);
