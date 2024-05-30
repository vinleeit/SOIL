import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import SoilButton from "../../components/SoilButton";
import SoilConfirmationDialog from "../../components/SoilConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { ProfileResponse, profileService } from "../../shared/services/AuthService";
import SoilErrorAlert from "../../components/SoilErrorAlert";

/*
 * Profile page component
 * */
export default function Profile() {
  // Get delete user action from context
  const { deleteUser } = useContext(
    AuthContext,
  ) as AuthContextValue;
  // Dialog DOM ref
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();

  // TODO(profile): Add loading
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState('');

  const { token: currentToken } = useContext(
    AuthContext,
  ) as AuthContextValue;

  useEffect(() => {
    const fetchProfile = async () => {
      const [profile, error] = await profileService(currentToken as string);
      if (profile) {
        setProfile(profile);
      }
      setError(error ?? "");
    };

    fetchProfile();
  }, []);

  return (
    <div className="grow flex items-center justify-center">
      {error &&
        <SoilErrorAlert
          actionLabel="Go to Dashboard"
          action={() => navigate("/")} >
          {error}
        </SoilErrorAlert>}
      {!error && <>
        <SoilConfirmationDialog
          ref={dialogRef}
          title="Delete Account"
          description="Are you sure to delete your current account?"
          confirmButtonLabel="DELETE"
          cancelButtonLabel="Cancel"
          onCancel={() => dialogRef.current?.close()}
          onConfirm={() => deleteUser()}
        ></SoilConfirmationDialog>
        <section className="w-2/3 max-w-96 my-16 p-8 bg-stone-100 rounded border text-stone-900">
          <h1 className="text-4xl font-bold tracking-wider">Profile</h1>
          <dl className="mt-4 flex space-y-5 leading-4 flex-col">
            <div>
              <dt className="font-bold text-sm">Username</dt>
              <dd className="capitalize">{profile?.username}</dd>
            </div>
            <div>
              <dt className="font-bold text-sm">Email Address</dt>
              <dd className="lowercase">{profile?.email}</dd>
            </div>
            <div>
              <dt className="font-bold text-sm">Joining Date</dt>
              <dd className="lowercase">
                {new Date(profile?.createdAt ?? "").toLocaleDateString()}
              </dd>
            </div>
          </dl>
          <div className="flex justify-end md:flex-row flex-col mt-8 space-y-2 md:space-y-0 md:space-x-2 mb-3">
            <SoilButton
              outlined
              fullWidth
              onClick={() => navigate("/profile/edit")}
            >
              Edit Account
            </SoilButton>
            <SoilButton
              fullWidth
              outlined
              onClick={() => navigate("/profile/change-password")}
            >
              Change Password
            </SoilButton>
          </div>
          <SoilButton fullWidth onClick={() => dialogRef.current?.showModal()}>
            Delete Account
          </SoilButton>
        </section>
      </>}
    </div>
  );
}
