import React, { useState, useRef, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SoilAlertDialog from '../../components/SoilAlertDialog';
import { AuthContext, AuthContextValue } from '../../context/AuthContext';
import SoilButton from '../../components/SoilButton';
import { serviceUpdateThread } from '../../shared/services/ReviewService';

export default function UpdateThread() {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId, threadId } = useParams();
    const { token } = useContext(AuthContext) as AuthContextValue;
    const failureDialog = useRef<HTMLDialogElement | null>(null);
    const [initialContent, setInitialContent] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [content, setContent] = useState<string>('');
    const [contentError, setContentError] = useState<string>('');

    useEffect(() => {
        const initialContent = location.state.threadContent;
        if (initialContent) {
            setInitialContent(initialContent);
            setContent(initialContent);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let success = true
        if (content.length == 0) {
            setContentError("Content is required");
            success = false;
        } else {
            setContentError("");
        }

        if (content == initialContent) {
            setError("No data is modified");
            failureDialog.current?.showModal();
            success = false;
        }

        if (success && token && productId && threadId) {
            const error = await serviceUpdateThread(
                token,
                parseInt(threadId!, 0),
                {
                    content: content
                },
            );
            if (error) {
                setError(error);
                failureDialog.current?.showModal();
                return
            }
            navigate(`/product/${productId}`)
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <SoilAlertDialog
                id={"failureDialog"}
                ref={failureDialog}
                title={`Error`}
                description={error}
                buttonLabel="Ok"
                onClick={() => failureDialog.current?.close()}
            />
            <h2 className="text-2xl font-bold mb-4">Update Thread</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="content" className="block font-medium mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your thread..."
                    ></textarea>
                    {contentError && <p className="ml-1 mt-0.5 text-red-400 text-sm">{contentError}</p>}
                </div>
                <SoilButton>
                    Submit Thread
                </SoilButton>
            </form>
        </div>
    );
}
