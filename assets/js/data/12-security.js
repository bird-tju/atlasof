/* 12 — Security and cryptography */
CS.addTopics([

  {
    id: 'public-key',
    name: 'Public-Key Cryptography',
    domain: 'security',
    year: 1976,
    tags: ['Key exchange', 'Signatures', 'Hard problems'],
    summary: 'A pair of keys separates encryption from decryption, letting strangers establish a secret over a public channel.',
    body: ['In 1976 Diffie and Hellman proposed public-key cryptography and a key-exchange protocol: two parties agree on a shared key over a public channel that an eavesdropper cannot compute. In 1977 Rivest, Shamir and Adleman built RSA, using the hardness of factoring large integers for both encryption and signatures.', 'Public-key cryptography solved the key-distribution problem of symmetric ciphers and became the basis of digital signatures, certificates and TLS. In 1985 Koblitz and Miller proposed elliptic-curve cryptography, reaching the same security with much shorter keys. Today RSA and ECC carry almost every secure connection — and quantum computing threatens both.'],
    milestones: [
      [1976, 'Diffie–Hellman', 'Public-key cryptography and key exchange.', 1],
      [1977, 'RSA', 'The difficulty of factoring large integers.'],
      [1985, 'Elliptic-curve cryptography', 'Shorter keys for the same strength.'],
      [1991, 'PGP', 'Public-key encryption for individuals.']
    ],
    concepts: [['Public and private keys', 'The public key may be published for encryption or verification; the private key stays secret.'], ['Key exchange', 'Agree on a shared session key over an insecure channel.'], ['Digital signature', 'Sign with the private key, verify with the public one, proving origin and integrity.']],
    people: [['Whitfield Diffie', '1944 – ', 'Co-inventor of public-key cryptography and key exchange.'], ['Ron Rivest', '1947 – ', 'Co-inventor of RSA.']],
    related: ['tls', 'hash-mac', 'post-quantum'],
    reading: [['New Directions in Cryptography', 'Diffie & Hellman', '1976'], ['Applied Cryptography', 'Bruce Schneier', '1993']],
    practice: 'Implement Diffie–Hellman over a small prime by hand, then exchange a message with a classmate'
  },

  {
    id: 'hash-mac',
    name: 'Hashes & Message Authentication',
    domain: 'security',
    year: 1979,
    tags: ['Fingerprints', 'Integrity', 'Passwords'],
    summary: 'Hashing compresses any data into a fixed-length fingerprint; MACs and signatures use it to verify integrity and origin over untrusted channels.',
    body: ['In 1979 Merkle introduced hash trees and a security definition for one-way hash functions. MD4 appeared in 1990, followed by MD5 (1992) and SHA-1 (1995). Hashes went into password storage, data integrity, digital signatures and blockchains.', 'Hash functions age: in 2004 Wang Xiaoyun’s team broke the collision resistance of MD5 and SHA-1, accelerating the move to SHA-2 and SHA-3. Password storage evolved from salted hashes to bcrypt, scrypt and Argon2, which use computational cost against brute force. A hash is not encryption — it is irreversible, and should not be used as one.'],
    milestones: [
      [1979, 'Merkle trees', 'A structure for verifying integrity.'],
      [1992, 'MD5', 'Widely used, later found to collide.'],
      [1995, 'SHA-1', 'The basis of TLS and Git.', 1],
      [2004, 'MD5 and SHA-1 collisions', 'Attacks by Wang Xiaoyun\'s team.'],
      [2015, 'SHA-3', 'Keccak is standardised.']
    ],
    concepts: [['Collision resistance', 'It is hard to find two different inputs with the same hash.'], ['Salting', 'Add a random value per password to defeat rainbow tables.'], ['Hash tree', 'A tree structure that verifies the integrity of large data efficiently.']],
    people: [['Ralph Merkle', '1952 – ', 'A pioneer of hash trees and public-key cryptography.'], ['Wang Xiaoyun', '1966 – ', 'Found the collision attacks on MD5 and SHA-1.']],
    related: ['public-key', 'tls', 'blockchain'],
    reading: [['Handbook of Applied Cryptography', 'Menezes et al.', '1996'], ['On the Security of Hash Functions', 'Rogaway et al.', '2004']],
    practice: 'Break a toy 24-bit hash by brute force, then redo it with a salted hash and compare the effort'
  },

  {
    id: 'tls',
    name: 'TLS & Secure Transport',
    domain: 'security',
    year: 1995,
    tags: ['Handshake', 'Certificates', 'HTTPS'],
    summary: 'Build a trusted channel on an untrusted network: TLS negotiates keys in a handshake, confirms identity with certificates and protects data with AEAD.',
    body: ['In 1994 Netscape began designing SSL for its browser and shipped SSL 2.0 in 1995. In 1999 the IETF took it over and renamed it TLS 1.0. In 2014 Heartbleed exposed implementation risk in OpenSSL; in 2018 TLS 1.3 simplified the handshake, removed weak algorithms and made forward secrecy the default.', 'TLS rests on a chain of certificates: browsers ship root certificates and servers present one signed by a CA. This PKI is imperfect — a CA can be compromised and certificates can be misissued — yet it carries e-commerce, APIs and nearly all secure communication. Today Let’s Encrypt has made certificates free, and HTTPS is the default.'],
    milestones: [
      [1995, 'SSL 2.0', 'Netscape\'s security layer.'],
      [1999, 'TLS 1.0', 'Standardised by the IETF.', 1],
      [2014, 'Heartbleed', 'A memory leak in OpenSSL.'],
      [2015, 'Let\'s Encrypt', 'Free certificates make HTTPS universal.'],
      [2018, 'TLS 1.3', 'Faster handshakes and stronger defaults.']
    ],
    concepts: [['Handshake', 'Negotiate version and algorithms, establish keys, verify identity.'], ['Certificate chain', 'Trust handed down from a root certificate to the server’s.'], ['Forward secrecy', 'Past sessions stay safe even if the long-term key leaks.']],
    people: [['Taher Elgamal', '1955 – ', 'One of the designers of SSL.'], ['Paul Kocher', '1973 – ', 'SSL 3.0 and a pioneer of differential power analysis.']],
    related: ['public-key', 'hash-mac', 'vulnerabilities'],
    reading: [['SSL and TLS: Designing and Building Secure Systems', 'Eric Rescorla', '2001'], ['RFC 8446: TLS 1.3', 'Eric Rescorla', '2018']],
    practice: 'Run openssl s_client against a site, dump the certificate chain and explain each hop of trust'
  },

  {
    id: 'vulnerabilities',
    name: 'Vulnerabilities & Attacks',
    domain: 'security',
    year: 1988,
    tags: ['Bugs', 'Supply chain', 'Side channels'],
    summary: 'The history of vulnerabilities is a history of complexity failing: buffer overflows, injection, memory safety and supply chains all remind us that implementation is part of security.',
    body: ['In 1988 the Morris worm exploited flaws in sendmail and finger to infect roughly 6,000 machines, and CERT was founded in response. In 2001 Code Red and Nimda showed how destructive automatic propagation could be. In 2014 Heartbleed leaked memory through OpenSSL’s heartbeat extension; in 2017 WannaCry used EternalBlue to sweep the world.', 'In 2018 Spectre and Meltdown showed that even speculative execution on the CPU leaks data; in 2021 Log4Shell reminded everyone how universal open-source components are and how fragile the supply chain is; in 2024 the xz backdoor showed how social engineering can reach a maintainer. Defence is layered — memory-safe languages, least privilege, signed dependencies, continuous audit — and it never ends.'],
    milestones: [
      [1988, 'The Morris worm', 'The first large-scale network worm.', 1],
      [2014, 'Heartbleed', 'A memory leak in OpenSSL.'],
      [2017, 'WannaCry', 'Ransomware goes global.'],
      [2018, 'Spectre and Meltdown', 'CPU side channels.'],
      [2021, 'Log4Shell', 'An open-source supply-chain crisis.']
    ],
    concepts: [['Buffer overflow', 'Writing past an array bound and overwriting adjacent memory.'], ['Injection', 'Executing untrusted data as code or as a query.'], ['Side channel', 'Inferring secrets from timing, power draw or cache state.']],
    people: [['Robert Tappan Morris', '1965 – ', 'Author of the Morris worm; later a researcher in cryptography and distributed systems.'], ['Dan Kaminsky', '1964 – ', 'Found fundamental protocol flaws such as DNS cache poisoning.']],
    related: ['c-language', 'tls', 'post-quantum'],
    reading: [['The Art of Exploitation', 'Jon Erickson', '2008'], ['Secure Coding in C and C++', 'Robert Seacord', '2005']],
    practice: 'Reproduce a classic buffer overflow in a sandboxed VM, then recompile with stack protection and retry'
  },

  {
    id: 'post-quantum',
    name: 'Post-Quantum Cryptography',
    domain: 'security',
    year: 1994,
    tags: ['Lattice cryptography', 'Migration', 'Standardisation'],
    summary: 'Quantum computers can break RSA and ECC; post-quantum cryptography builds replacements from lattices, codes and hashes.',
    body: ['In 1994 Shor’s algorithm showed that a quantum computer could factor large integers and compute discrete logarithms in polynomial time, which would break RSA and ECC. In 2016 NIST began standardising post-quantum cryptography; in 2022 the first algorithms were chosen; in 2024 ML-KEM, ML-DSA and SLH-DSA were published.', 'The hard part of migration is not the algorithms but the deployment: certificates, protocols, hardware and legacy systems all need updating. The industry talks about “harvest now, decrypt later” — ciphertext captured today may be opened by a quantum computer later. Hence hybrid key exchange and crypto-agility are the keywords of the transition.'],
    milestones: [
      [1994, 'Shor\'s algorithm', 'Quantum factoring and discrete logarithms.', 1],
      [2016, 'The NIST PQC competition', 'Standardisation begins.'],
      [2022, 'The first algorithms are chosen', 'Kyber, Dilithium and others.'],
      [2024, 'The FIPS standards arrive', 'ML-KEM, ML-DSA and SLH-DSA.']
    ],
    concepts: [['Lattice cryptography', 'Built on hard problems in high-dimensional lattices, such as LWE and SIS.'], ['Hash-based signatures', 'One-time or few-time schemes built only from hash functions.'], ['Hybrid key exchange', 'Run classical and post-quantum algorithms together to avoid a single point of failure.']],
    people: [['Peter Shor', '1963 – ', 'Proposed the quantum factoring algorithm.'], ['Tanja Lange', '1971 – ', 'Post-quantum cryptography and cryptanalysis.']],
    related: ['public-key', 'quantum-computing', 'tls'],
    reading: [['Post-Quantum Cryptography', 'Bernstein & Lange', '2017'], ['NIST FIPS 203 / 204 / 205', 'NIST', '2024']],
    practice: 'Swap one key exchange in a test server to hybrid X25519 + ML-KEM and confirm both sides agree'
  }

]);
