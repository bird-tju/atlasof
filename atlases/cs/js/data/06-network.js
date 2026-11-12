/* 06 — Computer networks */
CS.addTopics([

  {
    id: 'packet-switching',
    name: 'Packet Switching & ARPANET',
    domain: 'network',
    year: 1961,
    tags: ['Decentralised', 'Survivability', 'Prehistory of the Net'],
    summary: 'Cut messages into pieces and route each one: packet switching keeps a network alive when nodes fail, and made the Internet decentralised.',
    body: [
      'A telephone call reserves a path: the exchange keeps a circuit open for the whole conversation, even when nobody is speaking. That is fine for voice and ruinous for data, which arrives in bursts — a terminal waiting for a reply holds a circuit open to send nothing. Packet switching starts from the opposite assumption: links are shared, and nobody owns a path.',
      'A message is cut into packets, each small enough to fit a link, each carrying the address of its destination. A node receives a whole packet, stores it, and forwards it to the next hop chosen from its own table. Packets from the same message may take different routes and arrive out of order. Nothing is reserved; capacity is used only while bits are moving.',
      'The design is usually explained by survivability. Baran\'s 1964 RAND study did argue that a network with no centre could route around destroyed nodes, and that context — Cold War, nuclear attack — is why the idea was funded at all. But the deeper argument is statistical: bursty traffic multiplexed across shared links wastes far less capacity than circuits held open, and queueing theory (Kleinrock, 1961) told you how much delay to expect in exchange.',
      'The costs are real and they never went away. Delay varies with load, so packets arrive with jitter; the network may drop a packet under congestion and report nothing; order is not preserved; and no bandwidth is guaranteed. Every later protocol is a patch for one of these — TCP adds sequence numbers and retransmission, congestion control decides how fast to send, and real-time audio needs priority queues precisely because best effort is not good enough.',
      'In 1969 ARPANET put four nodes online — UCLA, SRI, UCSB and Utah — behind small computers called IMPs that did the store-and-forward work, so the mainframes only ever saw a clean interface. The first attempt to log in from UCLA to SRI crashed the SRI machine after two letters: "LO". The operators retyped "LOGIN" and it worked, which is a fair summary of the decade.',
      'What survived is not a detail but an assumption: the network owns nothing, guarantees nothing, and forwards what it can. Everything layered on top — IP, TCP, HTTP — is built by parties that agree on formats rather than on a shared operator. That is why the same design could grow from four nodes to every device on earth without a central authority deciding who may join.'
    ],
    milestones: [
      [1961, 'Kleinrock\'s packet-switching paper', 'Queueing theory applied to packet networks.', 1],
      [1964, 'Baran\'s distributed network', 'Networks designed for survivability.'],
      [1969, 'ARPANET\'s first four nodes', 'The ancestor of the Internet.'],
      [1971, 'Electronic mail', 'The first killer application.']
    ],
    concepts: [['Packet', 'A message cut into bounded chunks, each transmitted independently.'], ['Store and forward', 'A node receives the whole packet, then picks the next hop.'], ['Distributed routing', 'No central control; each node keeps its own forwarding table.']],
    people: [['Leonard Kleinrock', '1934 – ', 'One of the founders of packet-switching theory.'], ['Paul Baran', '1926 – 2011', 'Proposed the distributed communication network.']],
    related: ['tcp-ip', 'ethernet', 'dns'],
    reading: [
      ['On Distributed Communications', 'Paul Baran, RAND', '1964', 'https://www.rand.org/pubs/research_memoranda/RM3420.html', 'paper'],
      ['A Protocol for Packet Network Intercommunication', 'Vint Cerf & Bob Kahn', '1974', 'https://www.cs.princeton.edu/courses/archive/fall06/cos561/papers/cerf74.pdf', 'paper'],
      ['Packet switching', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Packet_switching', 'wiki'],
      ['A Brief History of the Internet', 'Internet Society', '1997', 'https://www.internetsociety.org/internet/history-internet/brief-history-internet/', 'article'],
      ['Computer Networks', 'Tanenbaum & Wetherall', '1981', '', 'book']
    ],
    practice: 'Simulate a 6-node network where one node fails mid-transfer; show the packets rerouting'
  },

  {
    id: 'tcp-ip',
    name: 'TCP/IP',
    domain: 'network',
    year: 1974,
    tags: ['Protocols', 'Layering', 'End to end'],
    summary: 'Layered protocols join heterogeneous networks into one: IP addresses and forwards, TCP makes delivery reliable.',
    body: ['In 1974 Cerf and Kahn published the design of TCP, whose goal was to interconnect different networks — a network of networks. In 1978 TCP was split into TCP and IP: IP offers connectionless best-effort delivery, and TCP adds retransmission, ordering and congestion control on top.', 'On 1 January 1983 ARPANET switched over to TCP/IP, a date often called the Internet’s birthday. Layering lets the layers below evolve independently: Ethernet, Wi-Fi and fibre all carry IP. And end-to-end congestion control is what kept the whole network stable through exponential growth.'],
    milestones: [
      [1974, 'Cerf and Kahn propose TCP', 'The core protocol for internetworking.', 1],
      [1978, 'TCP and IP split', 'The layered design settles.'],
      [1981, 'RFC 791 / 793', 'The formal specifications of IP and TCP.'],
      [1983, 'ARPANET switches to TCP/IP', 'The Internet\'s birthday.'],
      [1988, 'Congestion control', 'Van Jacobson keeps the network from collapsing.']
    ],
    concepts: [['Layering', 'Link, network, transport and application each mind their own business.'], ['IP addressing', 'Addresses and routing tables carry a packet to its destination network.'], ['Congestion control', 'Adjust the sending rate from packet loss and delay.']],
    people: [['Vint Cerf', '1943 – ', 'Co-designer of TCP/IP.'], ['Bob Kahn', '1938 – ', 'Co-designer of TCP/IP.']],
    related: ['packet-switching', 'dns', 'www-http'],
    reading: [['TCP/IP Illustrated', 'W. Richard Stevens', '1994'], ['The Design Philosophy of the DARPA Internet Protocols', 'David Clark', '1988']],
    practice: 'Implement a tiny reliable transport over UDP: sequence numbers, ACKs and retransmission on timeout'
  },

  {
    id: 'ethernet',
    name: 'Ethernet & LAN',
    domain: 'network',
    year: 1973,
    tags: ['LAN', 'CSMA/CD', 'Switching'],
    summary: 'One shared cable and a polite contest for it — Ethernet became the de facto standard for local networks.',
    body: ['In 1973 Metcalfe designed Ethernet at Xerox PARC, running at 2.94 Mbps. It used CSMA/CD: listen before sending, back off and retry on collision. In 1980 DEC, Intel and Xerox published the DIX standard; in 1983 IEEE 802.3 standardised it.', 'In the 1990s switches replaced the shared medium, collision domains disappeared, and speeds rose from 10M to 100M, 1G and 10G. Ethernet’s real victory was simplicity: a fixed frame format, and upgrades confined to the physical layer. Today it is not only the LAN but the default interconnect inside data centres.'],
    milestones: [
      [1973, 'Metcalfe designs Ethernet', 'CSMA/CD on a shared bus.', 1],
      [1980, 'The DIX standard', 'Three companies agree on one specification.'],
      [1983, 'IEEE 802.3', 'The international standard.'],
      [1990, 'Switched Ethernet', 'Collision domains disappear.'],
      [2000, '10 Gigabit and the datacentre', 'Ethernet moves into the backbone.']
    ],
    concepts: [['CSMA/CD', 'Listen before talking, listen while talking, back off after a collision.'], ['Frame', 'Ethernet’s unit of transmission, carrying source and destination MAC addresses.'], ['Switch', 'Forwards frames by MAC address and splits collision domains.']],
    people: [['Robert Metcalfe', '1946 – ', 'Inventor of Ethernet.'], ['Radia Perlman', '1951 – ', 'Spanning tree protocol, which lets Ethernet be redundant.']],
    related: ['packet-switching', 'tcp-ip', 'wireless-mobile'],
    reading: [['Ethernet: The Definitive Guide', 'Charles Spurgeon', '2000'], ['Computer Networks', 'Tanenbaum & Wetherall', '1981']],
    practice: 'Capture your own traffic and list the MAC addresses in the first 20 frames, marking broadcasts'
  },

  {
    id: 'dns',
    name: 'DNS & Domain Names',
    domain: 'network',
    year: 1983,
    tags: ['Naming', 'Distributed', 'Governance'],
    summary: 'A globally distributed database that turns names into addresses, and the first battlefield of Internet governance.',
    body: ['Before DNS, host names and addresses lived in a single hosts file maintained by hand at SRI. That could not scale. In 1983 Mockapetris designed DNS: a distributed, hierarchical naming system delegating from the root through top-level domains to authoritative servers.', 'Queries usually go over UDP port 53, with caches and TTLs trading speed against freshness. DNS also became the first arena of governance: who runs the root zone, how top-level domains are granted, where ICANN’s legitimacy comes from. In 2016 the US Department of Commerce handed over the IANA functions, and DNS entered multistakeholder governance.'],
    milestones: [
      [1983, 'The DNS specification', 'Mockapetris designs hierarchical naming.', 1],
      [1984, 'Root servers deployed', 'Thirteen root server addresses.'],
      [1998, 'ICANN is founded', 'The body for names and addresses.'],
      [2016, 'The IANA transition', 'Root-zone management becomes multistakeholder.']
    ],
    concepts: [['Hierarchical naming', 'A tree from the root to top-level domains to authoritative servers.'], ['Recursive and iterative queries', 'The resolver does the work, or each server points to the next.'], ['TTL caching', 'Time to live trades speed against how quickly records update.']],
    people: [['Paul Mockapetris', '1953 – ', 'Designer of DNS.'], ['Jon Postel', '1943 – 1998', 'Founder of IANA and a driver of Internet standardisation.']],
    related: ['tcp-ip', 'www-http', 'cloud-computing'],
    reading: [['RFC 1034 / 1035', 'Mockapetris', '1987'], ['Networks and States', 'Laura DeNardis', '2014']],
    practice: 'Trace a full resolution with dig +trace for one domain and draw the delegation chain from root to authoritative'
  },

  {
    id: 'www-http',
    name: 'World Wide Web & HTTP',
    domain: 'network',
    year: 1989,
    tags: ['Hypertext', 'Browsers', 'Protocols'],
    summary: 'Hypertext, uniform resource identifiers and a simple request-response protocol: the Web turned the Internet into mass media.',
    body: ['In 1989 Berners-Lee submitted a proposal at CERN: link documents with hypertext, identify resources with URIs, transfer them with HTTP. In 1991 the first website went live at CERN. In 1993 the Mosaic browser put images on the same page as text, and the Web exploded.', 'HTTP was designed to be minimal: a method, headers and a body. State lives on the server; caching, proxies and extensions live in headers. HTTP/2 in 2015 added multiplexing, HTTP/3 in 2022 moved to QUIC — yet the semantics barely changed, which is exactly the strength of layering and backwards compatibility.'],
    milestones: [
      [1989, 'Berners-Lee\'s proposal', 'The starting point of the Web.', 1],
      [1991, 'The first website', 'Online at CERN.'],
      [1993, 'The Mosaic browser', 'Inline images bring the Web to everyone.'],
      [1996, 'HTTP/1.0', 'Standardised.'],
      [2015, 'HTTP/2', 'Multiplexing and header compression.'],
      [2022, 'HTTP/3 and QUIC', 'A new transport built on UDP.']
    ],
    concepts: [['URI', 'A uniform resource identifier: a name for every resource.'], ['Hypertext', 'Documents referring to each other through links.'], ['Statelessness', 'Each request stands alone; state is carried by cookies or sessions.']],
    people: [['Tim Berners-Lee', '1955 – ', 'Inventor of the World Wide Web.'], ['Marc Andreessen', '1971 – ', 'Co-founder of Mosaic and Netscape.']],
    related: ['tcp-ip', 'dns', 'gui-hci'],
    reading: [['Weaving the Web', 'Tim Berners-Lee', '1999'], ['HTTP: The Definitive Guide', 'Gourley & Totty', '2002']],
    practice: 'Write an HTTP/1.1 server in 100 lines that serves a file, then send a raw request with netcat'
  },

  {
    id: 'wireless-mobile',
    name: 'Wireless & Mobile Networks',
    domain: 'network',
    year: 1971,
    tags: ['Cellular', 'Wi-Fi', '5G'],
    summary: 'From ALOHAnet’s radio experiments to 5G, wireless cut the cable and made mobile the default way to be online.',
    body: ['In 1971 the University of Hawaii’s ALOHAnet linked the islands by radio and designed the first random-access protocol. Cellular phones went commercial in the 1980s, and GSM opened its first digital network in Finland in 1991. In 1997 IEEE 802.11 standardised wireless LANs, and Wi-Fi moved into homes and cafés.', 'Mobile networks change generation roughly every decade: 2G texting, 3G data, 4G video, 5G low latency and massive connection counts. Each generation reallocates spectrum, modulation and architecture. Wireless is harder than wire: attenuation, interference and handover all have to be solved in the protocol.'],
    milestones: [
      [1971, 'ALOHAnet', 'A pioneer of random access over radio.', 1],
      [1991, 'GSM goes commercial', 'The digital cellular standard.'],
      [1997, 'IEEE 802.11', 'Wi-Fi is born.'],
      [2009, '4G LTE', 'Mobile broadband.'],
      [2019, '5G goes commercial', 'Low latency and massive IoT.']
    ],
    concepts: [['Cellular', 'Divide coverage into cells so frequencies can be reused.'], ['Random access', 'Terminals contend for a shared channel and retry after collisions.'], ['Handover', 'Move a connection smoothly from one base station to another as you move.']],
    people: [['Norman Abramson', '1932 – 2020', 'Led ALOHAnet.'], ['Martin Cooper', '1928 – ', 'Made the first handheld mobile phone call.']],
    related: ['ethernet', 'www-http', 'cloud-computing'],
    reading: [['Wireless Communications', 'Andreas Molisch', '2010'], ['Mobile Edge Computing', 'Taleb et al.', '2017']],
    practice: 'Measure Wi-Fi signal strength across a room, then explain the drop where the door is'
  }

]);
