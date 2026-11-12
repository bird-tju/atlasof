/* 09 — Data and databases */
CS.addTopics([

  {
    id: 'relational-model',
    name: 'The Relational Model',
    domain: 'data',
    year: 1970,
    tags: ['Tables', 'Algebra', 'Independence'],
    summary: 'Data as two-dimensional tables and queries as relational algebra: Codd’s model gave databases a mathematical foundation.',
    body: ['In 1970 Codd at IBM published a paper proposing to represent data as relations — tables — and describe queries in first-order logic. Hierarchical and network databases before it forced programmers to navigate physical structure; the relational model separated what you want from how to get it.', 'In 1974 the System R prototype delivered SQL and query optimisation; in 1979 Oracle shipped the first commercial relational database. The model survived the objection that it could not be as fast as network databases, and won on optimisers and transaction support. Today almost every data system inherits its interface in some form.'],
    milestones: [
      [1970, 'Codd\'s relational model', 'Tables, relational algebra and data independence.', 1],
      [1974, 'System R', 'A prototype of SQL and query optimisation.'],
      [1979, 'Oracle goes commercial', 'The relational database reaches the market.'],
      [1986, 'SQL is standardised', 'ANSI SQL.']
    ],
    concepts: [['Relation', 'A table of rows and columns, mathematically a set of tuples.'], ['Relational algebra', 'An algebra of selection, projection, join and the rest.'], ['Data independence', 'Logical structure separated from physical storage, so applications survive storage changes.']],
    people: [['Edgar F. Codd', '1923 – 2003', 'Proposed the relational model.'], ['Donald Chamberlin', '1944 – ', 'Co-designer of SQL.']],
    related: ['sql', 'transactions', 'nosql'],
    reading: [['The Relational Model for Database Management', 'Edgar F. Codd', '1990'], ['Database System Concepts', 'Silberschatz et al.', '1997']],
    practice: 'Take a spreadsheet and express five of its questions as relational algebra, then as SQL — compare which one hid the work'
  },

  {
    id: 'sql',
    name: 'SQL',
    domain: 'data',
    year: 1974,
    tags: ['Queries', 'Declarative', 'Standards'],
    summary: 'A declarative query language: you describe what you want, and the optimiser decides how to get it.',
    body: ['In 1974 Chamberlin and Boyce proposed SEQUEL at IBM, later renamed SQL. It rests on relational algebra but expresses joins, filters and aggregates in a syntax close to English. ANSI standardised it in 1986, and it has been the most durable interface in data ever since.', 'SQL’s success is its declarativeness: users need not think about indexes or execution order, the optimiser chooses the plan. That same success made it a language of many dialects — window functions, CTEs, JSON and vector search keep being added. Today, from embedded databases to data warehouses, SQL remains the common tongue of data analysis.'],
    milestones: [
      [1974, 'SEQUEL is proposed', 'IBM\'s relational query language.'],
      [1979, 'Oracle ships SQL', 'Commercial adoption spreads.'],
      [1986, 'SQL-86', 'Standardised by ANSI.', 1],
      [1992, 'SQL-92', 'One of the most important revisions of the standard.'],
      [2003, 'Window functions', 'Analytical queries get stronger.']
    ],
    concepts: [['Declarative query', 'Describe the result without prescribing the procedure.'], ['Join', 'Combine several tables on a condition.'], ['Query plan', 'The execution strategy the optimiser picks, such as an index scan or a hash join.']],
    people: [['Donald Chamberlin', '1944 – ', 'Co-designer of SQL.'], ['Raymond Boyce', '1947 – ', 'Co-designer of SQL.']],
    related: ['relational-model', 'transactions', 'big-data'],
    reading: [['SQL in a Nutshell', 'Kevin Kline', '2011'], ['Database System Concepts', 'Silberschatz et al.', '1997']],
    practice: 'Write the same query three ways (join, subquery, window function) and compare the three query plans'
  },

  {
    id: 'transactions',
    name: 'Transactions & ACID',
    domain: 'data',
    year: 1981,
    tags: ['Concurrency', 'Isolation', 'Recovery'],
    summary: 'A transaction bundles operations into all-or-nothing; ACID makes concurrency and failure something you can reason about.',
    body: ['In the 1970s System R introduced transactions and two-phase locking. In 1981 Jim Gray laid out atomicity, consistency, isolation and durability; in 1983 Härder and Reuter coined the acronym ACID. Isolation levels — read uncommitted, read committed, repeatable read, serialisable — define exactly what concurrent transactions may see of each other.', 'Implementing transactions needs logs, locks and a recovery protocol. Write-ahead logging (WAL) makes crash replay possible; MVCC stops reads from blocking writes. Distributed transactions add the complexity of two-phase commit and consensus. Today ACID is no longer an enterprise luxury but a baseline promise of nearly every database.'],
    milestones: [
      [1976, 'Transactions in System R', 'Two-phase locking and recovery.'],
      [1981, 'Gray\'s transaction paper', 'ACID made systematic.', 1],
      [1983, 'The term ACID', 'Coined by Härder and Reuter.'],
      [1990, 'MVCC spreads', 'Reads stop blocking writes.'],
      [2012, 'Spanner', 'Globally distributed, strongly consistent transactions.']
    ],
    concepts: [['Atomicity', 'All operations take effect, or none do.'], ['Isolation level', 'The visibility contract between concurrent transactions.'], ['WAL', 'Write the log before the data, so a crash can be recovered.']],
    people: [['Jim Gray', '1944 – 2007', 'A pioneer of transaction processing and database systems.'], ['Michael Stonebraker', '1943 – ', 'A driving force behind Postgres and column stores.']],
    related: ['relational-model', 'sql', 'distributed-databases'],
    reading: [['Transaction Processing: Concepts and Techniques', 'Gray & Reuter', '1992'], ['Database System Concepts', 'Silberschatz et al.', '1997']],
    practice: 'Open two database sessions, reproduce a lost update under read committed, then fix it with the right isolation level'
  },

  {
    id: 'nosql',
    name: 'NoSQL',
    domain: 'data',
    year: 2006,
    tags: ['Key-value', 'Documents', 'Eventual consistency'],
    summary: 'When volume, concurrency or schema flexibility outgrew the relational model, a family of non-relational databases appeared.',
    body: ['In the mid-2000s Google’s BigTable (2006) and Amazon’s Dynamo (2007) showed another path: key-value stores, column families, eventual consistency and horizontal scale. In 2009 MongoDB and Redis brought documents and in-memory structures into the mainstream, and “NoSQL” became a slogan.', 'NoSQL is not one technology but a set of trades: give up a rigid schema and cross-row transactions for elasticity and throughput. Engineering soon found that most applications still wanted transactions and queries, and NewSQL and a relational revival followed. Today “NoSQL” names a family of data models rather than a rejection of SQL.'],
    milestones: [
      [2006, 'BigTable', 'Column families and distributed indexes.'],
      [2007, 'Dynamo', 'Eventual consistency and consistent hashing.', 1],
      [2009, 'MongoDB and Redis', 'Document and in-memory stores go mainstream.'],
      [2012, 'NewSQL', 'Fusion routes such as VoltDB and Spanner.']
    ],
    concepts: [['Key-value store', 'The simplest model: one key, one value.'], ['Document database', 'Stores semi-structured data as JSON/BSON documents.'], ['Eventual consistency', 'Replicas diverge for a while, then converge once writes stop.']],
    people: [['Jeff Dean', '1968 – ', 'A driving force behind BigTable, MapReduce and Spanner.'], ['Sanjay Ghemawat', '1968 – ', 'BigTable and the Google File System.']],
    related: ['big-data', 'distributed-databases', 'transactions'],
    reading: [['NoSQL Distilled', 'Sadalage & Fowler', '2012'], ['Database System Concepts', 'Silberschatz et al.', '1997']],
    practice: 'Model one feature (a comment thread) in a relational schema and in a document store, then list what each makes hard'
  },

  {
    id: 'big-data',
    name: 'Big Data & MapReduce',
    domain: 'data',
    year: 2004,
    tags: ['Distributed', 'Batch', 'Clusters'],
    summary: 'When one machine can no longer hold the data, MapReduce turns a cluster into a computer by moving computation to the data.',
    body: ['Google published GFS in 2003 and MapReduce in 2004: split the computation into map and reduce stages and let the framework handle scheduling, fault tolerance and data locality. In 2006 Hadoop open-sourced the idea, and with HDFS it became the first generation of big-data infrastructure.', 'The batch model was simple but slow, especially for iterative algorithms. In 2010 Spark used in-memory resilient distributed datasets (RDDs) to speed iteration by an order of magnitude, and Flink treated streaming as a first-class citizen. Today the boundary of “big data” has blurred, and batch-plus-streaming plus the lakehouse have become the new consensus.'],
    milestones: [
      [2003, 'The GFS paper', 'A distributed file system.'],
      [2004, 'The MapReduce paper', 'A programming model for batch processing.', 1],
      [2006, 'Hadoop', 'The open-source implementation.'],
      [2010, 'Spark', 'In-memory computing and RDDs.'],
      [2014, 'Flink', 'Stream and batch in one engine.']
    ],
    concepts: [['Data locality', 'Schedule computation on the machine that holds the data to avoid network transfer.'], ['Sharding', 'Cut data into blocks and spread them across machines.'], ['Fault tolerance', 'Re-run the failed task rather than restarting the whole job.']],
    people: [['Jeff Dean', '1968 – ', 'Core author of GFS, MapReduce and BigTable.'], ['Matei Zaharia', '1984 – ', 'Creator of Spark.']],
    related: ['distributed-databases', 'cloud-computing', 'nosql'],
    reading: [['MapReduce: Simplified Data Processing on Large Clusters', 'Dean & Ghemawat', '2004'], ['Spark: The Definitive Guide', 'Damji et al.', '2017']],
    practice: 'Run word count on a 1 GB file with MapReduce and with Spark; compare wall-clock time and bytes shuffled'
  },

  {
    id: 'distributed-databases',
    name: 'Distributed Databases',
    domain: 'data',
    year: 2012,
    tags: ['Sharding', 'Replication', 'Consensus'],
    summary: 'Replicate data across machines and datacentres while keeping transactions and consistency — a fine-grained trade-off inside CAP.',
    body: ['Distributed databases were theorised in the 1980s but limited by networks and hardware. In 2000 the CAP theorem reminded everyone that under a network partition you cannot have both consistency and availability. In 2012 Google’s Spanner used TrueTime — GPS and atomic clocks — to make clock uncertainty explicit and delivered strongly consistent transactions worldwide.', 'After Spanner, NewSQL systems such as CockroachDB, TiDB and YugabyteDB replicated logs with Raft and Paxos, folding sharding, transactions and consensus into one system. Their aim is not to replace every database but to offer a simpler answer than hand-rolled sharding wherever global distribution and strong consistency are required.'],
    milestones: [
      [2000, 'The CAP theorem', 'Consistency, availability, partition tolerance.'],
      [2007, 'Dynamo', 'Eventual consistency and consistent hashing.'],
      [2012, 'Spanner', 'Globally distributed, strongly consistent transactions.', 1],
      [2015, 'Raft becomes popular', 'A consensus algorithm you can understand.'],
      [2017, 'CockroachDB and TiDB', 'NewSQL goes commercial.']
    ],
    concepts: [['Sharding', 'Split data across nodes by range or by hash.'], ['Replication', 'Keep the same data on several nodes to raise availability.'], ['CAP', 'Consistency, availability and partition tolerance: you cannot have all three.']],
    people: [['Eric Brewer', '1964 – ', 'Proposed the CAP theorem.'], ['James Corbett', '1968 – ', 'Lead author of the Spanner paper.']],
    related: ['transactions', 'consensus', 'cloud-computing'],
    reading: [['Spanner: Google’s Globally-Distributed Database', 'Corbett et al.', '2012'], ['Designing Data-Intensive Applications', 'Martin Kleppmann', '2018']],
    practice: 'Split a small table across three nodes by hash, then run a cross-shard join by hand and count the round trips'
  }

]);
