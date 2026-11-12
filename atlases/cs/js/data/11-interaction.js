/* 11 — Graphics and human–computer interaction */
CS.addTopics([

  {
    id: 'sketchpad',
    name: 'Sketchpad & Interactive Graphics',
    domain: 'interaction',
    year: 1963,
    tags: ['CAD', 'Direct manipulation', 'Constraints'],
    summary: 'Drawing on screen with a light pen and manipulating shapes directly: Sketchpad made the computer an interactive design tool for the first time.',
    body: [
      'In 1963 a computer was something you submitted work to and collected output from, hours or days later. Ivan Sutherland\'s doctoral thesis at MIT demonstrated the opposite: a person sitting at a display, drawing with a light pen, watching shapes respond immediately. Sketchpad is usually described as the first CAD system, but its real claim is that it made the computer conversational.',
      'The technical core was the constraint system. A drawing was not a collection of pixels but a set of objects under relations: these two lines are parallel, this point lies on that circle, this segment has a fixed length. When the user dragged a point, the system re-solved the constraints and updated everything that depended on it. That is a different kind of interaction from painting — the user manipulates a model, and the picture is a view of the model.',
      'Several ideas now standard in graphics appeared together in that one program. Master definitions and instances, so a repeated part could be edited once and appear everywhere. A light pen for direct selection rather than typed commands. Nested coordinate transformations, so a component could be moved by editing its transform. Even a physics-like simulation of spring constants, so shapes settled into equilibrium — an early hint that interaction could be simulated rather than drawn.',
      'The hardware was barely adequate, which is why the ideas took decades to become ordinary. Sketchpad ran on the TX-2, a machine with a few hundred kilobytes of memory, and the constraint solver was limited to small drawings; a version for a general-purpose machine was not feasible for years. The concepts outlived the implementation and were rediscovered as machines caught up — in CAD in the 1970s, in desktop publishing in the 1980s, in every direct-manipulation interface since.',
      'Sutherland\'s own next steps follow the same idea. He moved to ARPA, where he funded graphics and networking research including the earliest ARPANET work; in 1968 he published "A Head-Mounted Three Dimensional Display", proposing that a computer could present a world rather than a page. The continuity matters: the thesis, the funding and the head-mounted display are all arguments that the computer\'s job is to extend what a person can manipulate.',
      'The lesson for interface design is not that Sketchpad got everything right. It is that direct manipulation requires an explicit model: constraints, objects and views, not just a canvas. Interfaces that feel immediate but have no underlying structure break the moment the user wants to change something the tool did not anticipate. That distinction between a drawing and a model is still the dividing line between tools people trust and tools people fight.'
    ],
    milestones: [
      [1963, 'Sketchpad', 'Interactive graphics and constraint solving.', 1],
      [1964, 'Sutherland joins ARPA', 'He pushes graphics and networking research.'],
      [1968, 'The HMD paper', 'An early vision of virtual reality.']
    ],
    concepts: [['Direct manipulation', 'The user acts on objects on screen and sees the result immediately.'], ['Constraint solving', 'Maintain relationships between shapes through geometric constraints.'], ['Light pen', 'An early on-screen pointing device.']],
    people: [['Ivan Sutherland', '1938 – ', 'A pioneer of Sketchpad and head-mounted displays.'], ['Douglas Engelbart', '1925 – 2013', 'Inventor of the mouse and of hypertext.']],
    related: ['gui-hci', 'rendering', 'vr-ar'],
    reading: [
      ['Sketchpad: A Man-Machine Graphical Communication System', 'Ivan Sutherland', '1963', 'https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-574.pdf', 'paper'],
      ['A Head-Mounted Three Dimensional Display', 'Ivan Sutherland', '1968', 'https://www.cs.unc.edu/~azuma/ARpresence.pdf', 'paper'],
      ['Sketchpad', 'Wikipedia', '2024', 'https://en.wikipedia.org/wiki/Sketchpad', 'wiki'],
      ['The Design of Everyday Things', 'Don Norman', '1988', '', 'book']
    ],
    practice: 'Build a tiny constraint solver: two segments that must stay perpendicular while you drag one endpoint'
  },

  {
    id: 'rendering',
    name: 'Rendering',
    domain: 'interaction',
    year: 1980,
    tags: ['Lighting', 'Real time', 'Offline'],
    summary: 'How do you turn a 3D scene into a 2D image? Rasterisation chases real time, ray tracing chases realism, and both shape today’s pictures.',
    body: ['In 1968 Appel proposed ray casting; in 1980 Whitted added recursive ray tracing for reflection and refraction. In 1984 radiosity modelled diffuse light with energy conservation; in 1986 the Reyes pipeline rendered efficiently with micropolygons and became the basis of the film industry.', 'Real-time rendering long relied on rasterisation: project triangles onto the screen and shade each pixel. In 2018 NVIDIA’s RTX brought hardware ray tracing to consumer GPUs, and hybrid rendering became the norm. Meanwhile neural rendering — NeRF, 3D Gaussian splatting — rebuilds scenes from learnable representations, blurring graphics and vision.'],
    milestones: [
      [1980, 'Whitted ray tracing', 'Recursive reflection and refraction.', 1],
      [1984, 'Radiosity', 'An energy method for global illumination.'],
      [1986, 'The Reyes pipeline', 'Film-grade micropolygon rendering.'],
      [2018, 'Real-time ray tracing', 'RTX hardware.'],
      [2020, 'NeRF', 'Neural radiance fields reconstruct a scene.']
    ],
    concepts: [['Rasterisation', 'Project geometric primitives onto pixels; good for real time.'], ['Ray tracing', 'Cast rays from the camera to simulate reflection, refraction and shadow.'], ['Global illumination', 'Account for light bouncing repeatedly through the scene.']],
    people: [['Turner Whitted', '1943 – ', 'Proposed recursive ray tracing.'], ['Ed Catmull', '1945 – ', 'Pixar co-founder; a driving force behind RenderMan and Reyes.']],
    related: ['shaders', 'sketchpad', 'gpu-computing'],
    reading: [['Computer Graphics: Principles and Practice', 'Hughes et al.', '2013'], ['Real-Time Rendering', 'Akenine-Möller et al.', '2002']],
    practice: 'Render the same scene with a rasteriser and a ray tracer; compare time and one visual artefact each'
  },

  {
    id: 'shaders',
    name: 'Programmable Shaders',
    domain: 'interaction',
    year: 2001,
    tags: ['GPU', 'Pipeline', 'Parallelism'],
    summary: 'Programmable shaders turned the GPU from a fixed pipeline into a parallel computer, and real-time graphics became programmable.',
    body: ['In 1999 the GeForce 256’s fixed pipeline could only do preset transforms and lighting. In 2001 DirectX 8 introduced programmable vertex and pixel shaders, and OpenGL followed with extensions: developers wrote short programs that ran on thousands of GPU cores. Shader languages — HLSL, GLSL — were born.', 'Shaders let real-time graphics produce water, skin, volumetric fog and post-processing. In 2006 CUDA opened the same parallelism to general computation. Today shaders are not only a rendering tool but also used for physics simulation, particle systems and neural-network inference. The GPU programming model — many threads, SIMT, an explicit memory hierarchy — has become the general paradigm of parallel computing.'],
    milestones: [
      [2001, 'Programmable shaders', 'GPUs begin to accept general programs.', 1],
      [2006, 'CUDA', 'An operating system for general-purpose GPU computing.'],
      [2009, 'WebGL', '3D in the browser.'],
      [2018, 'Real-time ray tracing in shaders', 'Ray tracing combined with rasterised shading.']
    ],
    concepts: [['Vertex shader', 'Processes position, normal and texture coordinates per vertex.'], ['Pixel shader', 'Computes colour per fragment and decides the final image.'], ['SIMT', 'One instruction drives many threads — suited to data parallelism.']],
    people: [['John Carmack', '1970 – ', 'Co-founder of id Software; a driving force behind real-time 3D.'], ['David Kirk', '1960 – ', 'NVIDIA chief scientist; GPU computing architecture.']],
    related: ['rendering', 'gpu-computing', 'vr-ar'],
    reading: [['GPU Gems', 'Pharr et al.', '2004'], ['OpenGL Programming Guide', 'Schreiner et al.', '1999']],
    practice: 'Write a fragment shader that produces a procedural checkerboard, then add one light and one shadow'
  },

  {
    id: 'gui-hci',
    name: 'GUIs & Human–Computer Interaction',
    domain: 'interaction',
    year: 1968,
    tags: ['Mouse', 'Windows', 'Usability'],
    summary: 'Mouse, windows, icons and direct manipulation: the GUI turned computers from expert tools into everyday media.',
    body: ['In 1968 Engelbart’s “Mother of All Demos” showed the mouse, hypertext, video conferencing and collaborative editing. In 1973 Xerox PARC’s Alto combined a bitmap screen, windows and Ethernet into the first modern personal workstation. In 1984 the Macintosh took the GUI to the public; in 1995 Windows 95 took it to the PC.', 'At the heart of the GUI is direct manipulation: the user sees an object, points at it, acts, and gets immediate feedback. That model later extended to touch (the 2007 iPhone), voice and gesture. HCI research keeps reminding us that an interface is not decoration but a design of cognitive load, feedback latency and accessibility.'],
    milestones: [
      [1968, 'The Mother of All Demos', 'The mouse and hypertext.', 1],
      [1973, 'Xerox Alto', 'Bitmap screen and overlapping windows.'],
      [1984, 'Macintosh', 'The GUI reaches the public.'],
      [1995, 'Windows 95', 'Graphical interfaces on the PC.'],
      [2007, 'iPhone', 'Multi-touch.']
    ],
    concepts: [['Direct manipulation', 'Act on objects by pointing, dragging and gesturing.'], ['Event loop', 'The UI thread keeps reading input events and updating the screen.'], ['Usability', 'Efficiency, learnability and tolerance of error taken together.']],
    people: [['Douglas Engelbart', '1925 – 2013', 'A pioneer of the mouse, hypertext and collaborative computing.'], ['Alan Kay', '1940 – ', 'Smalltalk and the Dynabook vision.']],
    related: ['sketchpad', 'www-http', 'vr-ar'],
    reading: [['The Design of Everyday Things', 'Don Norman', '1988'], ['Human–Computer Interaction', 'Dix et al.', '1993']],
    practice: 'Prototype the same task in two interfaces (command line and GUI) and measure time-to-completion on five people'
  },

  {
    id: 'vr-ar',
    name: 'Virtual & Augmented Reality',
    domain: 'interaction',
    year: 1968,
    tags: ['Immersion', 'Tracking', 'Spatial computing'],
    summary: 'Head-mounted displays, tracking and real-time rendering: VR tries to make presence itself computable.',
    body: ['In 1965 Sutherland proposed the “Ultimate Display”: a virtual world one could enter and interact with. In 1968 he built the first head-mounted display, the Sword of Damocles, tracked mechanically. In the 1980s VPL’s DataGlove and Eyephone took VR commercial.', 'In 2012 the Oculus Rift crowdfunding campaign re-ignited consumer VR; in 2016 the HTC Vive and PSVR shipped; in 2023 Apple Vision Pro explored spatial computing with passthrough video and eye tracking. AR overlays virtual content on the real world, from Pokémon GO to industrial repair. The hard problems never change: latency, field of view, comfort — and what it is actually for.'],
    milestones: [
      [1965, 'The Ultimate Display', 'Sutherland\'s vision.'],
      [1968, 'The first head-mounted display', 'A mechanically tracked headset.', 1],
      [2012, 'Oculus Rift', 'Consumer VR revived.'],
      [2016, 'Consumer VR arrives', 'Vive and PSVR.'],
      [2023, 'Vision Pro', 'Spatial computing.']
    ],
    concepts: [['Immersion', 'How strongly the user feels present inside the world.'], ['Head tracking', 'Capture head pose in real time to reduce motion sickness.'], ['Spatial computing', 'Anchor digital content in real space.']],
    people: [['Ivan Sutherland', '1938 – ', 'A pioneer of head-mounted displays.'], ['Palmer Luckey', '1992 – ', 'Founder of Oculus.']],
    related: ['rendering', 'gui-hci', 'shaders'],
    reading: [['Virtual Reality', 'Steven LaValle', '2017'], ['Augmented Reality: Principles and Practice', 'Schmalstieg & Höllerer', '2016']],
    practice: 'Build a WebXR scene on your phone, then measure frame time and explain why latency causes nausea'
  }

]);
