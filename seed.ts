import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv'
import { categoriesTable } from './db/schema';

dotenv.config({
    path: ".env.local",
})

const db = drizzle(process.env.DATABASE_URL!);

const categoriesSeedData: (typeof categoriesTable.$inferInsert)[] = [
    {
        name: "Salary",
        type: "income",
    },
    {
        name: "Rental Income",
        type: "income",
    },
    {
        name: "Business Income",
        type: "income",
    },
    {
        name: "Investments",
        type: "income",
    },
    {
        name: "Other",
        type: "income",
    },
    {
        name: "Housing",
        type: "expenses",
    },
    {
        name: "Transport",
        type: "expenses",
    },
    {
        name: "Food & Groceries",
        type: "expenses",
    },
    {
        name: "Health",
        type: "expenses",
    },
    {
        name: "Entertainment & Leisure",
        type: "expenses",
    },
    {
        name: "Other",
        type: "expenses",
    },
];


async function main() {
    await db.insert(categoriesTable).values(categoriesSeedData)
}

main()