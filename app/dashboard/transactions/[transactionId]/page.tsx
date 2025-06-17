import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategories } from "@/data/getCategories"
import EditTransactionForm from "./edit-transaction-form"
import { getTransaction } from "@/data/getTransaction"
import { notFound } from "next/navigation"
import DeleteTransactionDialog from "./delete-transaction"

export default async function EditTransaction({
    params
}: {
    params: Promise<{ transactionId: string }>
}) {
    const paramsValues = await params
    const transactionId = Number(paramsValues.transactionId)

    if (isNaN(transactionId)) {
        notFound()
    }

    const categories = await getCategories()

    const transaction = await getTransaction(transactionId)

    if (!transaction) {
        notFound()
    }

    return (
        <div className="max-w-screen-xl mx-auto p-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/transactions">Transactions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Edit transaction</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4 max-w-screen-md">
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <span>Edit transaction</span>
                        <DeleteTransactionDialog transactionId={transaction.id} transactionDate={transaction.transactionDate} />
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <EditTransactionForm
                        transaction={transaction}
                        categories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}

