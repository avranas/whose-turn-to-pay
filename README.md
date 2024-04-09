# Whose Turn To Pay

A coding challenge completed and slightly over-engineered by Alex Vranas.

[Check out the deployed app here!](http://whose-turn-env.eba-ppfanfv3.us-east-1.elasticbeanstalk.com/)

## Features

### Create Orders

Input each person's name, and how much their order cost. Select which person paid for the order.

### View Past Orders

View details of previous orders, including how much each person's order costs, and who paid.

### Who's Paying?

Whoever is in the most debt is whose turn it is to pay. Their name will be displayed at the top of the screen, along with all other coworkers and their debt, or what they're owed.

## Assumptions

1. Whoever's turn it is to buy coffee is determined by who has the greatest amount of debt, which is determined by the amount of money they have spent minus the total cost of all of their orders. The lower the value, the greater amount of debt.
2. New people are allowed to participate
3. Existing people don't have to keep participating
4. Anyone can pay for an order even if it's not their turn. If it's Bob's turn to pay on his birthday, someone else should treat him!
5. This is designed for a small group of friends

## Still Want To Implement

1. Unit and end to end tests
2. Frontend update order feature (there's support on the backend)
3. Auto select whose turn it is on NewOrder component

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

### Fork and Clone the Repo

```bash
git clone https://github.com/avranas/whose-turn-to-pay.git
```

### Navigate to the Project Folder

```bash
cd whose-turn-to-pay
```

### Install the Necessary Packages

```bash
npm install
```

### Add your Environment Variables

(Unix Directions) Create a .env file in your root directory. Remember to add ".env" to your .gitignore file, and add the following environment variables:

1. NODE_ENV=\<development OR production\>
2. PORT=\<The port to listen from\>
3. AWS_REGION= \<your AWS region\>
4. ACCESS_KEY_ID= \<your AWS key ID\>
5. SECRET_ACCESS_KEY= \<your AWS secret access key\>

### Run Locally

```bash
npm run dev
```
