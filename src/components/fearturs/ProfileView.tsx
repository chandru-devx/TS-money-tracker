import { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { getDoc, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

type UserData = {
  firtsName?: string
  lastName?: string
  email?: string
  photoURL?: string
}

const ProfileView = () => {
  const navigate = useNavigate()
  const storage = getStorage()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    firtsName: "",
    lastName: ""
  })

  // ✅ Validation
  const isFormValid = () => {
    return (
      formData.firtsName.trim().length >= 2 &&
      formData.lastName.trim().length >= 2
    )
  }

  // ✅ Detect changes (including image)
  const isChanged =
    formData.firtsName !== userData?.firtsName ||
    formData.lastName !== userData?.lastName ||
    imageFile !== null

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
    if (!isFormValid()) {
      toast.error("Please enter valid name")
      return
    }

    try {
      const docRef = doc(db, "users", user.uid)

      let imageUrl = userData.photoURL || ""

      // ✅ Upload image
      if (imageFile) {
        const storageRef = ref(
          storage,
          `users/${user.uid}/${imageFile.name}`
        )

        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      // ✅ Update Firestore
      await updateDoc(docRef, {
        firtsName: formData.firtsName,
        lastName: formData.lastName,
        photoURL: imageUrl
      })

      // ✅ Update UI
      setUserData(prev => ({
        ...prev!,
        firtsName: formData.firtsName,
        lastName: formData.lastName,
        photoURL: imageUrl
      }))

      setIsEditing(false)
      setImageFile(null)

      toast.success("Profile updated successfully")
      console.log("imageFile:", imageFile)
      console.log("before upload:", userData?.photoURL)

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
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : userData.photoURL ? (
            <img
              src={userData.photoURL}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl">
              {userData.firtsName?.charAt(0)}
            </div>
          )}

          {/* Edit Mode */}
          {isEditing ? (
            <div className="flex flex-col gap-2 mt-4 w-full">

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImageFile(e.target.files[0])
                  }
                }}
              />

              <input
                type="text"
                name="firtsName"
                value={formData.firtsName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="First Name"
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Last Name"
              />
            </div>
          ) : (
            <h2 className="text-xl font-semibold mt-4">
              {userData.firtsName} {userData.lastName}
            </h2>
          )}

          <p className="text-sm text-gray-500 mt-1">User Profile</p>

          {/* Email */}
          <div className="w-full mt-6">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{userData.email}</p>
          </div>

          {/* Buttons */}
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
                className="flex-1 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-900"
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