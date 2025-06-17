"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

type Props = {
    year: number,
    yearsRange: number[]
}

export default function CashFlowFilters({
    year,
    yearsRange
}: Props) {
    const router = useRouter()
    return (
        <div className="">

            <Select defaultValue={year.toString()} onValueChange={(value) => {
                router.push(`/dashboard?cfyear=${value}`)
            }}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {yearsRange.map(year => (
                        <SelectItem value={year.toString()} key={year}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}