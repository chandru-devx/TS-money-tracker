import { create } from "zustand"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import toast from "react-hot-toast"

type SpendItem = {
    id: string // ✅ change to string (Firestore ID)
    spend: string
    amount: number
    date: string
}

type ReviewStore = {
    items: SpendItem[]
    loading: boolean
    fetchItems: () => Promise<void>
    addItem: (item: Omit<SpendItem, "id">) => Promise<void>
    totalAmount: () => number
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
    items: [],
    loading: false,

    fetchItems: async () => {
        try {
            const user = auth.currentUser

            if (!user) {
                toast.error("User not logged in")
                return
            }

            set({ loading: true })

            const ref = collection(db, "users", user.uid, "spends")

            const snapshot = await getDocs(ref)

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<SpendItem, "id">)
            }))

            set({
                items: data,
                loading: false
            })

        } catch (error: any) {
            console.error("Fetch error:", error)
            toast.error(error.message || "Failed to fetch data")
            set({ loading: false })
        }
    },

    addItem: async (item) => {
        try {
            const user = auth.currentUser
            if (!user) return

            const ref = collection(db, "users", user.uid, "spends")

            const docRef = await addDoc(ref, {
                ...item,
                createdAt: new Date()
            })

            set((state) => ({
                items: [...state.items, { id: docRef.id, ...item }]
            }))

        } catch (error: any) {
            toast.error(error.message)
        }
    },

    totalAmount: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.amount, 0)
    }
}))