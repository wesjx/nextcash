import { db } from "@/db"
import { categoriesTable, transactionsTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { and, eq, sql } from "drizzle-orm"
import "server-only"

export async function getAnnualCashFlow(year: number) {
    const { userId } = await auth()

    if (!userId) {
        return []
    }

    const month = sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`

    const cashFlow = await db.select({
        month: month,
        totalIncome: sql`SUM(CASE WHEN ${categoriesTable.type} = 'income' 
            THEN ${transactionsTable.amount} ELSE 0 END)`,
        totalExpenses: sql`SUM(CASE WHEN ${categoriesTable.type} = 'expenses' 
            THEN ${transactionsTable.amount} ELSE 0 END)`,
    })
        .from(transactionsTable)
        .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
        .where(and(
            eq(transactionsTable.userId, userId),
            sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${year}`
        ))
        .groupBy(month)

    const annualCashFlow: {
        month: number
        income: number
        expenses: number
    }[] = []
    // to set 0 for month what does not has a transaction

    for(let i = 1; i <= 12; i++){
        const monthlyCashFlow = cashFlow.find(cf => Number(cf.month) === i)
        annualCashFlow.push({
            month: i,
            income: Number(monthlyCashFlow?.totalIncome ?? 0),
            expenses: Number(monthlyCashFlow?.totalExpenses ?? 0)
        })
    }

    console.log({annualCashFlow})
    return annualCashFlow
}