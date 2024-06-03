import { useContext, useRef, useState, useEffect } from "react"
import SoilAlertDialog from "../../components/SoilAlertDialog"
import { AuthContext, AuthContextValue } from "../../context/AuthContext"
import { serviceAddThread, serviceDeleteReview, serviceUpdateReview } from "../../shared/services/ReviewService"
import { Review } from "../../types/ProductDetail"
import ThreadItem from "./ThreadItem"
import SoilButton from "../../components/SoilButton"
import SoilStarRating from "../../components/SoilStarRating"
import { ProfileResponse } from "../../shared/services/AuthService"
import { FollowingResponse, serviceFollow, serviceUnfollow } from "../../shared/services/FollowService"

interface ReviewItemProp {
    review: Review,
    profile: ProfileResponse | null,
    followings: FollowingResponse[],
}

export default function ReviewItem({
    review,
    profile,
    followings,
}: ReviewItemProp) {
    const { token } = useContext(AuthContext) as AuthContextValue

    const failureDialog = useRef<HTMLDialogElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [error, setError] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isReplyActive, setIsReplyActive] = useState(false)
    const [isEditActive, setIsEditActive] = useState(false)
    const [reply, setReply] = useState('')
    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')

    const dateCreated = new Date(review.createdAt)

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

    const onDeleteReview = async () => {
        const error = await serviceDeleteReview(token ?? '', review.reviewID)
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            window.location.reload()
        }
    }

    const handleEditContent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating == 0 || content.length == 0 || (rating == review.rating && content == review.review)) {
            return
        }

        const error = await serviceUpdateReview(
            token ?? '',
            review.reviewID,
            {
                rating: rating,
                review: content,
            },
        )
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
            return
        } else {
            window.location.reload()
        }
    }

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (reply.length == 0) {
            return
        }

        const error = await serviceAddThread(
            token ?? '',
            review.reviewID,
            { content: reply },
        )
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            window.location.reload()
        }
    }

    const handleFollow = async () => {
        const error = await serviceFollow(token!, review.UserId)
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            window.location.reload()
        }
    }
    const handleUnfollow = async () => {
        const error = await serviceUnfollow(token!, review.UserId)
        if (error) {
            setError(error)
            failureDialog.current?.showModal()
        } else {
            window.location.reload()
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
            <article className="p-6 text-base my-2 bg-white border rounded-lg">
                <footer className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <p className="inline-flex items-center text-sm text-gray-900  font-semibold">
                            {review.User.username}</p>
                        <p className="text-sm text-gray-600 ">
                            {dateCreated.toLocaleTimeString()}, {dateCreated.toLocaleDateString()}
                        </p>
                        {
                            profile?.username != review.User.username &&
                            ((followings.find((e) => {
                                return e.username == review.User.username
                            }) != null) ?
                                <button
                                    onClick={() => { handleUnfollow() }}
                                    className="rounded-md px-2 py-1 bg-rose-600 hover:bg-rose-400">
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
                        profile && profile.username == review.User.username &&
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
                            <div id="dropdownComment1"
                                ref={dropdownRef}
                                className={`${isDropdownOpen ? '' : 'hidden'} absolute right-0 top-10 z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow`}>
                                <ul className="py-1 text-sm text-gray-700"
                                    aria-labelledby="dropdownMenuIconHorizontalButton">
                                    <li>
                                        <a onClick={() => {
                                            if (!review.isBlocked) {
                                                setIsEditActive(!isEditActive)
                                                setRating(review.rating)
                                                setContent(review.review)
                                                setIsDropdownOpen(false)
                                            }
                                        }}
                                            className="block py-2 px-4 hover:bg-gray-100">Edit</a>
                                    </li>
                                    <li>
                                        <a onClick={() => {
                                            onDeleteReview()
                                            setIsDropdownOpen(false)
                                        }}
                                            className="block py-2 px-4 hover:bg-gray-100">Remove</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                </footer>
                {/* Rating edit */}
                {isEditActive ? (
                    <form onSubmit={handleEditContent} className="flex flex-col mt-4 items-end space-y-2">
                        <div className="flex flex-col w-full space-y-2">
                            <label htmlFor={"reply"} className="ml-2 text-gray-600 font-bold" >Edit Review</label>
                            <div className="flex flex-col space-y-2">
                                <SoilStarRating id={"star"} rating={rating} onRatingChange={(rating) => { setRating(rating) }}></SoilStarRating>
                            </div>
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
                        <div className="flex w-full justify-end space-x-1">
                            <SoilButton disabled={rating == 0 || content.length == 0 || (rating === review.rating && content === review.review)}>
                                Submit
                            </SoilButton>
                            <SoilButton outlined onClick={() => {
                                setContent('')
                                setRating(0)
                                setIsEditActive(false)
                            }}>
                                Cancel
                            </SoilButton>
                        </div>
                    </form>
                ) :
                    <div>
                        <div>
                            {
                                [...Array(review.rating)].map((_, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className='cursor-pointer text-2xl transition-colors duration-200 text-orange-400'
                                        >
                                            &#9733;
                                        </span>
                                    )
                                })
                            }
                        </div>
                        <p className="text-gray-500">
                            {review.review}
                        </p>
                    </div>
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
                            className="flex items-center text-sm text-gray-500 hover:underline">
                            <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                            </svg>
                            Reply
                        </button>
                    </div>
                )
                }
            </article>
            <div className="flex flex-col ml-4 border-l pl-4">
                {review.Threads.map((thread) => (
                    <ThreadItem key={thread.threadID} profile={profile} followings={followings} thread={thread} />
                ))}
            </div>
        </div>
    )
}