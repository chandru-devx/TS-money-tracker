import { create } from "zustand"

type SpendItem = {
    id: number
    spend: string
    amount: number
    date: string
}

type ReviewStore = {
    items: SpendItem[]
    addItem: (item: SpendItem) => void


    totalAmount: () => number
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
    items: [],

    addItem: (item) => set((state) => ({ items: [...state.items, item], })),



    totalAmount: () => {
        const item = get().items

        return item.reduce((total, item) => {
            return total + item.amount
        }, 0)
    }
}))