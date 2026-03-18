import { useReviewStore } from "@/store/useReviewStore"
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableFooter,
} from "../ui/table"
import { useEffect } from "react"
import { Button } from "../ui/button";

const SpendTable = () => {
    const { items, totalAmount, fetchItems, loading } = useReviewStore()

    useEffect(() => {
        fetchItems()
    }, [])

    return (
        <Table className="w-[600px]">
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>

            </TableHeader>

            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-2xl">
                            Loading...
                        </TableCell>
                    </TableRow>
                ) : items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No data found
                        </TableCell>
                    </TableRow>
                ) : (
                    items.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.spend}</TableCell>
                            <TableCell>₹ {item.amount}</TableCell>
                            <TableCell>
                                <div className="flex gap-4">
                                    <FaEdit size={20} />
                                    <MdDelete size={20} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="text-center font-semibold">
                        Total
                    </TableCell>
                    <TableCell className="font-bold">
                        ₹ {totalAmount()}
                    </TableCell>
                    <TableCell>
                        <Button>Clear All</Button>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default SpendTable