# Whose Turn To Pay

A Bertram Labs coding challenge completed, and slightly over-engineered by Alex Vranas

Check out the deployed app here!

http://whose-turn-env.eba-ppfanfv3.us-east-1.elasticbeanstalk.com/

## Features

### Create orders

Input each person's name, and how much their order cost. Select which person paid for the order.


### View Past orders

Previous orders and how 

### Find out whose turn it is to pay

Whoever is in the most debt is whose turn it is to pay for coffee. Their name will be displayed at the top of the screen, along with all other coworkers along with their debt, or what they're owed.

## Assumptions
1. Whomever's turn it is to buy coffee is determined by who is in the most amount of debt, which is determined by the amount of money they have spent minus the total cost of all of their orders. The lower the value, the greater amount of debt.
2. New people are allowed to participate
3. Existing people don't have to keep participating
4. Anyone can pay for an order even if it's not their turn. If it's Bob's turn to pay on his birthday, someone else should treat him!

## Didn't have time to implement
1. Testing :(
2. Frontend update order feature (there's support on the backend)

## Technologies

1. React
2. TypeScript
3. Node.js
4. Express.js
5. Prettier
6. ESLint
7. Webpack
8. Axios
9. DynamoDB

## Starting Your Local Dev Environment

### Fork and clone the repo

```bash
git clone https://github.com/avranas/whose-turn-to-pay.git
```

### Navigate to the project folder

```bash
cd whose-turn-to-pay
```

### Install the necessary packages

```bash
npm install
```

### Add your environment variables
Create a .env file in your root directory. Remember to add ".env" to your .gitignore file, and add the following environment variables:
1. NODE_ENV=\<development OR production\>
2. PORT=\<The port to listen from\>
3. AWS_REGION= \<your AWS region\>
4. ACCESS_KEY_ID= \<your AWS key ID\>
5. SECRET_ACCESS_KEY= \<your AWS secret access key\>

### Run locally

```bash
npm run dev
```
