import { useContext, useRef } from "react";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import SoilButton from "../../components/SoilButton";
import SoilConfirmationDialog from "../../components/SoilConfirmationDialog";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user: currentUser, deleteUser } = useContext(
    AuthContext,
  ) as AuthContextValue;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();

  return (
    <div className="grow flex items-center justify-center">
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
            <dt className="font-bold text-sm">Name</dt>
            <dd className="capitalize">{currentUser!.name}</dd>
          </div>
          <div>
            <dt className="font-bold text-sm">Email Address</dt>
            <dd className="lowercase">{currentUser!.email}</dd>
          </div>
          <div>
            <dt className="font-bold text-sm">Joining Date</dt>
            <dd className="lowercase">
              {new Date(currentUser!.joinDate).toJSON().split("T")[0]}
            </dd>
          </div>
        </dl>
        <div className="flex justify-end md:flex-row flex-col mt-8 space-y-2 md:space-y-0 md:space-x-2">
          <SoilButton outlined onClick={() => navigate("/profile/edit")}>
            Edit Account
          </SoilButton>
          <SoilButton onClick={() => dialogRef.current?.showModal()}>
            Delete Account
          </SoilButton>
        </div>
      </section>
    </div>
  );
}
