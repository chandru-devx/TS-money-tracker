import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useReviewStore } from "@/store/useReviewStore"
import { useState } from "react"

const Spend = () => {
 
    const [spendValue, setSpendValue] = useState("")
    const [amountValue, setAmountValue] = useState("")
    const [dateValue, setDateValue] = useState("")
    const [message, setmessage] = useState("")

    const { addItem } = useReviewStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!spendValue.trim()) {
            setmessage("Please fill the name")
            return
        }

        if (!amountValue.trim()) {
            setmessage("Please fill the amount")
            return
        }

        if (!dateValue.trim()) {
            setmessage("Please fill the date")
            return
        }

        // clear error
        setmessage("")

        addItem({
            spend: spendValue,
            amount: Number(amountValue),
            date: dateValue,
        })

        // reset form
        setSpendValue("")
        setAmountValue("")
        setDateValue("")
    }



    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-sm p-6">

            <Input
                placeholder="Spend name"
                value={spendValue}
                onChange={(e) => setSpendValue(e.target.value)}
            />

            <Input
                type="number"
                placeholder="Amount"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
            />
            <Input
                type="date"
                placeholder="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
            />

            {message && <p className="text-red-600">{message}</p>}

            <Button className="w-24" type="submit">
                ADD
            </Button>
        </form>
    )
}

export default Spend