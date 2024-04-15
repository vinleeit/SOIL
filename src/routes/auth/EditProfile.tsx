import { FormEvent, useContext, useRef, useState } from "react";
import SoilButton from "../../components/SoilButton";
import SoilTextField from "../../components/SoilTextField";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SoilAlertDialog from "../../components/SoilAlertDialog";

export default function EditProfile() {
  const { user, updateUser } = useContext(AuthContext) as AuthContextValue;
  const [email, setEmail] = useState(user!.email);
  const [name, setName] = useState(user!.name);
  const navigate = useNavigate();
  const dialog = useRef<HTMLDialogElement | null>(null);

  function editProfile(e: FormEvent) {
    e.preventDefault();
    if (user?.email == email && user.name == name) {
      return;
    }
    updateUser(user!.email, email, name);
    dialog?.current?.showModal();
  }

  return (
    <div className="grow h-full flex items-center justify-center">
      <SoilAlertDialog
        title="Edit Success"
        description="Profile has been successfully edited"
        buttonLabel="OK"
        ref={dialog}
        onClick={() => navigate("/profile")}
      />
      <section className="w-2/3 max-w-96 my-16 p-8 bg-stone-100 rounded border text-stone-900">
        <h1 className="text-4xl font-bold mb-3">Edit Profile</h1>
        <form className="space-y-1" onSubmit={editProfile}>
          <div>
            <label className="text-sm font-bold">Email</label>
            <SoilTextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold">Name</label>
            <SoilTextField
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="pt-6 flex justify-end flex-col space-y-2">
            <SoilButton fullWidth>Edit</SoilButton>
            <SoilButton fullWidth onClick={() => navigate("/profile")} outlined>
              Go Back
            </SoilButton>
          </div>
        </form>
      </section>
    </div>
  );
}
