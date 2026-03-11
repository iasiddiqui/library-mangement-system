const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get All Books
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching books' });
  }
});

// Initialize default books if they don't exist (MUST be before /:id route)
router.post('/init', async (req, res) => {
  try {
    const defaultBooks = [
      { 
        title: 'Mathematics', 
        category: 'Science', 
        imageUrl: '/images/books/mathematic.jpg',
        author: 'Dr. John Smith',
        description: 'Comprehensive guide to mathematical concepts and problem-solving techniques.',
        content: `# Mathematics - Chapter 1: Introduction to Algebra\n\nMathematics is the study of numbers, quantities, and shapes. It is a fundamental discipline that helps us understand the world around us.\n\n## Basic Concepts\n\nAlgebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. The word "algebra" comes from the Arabic word "al-jabr" meaning "reunion of broken parts."\n\n### Variables and Constants\n\nIn algebra, we use variables (like x, y, z) to represent unknown values and constants to represent fixed values. For example, in the equation 2x + 3 = 7, x is the variable, and 2, 3, and 7 are constants.\n\n### Solving Equations\n\nTo solve an equation, we need to find the value of the variable that makes the equation true. We do this by performing operations on both sides of the equation to isolate the variable.\n\nExample: Solve 2x + 3 = 7\n- Subtract 3 from both sides: 2x = 4\n- Divide both sides by 2: x = 2\n\n## Applications\n\nAlgebra is used in many fields including:\n- Engineering\n- Physics\n- Economics\n- Computer Science\n- Statistics\n\nUnderstanding algebra is essential for advanced mathematical studies and real-world problem solving.`
      },
      { 
        title: 'Biology', 
        category: 'Science', 
        imageUrl: '/images/books/biology.jpg',
        author: 'Dr. Sarah Johnson',
        description: 'Explore the fascinating world of living organisms and their interactions.',
        content: `# Biology - Chapter 1: Introduction to Life Sciences\n\nBiology is the scientific study of life and living organisms. It encompasses everything from the smallest microorganisms to the largest animals and plants.\n\n## What is Life?\n\nLiving organisms share several key characteristics:\n1. **Organization**: Living things are highly organized, with cells as the basic unit of life\n2. **Metabolism**: They carry out chemical reactions to obtain and use energy\n3. **Growth and Development**: They grow and develop according to their genetic instructions\n4. **Reproduction**: They reproduce to create new individuals\n5. **Response to Stimuli**: They respond to changes in their environment\n6. **Homeostasis**: They maintain a stable internal environment\n\n## Cell Structure\n\nCells are the basic building blocks of all living things. There are two main types:\n- **Prokaryotic cells**: Simple cells without a nucleus (bacteria)\n- **Eukaryotic cells**: Complex cells with a nucleus (plants, animals, fungi)\n\n## Ecosystems\n\nBiology also studies how organisms interact with each other and their environment. Ecosystems include:\n- Producers (plants that make their own food)\n- Consumers (animals that eat other organisms)\n- Decomposers (organisms that break down dead matter)\n\nUnderstanding biology helps us appreciate the complexity and beauty of life on Earth.`
      },
      { 
        title: 'Chemistry', 
        category: 'Science', 
        imageUrl: '/images/books/chemistry.jpg',
        author: 'Prof. Michael Brown',
        description: 'Learn about atoms, molecules, and chemical reactions that shape our world.',
        content: `# Chemistry - Chapter 1: Atoms and Molecules\n\nChemistry is the study of matter, its properties, composition, and the changes it undergoes.\n\n## Atomic Structure\n\nAtoms are the basic units of matter. Each atom consists of:\n- **Protons**: Positively charged particles in the nucleus\n- **Neutrons**: Neutral particles in the nucleus\n- **Electrons**: Negatively charged particles orbiting the nucleus\n\n## The Periodic Table\n\nThe periodic table organizes all known elements based on their atomic number and properties. Elements are arranged in periods (rows) and groups (columns) that share similar characteristics.\n\n## Chemical Bonds\n\nAtoms combine to form molecules through chemical bonds:\n- **Ionic bonds**: Formed when electrons are transferred between atoms\n- **Covalent bonds**: Formed when atoms share electrons\n- **Metallic bonds**: Found in metals where electrons are shared among many atoms\n\n## Chemical Reactions\n\nChemical reactions occur when substances interact to form new substances. Key concepts include:\n- Reactants: Starting materials\n- Products: End materials\n- Conservation of mass: Matter is neither created nor destroyed\n\n## Applications\n\nChemistry is essential in:\n- Medicine and pharmaceuticals\n- Materials science\n- Environmental science\n- Food science\n- Energy production\n\nChemistry helps us understand the molecular world and create new materials and medicines.`
      },
      { 
        title: 'Physics', 
        category: 'Science', 
        imageUrl: '/images/books/physic.jpg',
        author: 'Dr. Emily Davis',
        description: 'Discover the fundamental laws that govern the universe and motion.',
        content: `# Physics - Chapter 1: Motion and Forces\n\nPhysics is the study of matter, energy, and the fundamental forces of nature.\n\n## Motion\n\nMotion describes how objects change position over time. Key concepts include:\n- **Position**: Where an object is located\n- **Velocity**: How fast and in what direction an object is moving\n- **Acceleration**: How quickly velocity changes\n\n## Newton's Laws of Motion\n\n1. **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2. **Second Law**: Force equals mass times acceleration (F = ma)\n\n3. **Third Law**: For every action, there is an equal and opposite reaction\n\n## Energy\n\nEnergy is the ability to do work. It comes in many forms:\n- Kinetic energy: Energy of motion\n- Potential energy: Stored energy\n- Thermal energy: Heat energy\n- Electrical energy: Energy from electric charges\n\n## Applications\n\nPhysics principles are used in:\n- Engineering and technology\n- Space exploration\n- Medical imaging\n- Renewable energy\n- Communication systems\n\nUnderstanding physics helps us comprehend the natural world and develop new technologies.`
      },
      { 
        title: 'Hindi', 
        category: 'Language', 
        imageUrl: '/images/books/hindi.jpg',
        author: 'Prof. Rajesh Kumar',
        description: 'Master the Hindi language with comprehensive grammar and vocabulary lessons.',
        content: `# Hindi - Chapter 1: Basic Introduction\n\nHindi is one of the most widely spoken languages in the world, with over 500 million speakers.\n\n## Hindi Alphabet (Devanagari)\n\nThe Hindi alphabet consists of 13 vowels and 33 consonants. The script is written from left to right.\n\n### Vowels (स्वर)\nअ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ, अं, अः\n\n### Consonants (व्यंजन)\nक, ख, ग, घ, ङ, च, छ, ज, झ, ञ, ट, ठ, ड, ढ, ण, त, थ, द, ध, न, प, फ, ब, भ, म, य, र, ल, व, श, ष, स, ह\n\n## Basic Greetings\n\n- नमस्ते (Namaste) - Hello\n- धन्यवाद (Dhanyavad) - Thank you\n- कृपया (Kripaya) - Please\n- क्षमा करें (Kshama karen) - Excuse me\n\n## Common Phrases\n\n- आप कैसे हैं? (Aap kaise hain?) - How are you?\n- मेरा नाम... है (Mera naam... hai) - My name is...\n- मुझे मदद चाहिए (Mujhe madad chahiye) - I need help\n\n## Grammar Basics\n\nHindi follows a Subject-Object-Verb (SOV) word order. Verbs change based on gender, number, and person.\n\nLearning Hindi opens doors to understanding Indian culture, literature, and communication with millions of speakers worldwide.`
      },
      { 
        title: 'Urdu', 
        category: 'Language', 
        imageUrl: '/images/books/urdu.jpg',
        author: 'Dr. Ahmed Ali',
        description: 'Learn Urdu language with its beautiful script and rich literary tradition.',
        content: `# Urdu - Chapter 1: Introduction to Urdu\n\nUrdu is a beautiful language with a rich literary heritage, spoken by millions across South Asia.\n\n## Urdu Alphabet\n\nUrdu uses the Perso-Arabic script, written from right to left. It consists of 38 letters.\n\n### Basic Letters\nا, ب, پ, ت, ٹ, ث, ج, چ, ح, خ, د, ڈ, ذ, ر, ڑ, ز, ژ, س, ش, ص, ض, ط, ظ, ع, غ, ف, ق, ک, گ, ل, م, ن, ں, و, ہ, ھ, ی, ے\n\n## Common Greetings\n\n- السلام علیکم (Assalamu Alaikum) - Peace be upon you\n- شکریہ (Shukriya) - Thank you\n- برائے مہربانی (Baraye meharbani) - Please\n- معاف کیجئے (Maaf kijiye) - Excuse me\n\n## Basic Phrases\n\n- آپ کیسے ہیں؟ (Aap kaise hain?) - How are you?\n- میرا نام... ہے (Mera naam... hai) - My name is...\n- میں ٹھیک ہوں (Main theek hoon) - I am fine\n\n## Grammar\n\nUrdu grammar is similar to Hindi but uses different script. It follows Subject-Object-Verb order and has gender distinctions.\n\nUrdu is known for its poetic beauty and is the language of many famous poets and writers. Learning Urdu provides access to a rich cultural and literary tradition.`
      },
      { 
        title: 'Business', 
        category: 'Business', 
        imageUrl: '/images/books/business.jpg',
        author: 'Dr. Robert Wilson',
        description: 'Essential business concepts, management principles, and entrepreneurship strategies.',
        content: `# Business - Chapter 1: Introduction to Business Management\n\nBusiness management involves planning, organizing, leading, and controlling resources to achieve organizational goals.\n\n## What is Business?\n\nA business is an organization engaged in commercial, industrial, or professional activities. Businesses can be:\n- For-profit: Aim to make money\n- Non-profit: Serve a social purpose\n- Public: Owned by government\n- Private: Owned by individuals or groups\n\n## Key Business Functions\n\n1. **Marketing**: Understanding customer needs and promoting products\n2. **Finance**: Managing money, investments, and financial planning\n3. **Operations**: Producing goods and services efficiently\n4. **Human Resources**: Managing employees and organizational culture\n5. **Strategy**: Long-term planning and competitive positioning\n\n## Business Models\n\n- **B2B (Business-to-Business)**: Companies selling to other companies\n- **B2C (Business-to-Consumer)**: Companies selling to individual customers\n- **E-commerce**: Online business transactions\n- **Franchise**: Licensing business model to others\n\n## Entrepreneurship\n\nEntrepreneurship involves:\n- Identifying opportunities\n- Taking calculated risks\n- Innovation and creativity\n- Building and managing teams\n- Financial planning and management\n\n## Success Factors\n\nSuccessful businesses focus on:\n- Customer satisfaction\n- Quality products/services\n- Efficient operations\n- Strong leadership\n- Financial stability\n- Adaptability to change\n\nUnderstanding business principles is essential for anyone looking to start a business or advance in their career.`
      },
      { 
        title: 'History', 
        category: 'History', 
        imageUrl: '/images/books/history.jpg',
        author: 'Prof. Elizabeth Taylor',
        description: 'Journey through time and explore significant historical events and civilizations.',
        content: `# History - Chapter 1: Understanding History\n\nHistory is the study of past events, particularly human affairs. It helps us understand how societies have evolved over time.\n\n## Why Study History?\n\nHistory provides:\n- Understanding of how the present came to be\n- Lessons from past mistakes and successes\n- Cultural awareness and appreciation\n- Critical thinking skills\n- Context for current events\n\n## Historical Periods\n\n1. **Ancient History**: Early civilizations (Egypt, Mesopotamia, Greece, Rome)\n2. **Medieval History**: Middle Ages (500-1500 CE)\n3. **Modern History**: Renaissance to present (1500-present)\n\n## Key Historical Concepts\n\n- **Primary Sources**: Original documents and artifacts from the time period\n- **Secondary Sources**: Interpretations and analyses of historical events\n- **Chronology**: The arrangement of events in time order\n- **Causation**: Understanding why events happened\n\n## Major Civilizations\n\n- **Ancient Egypt**: Pyramids, pharaohs, hieroglyphics\n- **Ancient Greece**: Democracy, philosophy, arts\n- **Roman Empire**: Law, engineering, governance\n- **Medieval Europe**: Feudalism, crusades, renaissance\n- **Asian Empires**: China, India, Japan\n\n## Historical Thinking Skills\n\n- Analyzing sources\n- Identifying bias\n- Understanding context\n- Making connections\n- Drawing conclusions\n\nHistory teaches us about human nature, society, and the consequences of our actions. It's essential for understanding our world today.`
      },
      { 
        title: 'C Language', 
        category: 'Programming', 
        imageUrl: '/images/books/clanguage.jpg',
        author: 'Dr. Brian Kernighan',
        description: 'Master the fundamentals of C programming language from basics to advanced concepts.',
        content: `# C Language - Chapter 1: Introduction to C Programming\n\nC is a powerful, general-purpose programming language that has influenced many modern languages.\n\n## What is C?\n\nC is a procedural programming language developed in the 1970s. It's known for:\n- Efficiency and performance\n- Low-level access to memory\n- Portability across different platforms\n- Foundation for many other languages\n\n## Basic Syntax\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n\n## Data Types\n\nC supports various data types:\n- **int**: Integer numbers\n- **float**: Floating-point numbers\n- **char**: Single characters\n- **double**: Double-precision floating-point\n\n## Variables and Operators\n\nVariables store data values. Operators perform operations:\n- Arithmetic: +, -, *, /, %\n- Comparison: ==, !=, <, >, <=, >=\n- Logical: &&, ||, !\n\n## Control Structures\n\n- **if-else**: Conditional execution\n- **for loop**: Iteration with counter\n- **while loop**: Iteration with condition\n- **switch**: Multiple choice selection\n\n## Functions\n\nFunctions are reusable blocks of code:\nint add(int a, int b) {\n    return a + b;\n}\n\n## Pointers\n\nPointers store memory addresses, allowing direct memory manipulation - a powerful but careful feature of C.\n\nC programming provides a solid foundation for understanding how computers work at a low level.`
      },
      { 
        title: 'Python', 
        category: 'Programming', 
        imageUrl: '/images/books/python.jpg',
        author: 'Dr. Guido van Rossum',
        description: 'Learn Python programming with practical examples and real-world applications.',
        content: `# Python - Chapter 1: Getting Started with Python\n\nPython is a high-level, interpreted programming language known for its simplicity and readability.\n\n## Why Python?\n\nPython is popular because:\n- Easy to learn and read\n- Versatile (web, data science, AI, automation)\n- Large community and libraries\n- Cross-platform compatibility\n- Great for beginners and experts\n\n## Basic Syntax\n\nprint("Hello, World!")\n\n# Variables\nname = "Python"\nage = 30\n\n# Lists\nnumbers = [1, 2, 3, 4, 5]\n\n## Data Types\n\nPython has dynamic typing:\n- **int**: Integers (1, 2, 3)\n- **float**: Decimals (3.14, 2.5)\n- **str**: Strings ("hello", 'world')\n- **list**: Ordered collections [1, 2, 3]\n- **dict**: Key-value pairs {"name": "Python"}\n\n## Control Flow\n\n# If statement\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")\n\n# For loop\nfor i in range(5):\n    print(i)\n\n## Functions\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\n\n## Libraries\n\nPython has extensive libraries:\n- **NumPy**: Numerical computing\n- **Pandas**: Data analysis\n- **Django/Flask**: Web development\n- **TensorFlow**: Machine learning\n\nPython's simplicity makes it perfect for beginners while its power makes it ideal for professional development.`
      },
      { 
        title: 'Java', 
        category: 'Programming', 
        imageUrl: '/images/books/java.jpg',
        author: 'Dr. James Gosling',
        description: 'Comprehensive guide to Java programming, object-oriented design, and application development.',
        content: `# Java - Chapter 1: Introduction to Java\n\nJava is an object-oriented programming language designed for portability and reliability.\n\n## What is Java?\n\nJava is:\n- Platform-independent ("Write Once, Run Anywhere")\n- Object-oriented\n- Secure and robust\n- Widely used in enterprise applications\n- The foundation for Android development\n\n## Basic Program Structure\n\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n\n## Object-Oriented Concepts\n\n- **Classes**: Blueprints for objects\n- **Objects**: Instances of classes\n- **Inheritance**: Reusing code from parent classes\n- **Polymorphism**: Same interface, different implementations\n- **Encapsulation**: Hiding internal details\n\n## Data Types\n\n- **Primitive**: int, double, boolean, char\n- **Reference**: String, Arrays, Objects\n\n## Control Structures\n\n// If-else\nif (age >= 18) {\n    System.out.println("Adult");\n} else {\n    System.out.println("Minor");\n}\n\n// For loop\nfor (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}\n\n## Collections\n\nJava provides powerful collection classes:\n- **ArrayList**: Dynamic arrays\n- **HashMap**: Key-value pairs\n- **Set**: Unique elements\n- **LinkedList**: Linked data structures\n\n## Exception Handling\n\ntry {\n    // risky code\n} catch (Exception e) {\n    // handle error\n}\n\nJava's strong typing and object-oriented nature make it ideal for large-scale enterprise applications.`
      },
      { 
        title: 'JavaScript', 
        category: 'Programming', 
        imageUrl: '/images/books/javascript.jpg',
        author: 'Dr. Brendan Eich',
        description: 'Master JavaScript for web development, interactive applications, and modern programming.',
        content: `# JavaScript - Chapter 1: Introduction to JavaScript\n\nJavaScript is the programming language of the web, enabling interactive and dynamic websites.\n\n## What is JavaScript?\n\nJavaScript is:\n- The language of web browsers\n- Used for frontend and backend (Node.js)\n- Dynamic and flexible\n- Essential for modern web development\n- Supports multiple programming paradigms\n\n## Basic Syntax\n\n// Variables\nlet name = "JavaScript";\nconst version = "ES6";\nvar oldWay = "deprecated";\n\n// Functions\nfunction greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\n// Arrow functions\nconst add = (a, b) => a + b;\n\n## Data Types\n\n- **Primitive**: string, number, boolean, null, undefined, symbol\n- **Objects**: Arrays, Objects, Functions, Dates\n\n## DOM Manipulation\n\n// Select element\nconst element = document.getElementById('myId');\n\n// Change content\nelement.textContent = "New text";\n\n// Add event listener\nelement.addEventListener('click', function() {\n    alert('Clicked!');\n});\n\n## Modern Features\n\n- **ES6+**: Arrow functions, classes, modules\n- **Async/Await**: Handling asynchronous operations\n- **Promises**: Better async code\n- **Destructuring**: Extracting values from objects/arrays\n\n## Frameworks and Libraries\n\n- **React**: Component-based UI library\n- **Vue**: Progressive JavaScript framework\n- **Angular**: Full-featured framework\n- **Node.js**: Server-side JavaScript\n\nJavaScript powers modern web applications and is essential for any web developer.`
      },
      { 
        title: 'C++', 
        category: 'Programming', 
        imageUrl: '/images/books/cplusepluse.jpg',
        author: 'Dr. Bjarne Stroustrup',
        description: 'Advanced C++ programming with object-oriented design, templates, and modern C++ features.',
        content: `# C++ - Chapter 1: Introduction to C++\n\nC++ is a powerful, multi-paradigm programming language that extends C with object-oriented features.\n\n## What is C++?\n\nC++ combines:\n- Low-level efficiency of C\n- Object-oriented programming\n- Generic programming (templates)\n- Modern features (C++11, C++14, C++17, C++20)\n\n## Basic Program\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n\n## Object-Oriented Programming\n\nclass Car {\nprivate:\n    string brand;\n    int speed;\n    \npublic:\n    Car(string b, int s) : brand(b), speed(s) {}\n    \n    void accelerate() {\n        speed += 10;\n    }\n    \n    void display() {\n        cout << brand << " going " << speed << " mph" << endl;\n    }\n};\n\n## Key Features\n\n- **Classes and Objects**: Encapsulation of data and methods\n- **Inheritance**: Code reuse through class hierarchies\n- **Polymorphism**: Virtual functions and interfaces\n- **Templates**: Generic programming\n- **STL**: Standard Template Library with containers and algorithms\n\n## Memory Management\n\n// Smart pointers (modern C++)\nunique_ptr<int> ptr = make_unique<int>(42);\nshared_ptr<int> shared = make_shared<int>(100);\n\n## STL Containers\n\n- **vector**: Dynamic arrays\n- **map**: Key-value pairs\n- **set**: Unique elements\n- **queue/stack**: Data structures\n\n## Applications\n\nC++ is used in:\n- Game development\n- System programming\n- High-performance computing\n- Embedded systems\n- Operating systems\n\nC++ provides the power of low-level programming with high-level abstractions, making it ideal for performance-critical applications.`
        }
    ];

    const existingBooks = await Book.find();
    if (existingBooks.length === 0) {
      await Book.insertMany(defaultBooks);
      res.json({ success: true, message: 'Default books initialized' });
    } else {
      res.json({ success: true, message: 'Books already exist' });
    }
  } catch (error) {
    console.error('Initialize books error:', error);
    res.status(500).json({ success: false, message: 'Server error initializing books' });
  }
});

// Update existing books with content (one-time update) - MUST be before /:id route
router.post('/update-content', async (req, res) => {
  try {
    const booksWithContent = [
      { 
        title: 'Mathematics', 
        content: `# Mathematics - Chapter 1: Introduction to Algebra\n\nMathematics is the study of numbers, quantities, and shapes. It is a fundamental discipline that helps us understand the world around us.\n\n## Basic Concepts\n\nAlgebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. The word "algebra" comes from the Arabic word "al-jabr" meaning "reunion of broken parts."\n\n### Variables and Constants\n\nIn algebra, we use variables (like x, y, z) to represent unknown values and constants to represent fixed values. For example, in the equation 2x + 3 = 7, x is the variable, and 2, 3, and 7 are constants.\n\n### Solving Equations\n\nTo solve an equation, we need to find the value of the variable that makes the equation true. We do this by performing operations on both sides of the equation to isolate the variable.\n\nExample: Solve 2x + 3 = 7\n- Subtract 3 from both sides: 2x = 4\n- Divide both sides by 2: x = 2\n\n## Applications\n\nAlgebra is used in many fields including:\n- Engineering\n- Physics\n- Economics\n- Computer Science\n- Statistics\n\nUnderstanding algebra is essential for advanced mathematical studies and real-world problem solving.`,
        author: 'Dr. John Smith',
        description: 'Comprehensive guide to mathematical concepts and problem-solving techniques.'
      },
      { 
        title: 'Biology', 
        content: `# Biology - Chapter 1: Introduction to Life Sciences\n\nBiology is the scientific study of life and living organisms. It encompasses everything from the smallest microorganisms to the largest animals and plants.\n\n## What is Life?\n\nLiving organisms share several key characteristics:\n1. **Organization**: Living things are highly organized, with cells as the basic unit of life\n2. **Metabolism**: They carry out chemical reactions to obtain and use energy\n3. **Growth and Development**: They grow and develop according to their genetic instructions\n4. **Reproduction**: They reproduce to create new individuals\n5. **Response to Stimuli**: They respond to changes in their environment\n6. **Homeostasis**: They maintain a stable internal environment\n\n## Cell Structure\n\nCells are the basic building blocks of all living things. There are two main types:\n- **Prokaryotic cells**: Simple cells without a nucleus (bacteria)\n- **Eukaryotic cells**: Complex cells with a nucleus (plants, animals, fungi)\n\n## Ecosystems\n\nBiology also studies how organisms interact with each other and their environment. Ecosystems include:\n- Producers (plants that make their own food)\n- Consumers (animals that eat other organisms)\n- Decomposers (organisms that break down dead matter)\n\nUnderstanding biology helps us appreciate the complexity and beauty of life on Earth.`,
        author: 'Dr. Sarah Johnson',
        description: 'Explore the fascinating world of living organisms and their interactions.'
      },
      { 
        title: 'Chemistry', 
        content: `# Chemistry - Chapter 1: Atoms and Molecules\n\nChemistry is the study of matter, its properties, composition, and the changes it undergoes.\n\n## Atomic Structure\n\nAtoms are the basic units of matter. Each atom consists of:\n- **Protons**: Positively charged particles in the nucleus\n- **Neutrons**: Neutral particles in the nucleus\n- **Electrons**: Negatively charged particles orbiting the nucleus\n\n## The Periodic Table\n\nThe periodic table organizes all known elements based on their atomic number and properties. Elements are arranged in periods (rows) and groups (columns) that share similar characteristics.\n\n## Chemical Bonds\n\nAtoms combine to form molecules through chemical bonds:\n- **Ionic bonds**: Formed when electrons are transferred between atoms\n- **Covalent bonds**: Formed when atoms share electrons\n- **Metallic bonds**: Found in metals where electrons are shared among many atoms\n\n## Chemical Reactions\n\nChemical reactions occur when substances interact to form new substances. Key concepts include:\n- Reactants: Starting materials\n- Products: End materials\n- Conservation of mass: Matter is neither created nor destroyed\n\n## Applications\n\nChemistry is essential in:\n- Medicine and pharmaceuticals\n- Materials science\n- Environmental science\n- Food science\n- Energy production\n\nChemistry helps us understand the molecular world and create new materials and medicines.`,
        author: 'Prof. Michael Brown',
        description: 'Learn about atoms, molecules, and chemical reactions that shape our world.'
      },
      { 
        title: 'Physics', 
        content: `# Physics - Chapter 1: Motion and Forces\n\nPhysics is the study of matter, energy, and the fundamental forces of nature.\n\n## Motion\n\nMotion describes how objects change position over time. Key concepts include:\n- **Position**: Where an object is located\n- **Velocity**: How fast and in what direction an object is moving\n- **Acceleration**: How quickly velocity changes\n\n## Newton's Laws of Motion\n\n1. **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2. **Second Law**: Force equals mass times acceleration (F = ma)\n\n3. **Third Law**: For every action, there is an equal and opposite reaction\n\n## Energy\n\nEnergy is the ability to do work. It comes in many forms:\n- Kinetic energy: Energy of motion\n- Potential energy: Stored energy\n- Thermal energy: Heat energy\n- Electrical energy: Energy from electric charges\n\n## Applications\n\nPhysics principles are used in:\n- Engineering and technology\n- Space exploration\n- Medical imaging\n- Renewable energy\n- Communication systems\n\nUnderstanding physics helps us comprehend the natural world and develop new technologies.`,
        author: 'Dr. Emily Davis',
        description: 'Discover the fundamental laws that govern the universe and motion.'
      },
      { 
        title: 'Hindi', 
        content: `# Hindi - Chapter 1: Basic Introduction\n\nHindi is one of the most widely spoken languages in the world, with over 500 million speakers.\n\n## Hindi Alphabet (Devanagari)\n\nThe Hindi alphabet consists of 13 vowels and 33 consonants. The script is written from left to right.\n\n### Vowels (स्वर)\nअ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ, अं, अः\n\n### Consonants (व्यंजन)\nक, ख, ग, घ, ङ, च, छ, ज, झ, ञ, ट, ठ, ड, ढ, ण, त, थ, द, ध, न, प, फ, ब, भ, म, य, र, ल, व, श, ष, स, ह\n\n## Basic Greetings\n\n- नमस्ते (Namaste) - Hello\n- धन्यवाद (Dhanyavad) - Thank you\n- कृपया (Kripaya) - Please\n- क्षमा करें (Kshama karen) - Excuse me\n\n## Common Phrases\n\n- आप कैसे हैं? (Aap kaise hain?) - How are you?\n- मेरा नाम... है (Mera naam... hai) - My name is...\n- मुझे मदद चाहिए (Mujhe madad chahiye) - I need help\n\n## Grammar Basics\n\nHindi follows a Subject-Object-Verb (SOV) word order. Verbs change based on gender, number, and person.\n\nLearning Hindi opens doors to understanding Indian culture, literature, and communication with millions of speakers worldwide.`,
        author: 'Prof. Rajesh Kumar',
        description: 'Master the Hindi language with comprehensive grammar and vocabulary lessons.'
      },
      { 
        title: 'Urdu', 
        content: `# Urdu - Chapter 1: Introduction to Urdu\n\nUrdu is a beautiful language with a rich literary heritage, spoken by millions across South Asia.\n\n## Urdu Alphabet\n\nUrdu uses the Perso-Arabic script, written from right to left. It consists of 38 letters.\n\n### Basic Letters\nا, ب, پ, ت, ٹ, ث, ج, چ, ح, خ, د, ڈ, ذ, ر, ڑ, ز, ژ, س, ش, ص, ض, ط, ظ, ع, غ, ف, ق, ک, گ, ل, م, ن, ں, و, ہ, ھ, ی, ے\n\n## Common Greetings\n\n- السلام علیکم (Assalamu Alaikum) - Peace be upon you\n- شکریہ (Shukriya) - Thank you\n- برائے مہربانی (Baraye meharbani) - Please\n- معاف کیجئے (Maaf kijiye) - Excuse me\n\n## Basic Phrases\n\n- آپ کیسے ہیں؟ (Aap kaise hain?) - How are you?\n- میرا نام... ہے (Mera naam... hai) - My name is...\n- میں ٹھیک ہوں (Main theek hoon) - I am fine\n\n## Grammar\n\nUrdu grammar is similar to Hindi but uses different script. It follows Subject-Object-Verb order and has gender distinctions.\n\nUrdu is known for its poetic beauty and is the language of many famous poets and writers. Learning Urdu provides access to a rich cultural and literary tradition.`,
        author: 'Dr. Ahmed Ali',
        description: 'Learn Urdu language with its beautiful script and rich literary tradition.'
      },
      { 
        title: 'Business', 
        content: `# Business - Chapter 1: Introduction to Business Management\n\nBusiness management involves planning, organizing, leading, and controlling resources to achieve organizational goals.\n\n## What is Business?\n\nA business is an organization engaged in commercial, industrial, or professional activities. Businesses can be:\n- For-profit: Aim to make money\n- Non-profit: Serve a social purpose\n- Public: Owned by government\n- Private: Owned by individuals or groups\n\n## Key Business Functions\n\n1. **Marketing**: Understanding customer needs and promoting products\n2. **Finance**: Managing money, investments, and financial planning\n3. **Operations**: Producing goods and services efficiently\n4. **Human Resources**: Managing employees and organizational culture\n5. **Strategy**: Long-term planning and competitive positioning\n\n## Business Models\n\n- **B2B (Business-to-Business)**: Companies selling to other companies\n- **B2C (Business-to-Consumer)**: Companies selling to individual customers\n- **E-commerce**: Online business transactions\n- **Franchise**: Licensing business model to others\n\n## Entrepreneurship\n\nEntrepreneurship involves:\n- Identifying opportunities\n- Taking calculated risks\n- Innovation and creativity\n- Building and managing teams\n- Financial planning and management\n\n## Success Factors\n\nSuccessful businesses focus on:\n- Customer satisfaction\n- Quality products/services\n- Efficient operations\n- Strong leadership\n- Financial stability\n- Adaptability to change\n\nUnderstanding business principles is essential for anyone looking to start a business or advance in their career.`,
        author: 'Dr. Robert Wilson',
        description: 'Essential business concepts, management principles, and entrepreneurship strategies.'
      },
      { 
        title: 'History', 
        content: `# History - Chapter 1: Understanding History\n\nHistory is the study of past events, particularly human affairs. It helps us understand how societies have evolved over time.\n\n## Why Study History?\n\nHistory provides:\n- Understanding of how the present came to be\n- Lessons from past mistakes and successes\n- Cultural awareness and appreciation\n- Critical thinking skills\n- Context for current events\n\n## Historical Periods\n\n1. **Ancient History**: Early civilizations (Egypt, Mesopotamia, Greece, Rome)\n2. **Medieval History**: Middle Ages (500-1500 CE)\n3. **Modern History**: Renaissance to present (1500-present)\n\n## Key Historical Concepts\n\n- **Primary Sources**: Original documents and artifacts from the time period\n- **Secondary Sources**: Interpretations and analyses of historical events\n- **Chronology**: The arrangement of events in time order\n- **Causation**: Understanding why events happened\n\n## Major Civilizations\n\n- **Ancient Egypt**: Pyramids, pharaohs, hieroglyphics\n- **Ancient Greece**: Democracy, philosophy, arts\n- **Roman Empire**: Law, engineering, governance\n- **Medieval Europe**: Feudalism, crusades, renaissance\n- **Asian Empires**: China, India, Japan\n\n## Historical Thinking Skills\n\n- Analyzing sources\n- Identifying bias\n- Understanding context\n- Making connections\n- Drawing conclusions\n\nHistory teaches us about human nature, society, and the consequences of our actions. It's essential for understanding our world today.`,
        author: 'Prof. Elizabeth Taylor',
        description: 'Journey through time and explore significant historical events and civilizations.'
      },
      { 
        title: 'C Language', 
        content: `# C Language - Chapter 1: Introduction to C Programming\n\nC is a powerful, general-purpose programming language that has influenced many modern languages.\n\n## What is C?\n\nC is a procedural programming language developed in the 1970s. It's known for:\n- Efficiency and performance\n- Low-level access to memory\n- Portability across different platforms\n- Foundation for many other languages\n\n## Basic Syntax\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n\n## Data Types\n\nC supports various data types:\n- **int**: Integer numbers\n- **float**: Floating-point numbers\n- **char**: Single characters\n- **double**: Double-precision floating-point\n\n## Variables and Operators\n\nVariables store data values. Operators perform operations:\n- Arithmetic: +, -, *, /, %\n- Comparison: ==, !=, <, >, <=, >=\n- Logical: &&, ||, !\n\n## Control Structures\n\n- **if-else**: Conditional execution\n- **for loop**: Iteration with counter\n- **while loop**: Iteration with condition\n- **switch**: Multiple choice selection\n\n## Functions\n\nFunctions are reusable blocks of code:\nint add(int a, int b) {\n    return a + b;\n}\n\n## Pointers\n\nPointers store memory addresses, allowing direct memory manipulation - a powerful but careful feature of C.\n\nC programming provides a solid foundation for understanding how computers work at a low level.`,
        author: 'Dr. Brian Kernighan',
        description: 'Master the fundamentals of C programming language from basics to advanced concepts.'
      },
      { 
        title: 'Python', 
        content: `# Python - Chapter 1: Getting Started with Python\n\nPython is a high-level, interpreted programming language known for its simplicity and readability.\n\n## Why Python?\n\nPython is popular because:\n- Easy to learn and read\n- Versatile (web, data science, AI, automation)\n- Large community and libraries\n- Cross-platform compatibility\n- Great for beginners and experts\n\n## Basic Syntax\n\nprint("Hello, World!")\n\n# Variables\nname = "Python"\nage = 30\n\n# Lists\nnumbers = [1, 2, 3, 4, 5]\n\n## Data Types\n\nPython has dynamic typing:\n- **int**: Integers (1, 2, 3)\n- **float**: Decimals (3.14, 2.5)\n- **str**: Strings ("hello", 'world')\n- **list**: Ordered collections [1, 2, 3]\n- **dict**: Key-value pairs {"name": "Python"}\n\n## Control Flow\n\n# If statement\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")\n\n# For loop\nfor i in range(5):\n    print(i)\n\n## Functions\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\n\n## Libraries\n\nPython has extensive libraries:\n- **NumPy**: Numerical computing\n- **Pandas**: Data analysis\n- **Django/Flask**: Web development\n- **TensorFlow**: Machine learning\n\nPython's simplicity makes it perfect for beginners while its power makes it ideal for professional development.`,
        author: 'Dr. Guido van Rossum',
        description: 'Learn Python programming with practical examples and real-world applications.'
      },
      { 
        title: 'Java', 
        content: `# Java - Chapter 1: Introduction to Java\n\nJava is an object-oriented programming language designed for portability and reliability.\n\n## What is Java?\n\nJava is:\n- Platform-independent ("Write Once, Run Anywhere")\n- Object-oriented\n- Secure and robust\n- Widely used in enterprise applications\n- The foundation for Android development\n\n## Basic Program Structure\n\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n\n## Object-Oriented Concepts\n\n- **Classes**: Blueprints for objects\n- **Objects**: Instances of classes\n- **Inheritance**: Reusing code from parent classes\n- **Polymorphism**: Same interface, different implementations\n- **Encapsulation**: Hiding internal details\n\n## Data Types\n\n- **Primitive**: int, double, boolean, char\n- **Reference**: String, Arrays, Objects\n\n## Control Structures\n\n// If-else\nif (age >= 18) {\n    System.out.println("Adult");\n} else {\n    System.out.println("Minor");\n}\n\n// For loop\nfor (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}\n\n## Collections\n\nJava provides powerful collection classes:\n- **ArrayList**: Dynamic arrays\n- **HashMap**: Key-value pairs\n- **Set**: Unique elements\n- **LinkedList**: Linked data structures\n\n## Exception Handling\n\ntry {\n    // risky code\n} catch (Exception e) {\n    // handle error\n}\n\nJava's strong typing and object-oriented nature make it ideal for large-scale enterprise applications.`,
        author: 'Dr. James Gosling',
        description: 'Comprehensive guide to Java programming, object-oriented design, and application development.'
      },
      { 
        title: 'JavaScript', 
        content: `# JavaScript - Chapter 1: Introduction to JavaScript\n\nJavaScript is the programming language of the web, enabling interactive and dynamic websites.\n\n## What is JavaScript?\n\nJavaScript is:\n- The language of web browsers\n- Used for frontend and backend (Node.js)\n- Dynamic and flexible\n- Essential for modern web development\n- Supports multiple programming paradigms\n\n## Basic Syntax\n\n// Variables\nlet name = "JavaScript";\nconst version = "ES6";\nvar oldWay = "deprecated";\n\n// Functions\nfunction greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\n// Arrow functions\nconst add = (a, b) => a + b;\n\n## Data Types\n\n- **Primitive**: string, number, boolean, null, undefined, symbol\n- **Objects**: Arrays, Objects, Functions, Dates\n\n## DOM Manipulation\n\n// Select element\nconst element = document.getElementById('myId');\n\n// Change content\nelement.textContent = "New text";\n\n// Add event listener\nelement.addEventListener('click', function() {\n    alert('Clicked!');\n});\n\n## Modern Features\n\n- **ES6+**: Arrow functions, classes, modules\n- **Async/Await**: Handling asynchronous operations\n- **Promises**: Better async code\n- **Destructuring**: Extracting values from objects/arrays\n\n## Frameworks and Libraries\n\n- **React**: Component-based UI library\n- **Vue**: Progressive JavaScript framework\n- **Angular**: Full-featured framework\n- **Node.js**: Server-side JavaScript\n\nJavaScript powers modern web applications and is essential for any web developer.`,
        author: 'Dr. Brendan Eich',
        description: 'Master JavaScript for web development, interactive applications, and modern programming.'
      },
      { 
        title: 'C++', 
        content: `# C++ - Chapter 1: Introduction to C++\n\nC++ is a powerful, multi-paradigm programming language that extends C with object-oriented features.\n\n## What is C++?\n\nC++ combines:\n- Low-level efficiency of C\n- Object-oriented programming\n- Generic programming (templates)\n- Modern features (C++11, C++14, C++17, C++20)\n\n## Basic Program\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n\n## Object-Oriented Programming\n\nclass Car {\nprivate:\n    string brand;\n    int speed;\n    \npublic:\n    Car(string b, int s) : brand(b), speed(s) {}\n    \n    void accelerate() {\n        speed += 10;\n    }\n    \n    void display() {\n        cout << brand << " going " << speed << " mph" << endl;\n    }\n};\n\n## Key Features\n\n- **Classes and Objects**: Encapsulation of data and methods\n- **Inheritance**: Code reuse through class hierarchies\n- **Polymorphism**: Virtual functions and interfaces\n- **Templates**: Generic programming\n- **STL**: Standard Template Library with containers and algorithms\n\n## Memory Management\n\n// Smart pointers (modern C++)\nunique_ptr<int> ptr = make_unique<int>(42);\nshared_ptr<int> shared = make_shared<int>(100);\n\n## STL Containers\n\n- **vector**: Dynamic arrays\n- **map**: Key-value pairs\n- **set**: Unique elements\n- **queue/stack**: Data structures\n\n## Applications\n\nC++ is used in:\n- Game development\n- System programming\n- High-performance computing\n- Embedded systems\n- Operating systems\n\nC++ provides the power of low-level programming with high-level abstractions, making it ideal for performance-critical applications.`,
        author: 'Dr. Bjarne Stroustrup',
        description: 'Advanced C++ programming with object-oriented design, templates, and modern C++ features.'
      }
    ];

    let updated = 0;
    for (const bookData of booksWithContent) {
      const book = await Book.findOne({ title: bookData.title });
      if (book && (!book.content || book.content === '')) {
        book.content = bookData.content;
        if (bookData.author) book.author = bookData.author;
        if (bookData.description) book.description = bookData.description;
        await book.save();
        updated++;
      }
    }

    res.json({ 
      success: true, 
      message: `Updated ${updated} books with content` 
    });
  } catch (error) {
    console.error('Update books content error:', error);
    res.status(500).json({ success: false, message: 'Server error updating books content' });
  }
});

// Get Single Book by ID (must be after /init route)
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid book ID' });
    }
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    // Backfill content if empty - match by title (case-insensitive)
    if (!book.content || String(book.content).trim() === '') {
      const contentData = Book.getContentByTitle(book.title);
      if (contentData) {
        book.content = contentData.content;
        if (contentData.author) book.author = contentData.author;
        if (contentData.description) book.description = contentData.description;
        await book.save();
      }
    }
    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching book' });
  }
});

// Update Book (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, author, category, imageUrl, description, content, isAvailable } = req.body;
    
    // Check if ID is valid MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid book ID' });
    }
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (title) book.title = title;
    if (author !== undefined) book.author = author;
    if (category) book.category = category;
    if (imageUrl !== undefined) book.imageUrl = imageUrl;
    if (description !== undefined) book.description = description;
    if (content !== undefined) book.content = content;
    if (isAvailable !== undefined) book.isAvailable = isAvailable;

    await book.save();

    res.json({
      success: true,
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ success: false, message: 'Server error updating book' });
  }
});

// Delete Book (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    // Check if ID is valid MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid book ID' });
    }
    
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting book' });
  }
});

module.exports = router;

