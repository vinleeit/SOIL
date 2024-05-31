import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import SoilButton from "../../components/SoilButton";
import SoilTextField from "../../components/SoilTextField";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SoilAlertDialog from "../../components/SoilAlertDialog";
import { profileService } from "../../shared/services/AuthService";

export default function EditProfile() {
  const { token, updateUser } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();
  const successDialogRef = useRef<HTMLDialogElement | null>(null);
  const failureDialogRef = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  async function editProfile(e: FormEvent) {
    e.preventDefault();
    // Form validation
    let success = true;
    if (email.length === 0) {
      setEmailError("Email must not be empty");
      success = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      success = false;
    } else {
      setEmailError("");
    }

    if (username.length < 2) {
      setUsernameError("Name must be at least 2 characters");
      success = false;
    } else {
      setUsernameError("");
    }


    if (success) {
      const error = await updateUser(email, username);
      if (error) {
        setError(error);
        failureDialogRef.current?.showModal();
        return;
      }
      successDialogRef.current?.showModal();
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const [profile, error] = await profileService(token as string);
      if (profile) {
        setUsername(profile.username);
        setEmail(profile.email);
      }

      if (error) {
        setError(error ?? "");
        failureDialogRef.current?.showModal();
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="grow h-full flex items-center justify-center">
      <SoilAlertDialog
        id="successDialog"
        title="Edit Success"
        description="Profile has been successfully edited"
        buttonLabel="OK"
        ref={successDialogRef}
        onClick={() => navigate("/profile")}
      />
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialogRef}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialogRef.current?.close()}
      />
      <section className="w-2/3 max-w-96 my-16 p-8 bg-stone-100 rounded border text-stone-900">
        <h1 className="text-4xl font-bold mb-3">Edit Profile</h1>
        <form className="space-y-1" onSubmit={editProfile}>
          <div>
            <label className="text-sm font-bold">Email</label>
            <SoilTextField
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              errMsg={emailError}
            />
          </div>
          <div>
            <label className="text-sm font-bold">Username</label>
            <SoilTextField
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              errMsg={usernameError}
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
