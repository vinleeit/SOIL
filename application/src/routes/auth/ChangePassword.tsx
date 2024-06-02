import { FormEvent, useContext, useRef, useState } from "react";
import SoilButton from "../../components/SoilButton";
import SoilTextField from "../../components/SoilTextField";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SoilAlertDialog from "../../components/SoilAlertDialog";

// TODO(change-password): add loading
export default function ChangePassword() {
  const { updatePassword } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();
  const dialog = useRef<HTMLDialogElement | null>(null);
  const failureDialog = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  async function editProfile(e: FormEvent) {
    e.preventDefault();
    let success = true;
    if (password.length === 0) {
      setpasswordError("Password must not be empty");
      success = false;
    }

    // Check if the password is correct by comparing the hash
    if (newPassword.length === 0) {
      setNewPasswordError("Password must not be empty");
      success = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password should be at least 8 characters");
      success = false;
    } else if (newPassword.search(/[A-Z]/) == -1) {
      setNewPasswordError("Password should contain uppercase characters");
      success = false;
    } else if (newPassword.search(/[a-z]/) == -1) {
      setNewPasswordError("Password should contain lowercase characters");
      success = false;
    } else if (newPassword.search(/\d/) == -1) {
      setNewPasswordError("Password should contain numbers");
      success = false;
    } else if (newPassword.search(/[^A-Za-z0-9\s]/) == -1) {
      setNewPasswordError("Password should contain special characters");
      success = false;
    } else if (newPassword != confirmNewPassword) {
      setNewPasswordError("Password confirmation is incorrect");
      success = false;
    } else {
      setNewPasswordError("");
    }
    if (success) {
      // Update user's password with a new hash
      const error = await updatePassword(password, newPassword);
      if (error) {
        setError(error);
        failureDialog.current?.showModal();
      } else {
        dialog?.current?.showModal();
      }
    }
  }

  return (
    <div className="grow h-full flex items-center justify-center">
      <SoilAlertDialog
        title="Edit Success"
        description="Password has been successfully changed"
        buttonLabel="OK"
        ref={dialog}
        onClick={() => navigate("/profile")}
      />
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialog}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialog.current?.close()}
      />
      <section className="w-2/3 max-w-96 my-16 p-8 bg-stone-100 rounded border text-stone-900">
        <h1 className="text-4xl font-bold mb-3">Change Password</h1>
        <form className="space-y-1" onSubmit={editProfile}>
          <div>
            <label className="text-sm font-bold">Old Password</label>
            <SoilTextField
              type="password"
              value={password}
              errMsg={passwordError}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold">New Password</label>
            <SoilTextField
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold">Confirm New Password</label>
            <SoilTextField
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              errMsg={newPasswordError}
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
