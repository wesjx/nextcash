import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import NewTransactionForm from "./new-transaction-form";

export default async function NewTransaction() {
    const categories = await getCategories()

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
                    <BreadcrumbPage>New transaction</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4 max-w-screen-md">
                <CardHeader>
                    <CardTitle>
                        New transaction
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <NewTransactionForm categories={categories} />
                </CardContent>
            </Card>
        </div>
    )
}