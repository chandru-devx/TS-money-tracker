import { useReviewStore } from "@/store/useReviewStore"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableFooter,
} from "../ui/table"

const SpendTable = () => {
    const { items ,totalAmount} = useReviewStore()

    // const totalAmount = items.reduce((acc, item) => {
    //     return acc + item.amount
    // }, 0)

    return (
        <Table className="w-[600px]">
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {items.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.spend}</TableCell>
                        <TableCell>₹ {item.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="text-center font-semibold">
                        Total
                    </TableCell>
                    <TableCell className="font-bold">
                        ₹ {totalAmount()}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default SpendTable