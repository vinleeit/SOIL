import { useContext, useRef, useState, useEffect } from "react"
import SoilAlertDialog from "../../components/SoilAlertDialog"
import { AuthContext, AuthContextValue } from "../../context/AuthContext"
import { serviceAddThread, serviceDeleteThread, serviceUpdateThread } from "../../shared/services/ReviewService"
import { Thread } from "../../types/ProductDetail"
import SoilButton from "../../components/SoilButton"
import { ProfileResponse } from "../../shared/services/AuthService"
import { FollowingResponse, serviceFollow, serviceUnfollow } from "../../shared/services/FollowService"

interface ThreadItemProp {
    thread: Thread
    profile: ProfileResponse | null
    followings: FollowingResponse[]
    setFollowings: React.Dispatch<React.SetStateAction<FollowingResponse[]>>
    refresh: () => Promise<boolean>
}

export default function ThreadItem({
    thread,
    profile,
    followings,
    setFollowings,
    refresh,
}: ThreadItemProp) {
    const { token } = useContext(AuthContext) as AuthContextValue

    const failureDialog = useRef<HTMLDialogElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const successDialog = useRef<HTMLDialogElement | null>(null);

    const [error, setError] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isReplyActive, setIsReplyActive] = useState(false)
    const [isEditActive, setIsEditActive] = useState(false)
    const [reply, setReply] = useState('')
    const [content, setContent] = useState('')

    const dateCreated = new Date(thread.createdAt)

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                event.target !== document.getElementById('dropdownComment1Button')
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    const onDeleteThread = async () => {
        const error = await serviceDeleteThread(token ?? '', thread.threadID)
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            await refresh()
        }
    }

    const handleEditContent = async (e: React.FormEvent) => {
        e.preventDefault()

        const error = await serviceUpdateThread(
            token ?? '',
            thread.threadID,
            { content: content },
        )
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
            return
        } else {
            if (await refresh()) {
                setIsEditActive(false)
                setContent('')
                successDialog.current?.showModal()
            }
        }
    }

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault()

        const error = await serviceAddThread(
            token ?? '',
            thread.reviewID,
            { content: reply },
            thread.threadID,
        )
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
            return
        } else {
            if (await refresh()) {
                setIsReplyActive(false)
                setReply('')
            }
        }
    }

    const handleFollow = async () => {
        const error = await serviceFollow(token!, thread.userID)
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            setFollowings((prevFollowings) => {
                const tempFollowings = [...prevFollowings]
                tempFollowings.push({
                    id: thread.userID.toFixed(0),
                    username: thread.User.username,
                    email: '',
                })
                return tempFollowings
            })
        }
    }
    const handleUnfollow = async () => {
        const error = await serviceUnfollow(token!, thread.userID)
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            setFollowings((prevFollowings) => {
                return [...prevFollowings.filter((v) => thread.userID != parseInt(v.id))]
            })
        }
    }

    return (
        <div>
            <SoilAlertDialog
                id={"failureDialog"}
                ref={failureDialog}
                title={`Error`}
                description={error}
                buttonLabel="Ok"
                onClick={() => failureDialog.current?.close()}
            />
            <SoilAlertDialog
                id={"successDialog"}
                ref={successDialog}
                title={"Success"}
                description={''}
                buttonLabel="Close"
                onClick={() => successDialog.current?.close()}
            />
            <article className="p-6 text-base my-2 bg-white border rounded-lg">
                <footer className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900  font-semibold">
                            {thread.User.username}</p>
                        <p className="text-sm text-gray-600 ">
                            {dateCreated.toLocaleTimeString()}, {dateCreated.toLocaleDateString()}
                        </p>
                        {
                            token && profile?.username != thread.User.username &&
                            ((followings.find((e) => {
                                return e.username == thread.User.username
                            }) != null) ?
                                <button
                                    onClick={() => { handleUnfollow() }}
                                    className="rounded-md px-2 py-1 text-white bg-rose-600 hover:bg-rose-500">
                                    Unfollow
                                </button>
                                :
                                <button
                                    onClick={() => { handleFollow() }}
                                    className="rounded-md px-2 py-1 bg-emerald-400 hover:bg-emerald-300">
                                    Follow
                                </button>)
                        }
                    </div>
                    {
                        profile && profile.username == thread.User.username &&
                        <div className="relative">
                            <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500  bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                type="button">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                </svg>
                                <span className="sr-only">Comment settings</span>
                            </button>
                            {/* Dropdown menu */}
                            <div id="dropdownComment"
                                ref={dropdownRef}
                                className={`${isDropdownOpen ? '' : 'hidden'} absolute right-0 top-10 z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow`}>
                                <ul className="py-1 text-sm text-gray-700"
                                    aria-labelledby="dropdownMenuIconHorizontalButton">
                                    <li>
                                        <a onClick={() => {
                                            if (!thread.isBlocked) {
                                                setIsEditActive(!isEditActive)
                                                setContent(thread.content)
                                                setIsDropdownOpen(false)
                                            }
                                        }}
                                            className="block py-2 px-4 hover:bg-gray-100">Edit</a>
                                    </li>
                                    <li>
                                        <a onClick={() => {
                                            onDeleteThread()
                                            setIsDropdownOpen(false)
                                        }}
                                            className="block py-2 px-4 hover:bg-gray-100">Remove</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                </footer>
                {/* Thread edit */}
                {isEditActive ? (
                    <form onSubmit={handleEditContent} className="flex flex-col mt-4 items-end space-y-2">
                        <div className="flex flex-col w-full space-y-2">
                            <label htmlFor={"reply"} className="ml-2 text-gray-600 font-bold" >Edit Reply</label>
                            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                                <textarea
                                    id={"reply"}
                                    rows={3}
                                    value={content}
                                    className="resize-none px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                                    placeholder="Write a reply..."
                                    maxLength={180}
                                    onChange={(e) => setContent(e.target.value)} >
                                </textarea>
                                <span className={`text-sm ${content.length < 180 ? 'text-gray-500' : 'text-red-400'}`}>
                                    {content.length}/180
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <SoilButton disabled={content.length == 0 || content === thread.content}>
                                Submit
                            </SoilButton>
                            <SoilButton outlined onClick={() => {
                                setIsEditActive(false)
                                setContent('')
                            }}>
                                Cancel
                            </SoilButton>
                        </div>

                    </form>
                ) :
                    <p className="text-gray-500">
                        {thread.content}
                    </p>
                }

                {/* Thread reply */}
                {isReplyActive ? (
                    <form onSubmit={handleSubmitReply} className="flex flex-col mt-4 items-end space-y-2">
                        <div className="flex flex-col w-full space-y-2">
                            <label htmlFor={"reply"} className="ml-2 text-gray-600 font-bold" >Reply</label>
                            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                                <textarea
                                    id={"reply"}
                                    value={reply}
                                    rows={3}
                                    className="resize-none px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                                    placeholder="Write a reply..."
                                    maxLength={180}
                                    onChange={(e) => setReply(e.target.value)} >
                                </textarea>
                                <span className={`text-sm ${reply.length < 180 ? 'text-gray-500' : 'text-red-400'}`}>
                                    {reply.length}/180
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <SoilButton disabled={reply.length == 0}>
                                Submit
                            </SoilButton>
                            <SoilButton outlined onClick={() => {
                                setIsReplyActive(false)
                                setReply('')
                            }}>
                                Cancel
                            </SoilButton>
                        </div>

                    </form>
                ) : (
                    <div className="flex items-center mt-4 space-x-4">
                        <button type="button"
                            onClick={() => setIsReplyActive(true)}
                            className="flex items-center text-sm text-gray-500 underline hover:text-gray-400">
                            Reply
                        </button>
                    </div>
                )
                }
            </article>
            <div className="flex flex-col ml-4 border-l pl-4">
                {thread.ChildThreads.map((thread) => (
                    <ThreadItem
                        key={thread.threadID}
                        profile={profile}
                        followings={followings}
                        thread={thread}
                        setFollowings={setFollowings}
                        refresh={refresh} />
                ))}
            </div>
        </div>
    )
}
