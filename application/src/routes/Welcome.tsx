import { useNavigate } from "react-router-dom";
import SoilButton from "../components/SoilButton";
import { useContext } from "react";
import { AuthContext, AuthContextValue } from "../context/AuthContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(
    AuthContext,
  ) as AuthContextValue;

  return (
    <section className="grow flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Welcome {currentUser?.name}
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
