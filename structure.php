project-root/
│
├── backend/
│   ├── config/
│   │   └── db.js                # Database connection setup
│   ├── models/
│   │   └── User.js              # User schema for authentication
│   │   └── Signature.js         # Signature schema for verification
│   │   └── Account.js           # Account schema for storing account details and images
│   ├── routes/
│   │   └── auth.js              # Authentication routes (e.g., login, signup)
│   │   └── signature.js         # Signature verification routes
│   │   └── account.js           # Account routes for adding, fetching, and updating accounts
│   ├── deeplearning/
│   │   ├── verify_signature.js/ # Verifying signature whether genuine or forged
│   ├── uploads/
│   │   └── sample1.jpg          # Example images for conversion to Base64
│   ├── scripts/
│   │   └── addacc.js         # To add details and images into the database
│   ├── server.js                # Entry point for the backend server
│   ├── .env                     # Environment variables (MongoDB URI, JWT secret, etc.)
│   ├── package.json             # Backend dependencies and scripts
│
├── frontend/
│   ├── public/
│   │   └── index.html           # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js        # Navigation bar
│   │   │   └── Navbar.css        # Navigation bar style
│   │   │   └── Main.js          # Home page
│   │   │   └── Main.css          # Home page style
│   │   │   └── Signup.js        # Signup page
│   │   │   └── Signup.css        # Signup page style
│   │   │   └── Login.js         # Login page
│   │   │   └── Login.css        # Login page style
│   │   │   └── Verify.js        # Signature verification page
│   │   │   └── Verify.css       # Signature verification page style
│   │   │   └── About.js         # About Us page
│   │   │   └── About.css         # About Us page style
│   │   │   └── Upload.js    # Page for uploading accounts and images 
│   │   │   └── Upload.css    # Page for uploading accounts and images style
│   │   │   └── Nav.js    # Page for Navbar on different pages
│   │   │   └── Nav.css    # Page for Navbar on different pages style
│   │   │   └── ProtectRoute.js    # Page for protecting pages before loging in
│   │   ├── App.js               # Main React app component
│   │   ├── App.css               # Main React app component style
│   │   ├── index.js             # Entry point for the React app
│   │   ├── index.css            # CSS styles for the frontend
│   ├── package.json             # Frontend dependencies and scripts
│
└── package.json                 # Shared package.json for managing global dependencies
└── structure.php                 # Structure of the project
