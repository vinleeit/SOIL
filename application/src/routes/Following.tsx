import React, { useContext, useEffect, useRef, useState } from 'react';
import { FollowingResponse, serviceGetFollowings, serviceUnfollow } from '../shared/services/FollowService';
import SoilAlertDialog from '../components/SoilAlertDialog';
import { AuthContext, AuthContextValue } from '../context/AuthContext';

const FollowingList: React.FC = () => {
    const failureDialog = useRef<HTMLDialogElement | null>(null);
    const [followings, setFollowings] = useState<FollowingResponse[]>([]);
    const [error, setError] = useState<string>('');
    const { token } = useContext(AuthContext) as AuthContextValue;

    useEffect(() => {
        const fetchFollowings = async () => {
            const [data, error] = await serviceGetFollowings(token ?? '');

            if (data) {
                setFollowings(data);
            }

            if (error) {
                setError(error);
                failureDialog.current?.showModal()
            }
        };

        fetchFollowings();
    }, [token]);

    const handleUnfollow = async (userId: number) => {
        const error = await serviceUnfollow(token ?? '', userId);

        if (error) {
            setError(error);
            failureDialog.current?.showModal()
        } else {
            setFollowings((prevFollowings) => {
                return [...prevFollowings.filter((user) => parseInt(user.id) !== userId)]
            });
        }

    };

    return (
        <div className="container mx-auto py-16">
            <SoilAlertDialog
                id={"failureDialog"}
                ref={failureDialog}
                title={`Error`}
                description={error}
                buttonLabel="Ok"
                onClick={() => failureDialog.current?.close()}
            />
            <h2 className="text-2xl font-bold mb-4">Following Users</h2>
            {followings.length == 0 && <p>No data</p>}
            <ul className="space-y-4">
                {followings.map((user) => (
                    <li key={user.id} className="flex justify-between bg-white shadow rounded-lg p-4">
                        <div>
                            <div className="font-bold text-lg">{user.username}</div>
                            <div className="text-gray-600">{user.email}</div>
                        </div>
                        <button
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleUnfollow(parseInt(user.id))}
                        >
                            Unfollow
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowingList;