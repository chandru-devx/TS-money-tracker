import { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { onAuthStateChanged } from "firebase/auth"
import { getDoc } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"


type UserData = {
  firtsName?: string
  lastName?: string
  email?: string
}


const ProfileView = () => {
  const navigate=useNavigate()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData)
        } else {
          setUserData(null)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    toast.success("logout successfully")
    navigate("/login")

  }

  if (loading) return <p>Loading ....</p>

  if (!userData)
    return (
      <div className="text-center mt-10">
        <p>Please signup or login first</p>
      </div>
    );






  return (
    <>
      <div className="flex justify-center mt-10">
        <Card>
          <div className="p-6   items-center  justify-center">

            {/* Header */}
            <div className="flex flex-col items-center mb-6 justify-center">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-semibold text-slate-700">
                {userData.firtsName?.charAt(0)}
              </div>

              <h2 className="text-xl font-semibold mt-3">
                {userData.firtsName} {userData.lastName}
              </h2>

              <p className="text-sm text-gray-500">User Profile</p>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="  py-2 px-3 rounded-md bg-slate-800 text-white hover:bg-slate-900 transition"
            >
              Logout
            </button>

          </div>
        </Card>
      </div>
    </>
  )
}

export default ProfileView