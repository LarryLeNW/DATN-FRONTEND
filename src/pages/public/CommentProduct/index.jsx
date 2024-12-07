
const CommentProduct = () => {

    return (
        <div>
            <section class="bg-gray-100 py-8">
                <div class="container mx-auto px-4">
                    <h2 class="text-2xl font-bold mb-4">
                        Đánh giá của khách hàng
                    </h2>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg shadow">
                            <div class="flex items-center mb-2">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="User Avatar"
                                    class="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <h3 class="font-semibold">Jane Smith</h3>
                                    <p class="text-sm text-gray-500">
                                        Posted on March 10, 2024
                                    </p>
                                </div>
                            </div>
                            <p class="text-gray-700">
                                The shipping was fast and the product arrived in
                                perfect condition. Highly recommended!
                            </p>
                            <div class="flex items-center mt-2">
                                <button class="text-blue-500 hover:text-blue-600 mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 inline"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    Like
                                </button>
                                <button class="text-gray-500 hover:text-gray-600">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>

                    <form class="mt-8 bg-white p-4 rounded-lg shadow">
                        <div class="mb-4">
                            <label
                                for="comment"
                                class="block text-gray-700 font-medium mb-2"
                            >
                                Comment
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Post Comment
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default CommentProduct;