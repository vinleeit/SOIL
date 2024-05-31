import { useNavigate } from "react-router-dom";
import SoilButton from "../components/SoilButton";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, AuthContextValue } from "../context/AuthContext";
import { ProfileResponse, profileService } from "../shared/services/AuthService";
import SoilAlertDialog from "../components/SoilAlertDialog";

export default function Welcome() {
  const navigate = useNavigate();

  // TODO(profile): Add loading
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const failureDialog = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState('');

  const { token: currentToken } = useContext(
    AuthContext,
  ) as AuthContextValue;

  useEffect(() => {
    const fetchProfile = async () => {
      const [profileData, error] = await profileService(currentToken as string);
      if (profileData) {
        setProfile(profileData);
      }

      if (error) {
        setError(error);
        failureDialog.current?.showModal();
      }
    };

    fetchProfile();
  }, []);

  return (
    <section className="grow flex flex-col items-center justify-center">
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialog}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialog.current?.close()}
      />
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Welcome {profile?.username}
      </h1>
      <p className="max-w-80 md:max-w-96 text-center">
        Dive into Melbourne's freshest organic produce and inspiring seminars—head to your Profile or Home to start your healthy journey!
      </p>
      <div className="w-80 space-y-2 mt-8">
        <SoilButton fullWidth onClick={() => navigate('/')}>
          Get Started!
        </SoilButton>
        <SoilButton outlined fullWidth onClick={() => navigate('/profile')}>
          View Profile
        </SoilButton>
      </div>
    </section>
  );
}
