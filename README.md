#### Setup

1. Setup .env in the root
2. Setup JWT_LIFETIME to your .env, recommended value is 30d (for how long the JWT token will be valid)
3. Setup JWT_SECRET to your .env, recommended value is 256-bit encryption key
4. Setup AWS_BUCKET_NAME to your .env
5. Setup AWS_BUCKET_REGION to your .env
6. Setup AWS_ACCESS_KEY to your .env
7. Setup AWS_SECRET_KEY to your .env

#### To use populate

1. Create user with /api/v1/auth/register route
2. Setup POPULATE_CREATED_BY to your .env which should be an id of your created user
3. Upload images to S3 and paste their keys to imageKey field in products.json
4. Then you can run this command to clear your products from database and create there products from products.json

```bash
node populate
```

#### Database Connection

1. Add MONGO_URI to your .env with correct value

#### Then run that in terminal

```bash
yarn install && yarn start
```

#### OR

```bash
npm install && npm start
```

#### CRUD 

- provided using products controller
- uses mongoose to create/read/update/delete objects in MongoDB
- in creation and updating products mongoose validators used 
- for each product image is required by default

#### Routers

- auth.js
- products.js

#### User Model

Email validation done using that regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Images

- AWS S3 used to upload images on server
- You can access any image by imageKey using /api/v1/products/images/:imageKey route

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate JWT Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### This Mongoose errors were handled manually:

- Validation Errors
- Duplicate (Email)

#### Security used

- helmet
- cors
- xss-clean
- express-rate-limit

#### Swagger UI
- Used to create API documentation


