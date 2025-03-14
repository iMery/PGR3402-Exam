Library Management System - Exam Project

Overview – The book bar
For this exam I have developed a web-based application that allows users to interact with a library, enabling them to search for books, borrow and return them, and leave reviews. Additionally, an admin is provided to manage the library’s book collection by adding, updating, and deleting books.
This system is built with a microservices architecture, ensuring scalability, reliability, and maintainability. Each service operates independently and communicates with others through synchronous and asynchronous communication. I also used an api gateaway to route api calls and for load balancing.

Building and running the project

To be able to run my project docker deskop must be installed. I have used docker to run all services and frontend together. Docker:

•	Check if docker and docker-compose are installed: docker –version, docker-compose --version
•	To build and run project run: docker-compose up –build, will start all services frontend and api gateaway. Note node_modules are installed in the containers so they wont show when running the project. 
•	To check healthe run: docker ps, this will show all services with (healthy). It may take 30 to 60 seconds after running for health to show. 
•	Porject will run on: http://localhost:3000.
•	To stop running all services run: docker-compose down.
•	To restart run: docker-compose up.
•	Sometimes bookService is not connected to userService websocket and it will show in terminal. Just restart bookService by running docker restart librarysystem-book-service-1 and it will connect.
•	I have already tested this on mac and windows and it works fine. Make sure u have ur docker desktop open to build and run containers.

Services

•	Authentication service: Handles login, registration and authentication using JWT tokens. 
•	Book service: Handles the book data like searching, borroing returning and the aailability. Comments are also handeled by this service. 
•	Admin service: Manges the books – adding updating and removing books. 
•	User service: Manges user profiles and borrowing history. 


Services and routes:

•	auth-service on port 5003
•	user-service on port 5004
•	book-service on port 5002
•	admin-service on port 5001
•	frontend on port 3000
•	nginx (API Gateway) on port 5005

Communication

•	Authentication service and book service has two synchrononos communications. When a user logs inn a token is genrated and a user cannot borrow and return books if not authenticated. So the authentication service gives the user its user role. Addiodtionally book services fetches user info so and use it to add comments and reviews to books. 
•	Authentication service and admin service has a synchrononous communication. When an admin logs inn a token is genrated to authenticate the admin and gives it access to the admin role. 
•	Book service and user service communicates using websockets, event-driven communication. When a user borrows or returns a book, events (borrow and return events) are sent to the user service to update the user borrowing history in real time. 

User stories

Admin:

•	As an admin, I want to be able to login so I can manage books.
•	As an admin, I want to remove books from the system.
•	As an admin, I want to update book details (title, author, published year).

User:
•	As a user, I should see books as anavailable if they are borrowed by others. 
•	As a user I want to be able to login in and access the library.
•	As a user I want to search for books by title, author and published year.
•	As a user I want to be able to see my borrowing history. 
•	As a user I want my borrowing history to be updated in realtime. 
•	As a user I want to be able to borrow and return a book whenever I want. 
•	As a user I want to be able to leave comments on the books.
•	As a user I want to be able to delete my comments and view other comments added to the book. 
•	As a user I want to be able to register and create an account. 


Admin and user credentials:

Only one admin available: 

•	Username: libraryadmin, password: admin123

I have created 2 users:

•	Username: imery, password: smoo2001
•	Username: user, password: smoo2001
•	User accounts can also be created – usernames must contain letters only and should be uniqe.  
