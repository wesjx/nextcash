import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnnualCashFlow } from "@/data/getAnnualCashFlow"
import CashFlowFilters from "./cashflow-filters"
import { getTransactionByYearsRange } from "@/data/getTransactionsByYear"
import { CashFlowContent } from "./cashflow-content"

export default async function CashFlow({
    year
} : {
    year: number
}) {
    const [cashFlow, yearsRange] = await Promise.all([
        getAnnualCashFlow(year), 
        getTransactionByYearsRange()]
    )

    return (
        <Card className="mb-5 ">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <span>
                        CashFlow
                    </span>
                    <CashFlowFilters year={year} yearsRange={yearsRange}/>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-[1fr_250px]"> 
                <CashFlowContent annualCashFlow={cashFlow} />
            </CardContent>
        </Card>
    )
}