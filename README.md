# **City Explorer Backend**

This backend project includes both the database and the API for our City Explorer App. 

The database stores information about the users, city information, and the attractions the users have stored in their bucket lists for each city.

## Local Backend Setup

To get the database and API up and running on your local machine, follow these steps:

### **Prerequisites**

Ensure you have the following installed: 

- **[Node.js](https://nodejs.org/)** (minimum version: v21.7.3)
- **[PostgreSQL](https://www.postgresql.org/download/)** (minimum version: v16.3)

### 1. Clone the Repository

Begin by cloning the repository to your local machine. Use the following command in your terminal, ensuring you navigate to your desired directory:

```bash
git clone https://github.com/EliR94/city-explorer-backend.git
```

### 2. Install Dependencies

Next, install the project dependencies using npm. Execute the following command in your terminal (ensure you're within the repository directory):

```bash
npm install
```

This command will fetch and install the required packages.


#### 3. Create Environment Variable Files

- You'll need to create two `.env` files: `.env.test` and `.env.development` within the project root directory to store the database names.
- Add PGDATABASE=`<insert-database-name-here>` into each `.env.` file ensuring to use the correct database name in each file.


#### 4. Set-Up and Seed the Databases
Set up the local databases:
```bash
npm setup-dbs
```
Seed the development database:
```bash
npm run seed
```
Run the API tests:
```bash
npm run test
```

### Frontend Links:
To see the App in action, follow these links:
- App: https://city-explorer-web.netlify.app/
- GitHub: https://github.com/michael-farah/city-explorer-app