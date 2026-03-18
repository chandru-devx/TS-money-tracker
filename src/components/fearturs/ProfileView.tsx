import { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { getDoc, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

type UserData = {
  firtsName?: string
  lastName?: string
  email?: string
}

const ProfileView = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firtsName: "",
    lastName: ""
  })

  const isFormValid = () => {
    if (!formData.firtsName.trim()) return false
    if (!formData.lastName.trim()) return false
    if (formData.firtsName.length < 2) return false
    if (formData.lastName.length < 2) return false

    return true
  }

  const isChanged = formData.firtsName !== userData?.firtsName || formData.lastName !== userData?.lastName

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as UserData

          setUserData(data)

          setFormData({
            firtsName: data.firtsName || "",
            lastName: data.lastName || ""
          })
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
    toast.success("Logout successful")
    navigate("/login")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    const user = auth.currentUser
    if (!user || !userData) return

    // ✅ Validation
    if (!formData.firtsName.trim()) {
      toast.error("First name is required")
      return
    }

    if (!formData.lastName.trim()) {
      toast.error("Last name is required")
      return
    }

    if (formData.firtsName.length < 2) {
      toast.error("First name must be at least 2 characters")
      return
    }

    if (formData.lastName.length < 2) {
      toast.error("Last name must be at least 2 characters")
      return
    }

    try {
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        firtsName: formData.firtsName,
        lastName: formData.lastName
      })

      setUserData(prev => ({
        ...prev!,
        firtsName: formData.firtsName,
        lastName: formData.lastName
      }))
      setIsEditing(false)
      toast.success("Profile updated successfully")

    } catch (error) {
      console.error(error)
      toast.error("Update failed")
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center mt-20">
        <p>Please signup or login first</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card>
        <div className="p-6 flex flex-col items-center">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-semibold text-slate-700">
            {userData.firtsName?.charAt(0)}
          </div>

          {/* Name / Edit */}
          {isEditing ? (
            <div className="flex flex-col gap-2 mt-4 w-full">
              <input
                type="text"
                name="firtsName "
                value={formData.firtsName}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="First Name"
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Last Name"
              />
            </div>
          ) : (
            <h2 className="text-xl font-semibold mt-4">
              {userData.firtsName} {userData.lastName}
            </h2>
          )}

          <p className="text-sm text-gray-500 mt-1">User Profile</p>

          {/* Info */}
          <div className="w-full mt-6 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 w-full">

            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={!isFormValid() || !isChanged}
                className="flex-1 py-2 rounded-md bg-green-600 text-white 
             hover:bg-green-700 transition 
             disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Edit
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-900 transition"
            >
              Logout
            </button>

          </div>

        </div>
      </Card>
    </div>
  )
}

export default ProfileView