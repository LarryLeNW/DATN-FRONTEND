import { faker } from "@faker-js/faker";
import { Button, notification, Skeleton } from "antd";
import { getReviews } from "apis/review.api";
import moment from "moment";
import Pagination from "pages/admin/components/Pagination";
import { useEffect, useState } from "react";
import ReactStars from "react-stars";

const CommentProduct = ({ productData }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const [commentData, setCommentData] = useState({ reviews: [] });
    const [selectedStar, setSelectedStar] = useState(null);

    const fetchReview = async () => {
        if (!productData) return;
        try {
            setIsLoading(true);
            const params = {
                page,
                limit,
            };

            if (selectedStar) params.stars = selectedStar;

            const res = await getReviews(params);
            setCommentData(res.result);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReview();
    }, [page, productData]);

    useEffect(() => {
        setPage(1);
        fetchReview();
    }, [selectedStar, limit]);

    return (
        <div>
            <section className="bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">
                        Đánh giá sản phẩm
                    </h2>
                    <div className="flex gap-4 rounded border px-24 py-8 my-2 justify-between bg-white">
                        <div className="flex flex-col gap-2">
                            <div className="text-primary">
                                <span className="text-4xl">
                                    {productData?.stars}
                                </span>{" "}
                                <span className="text-lg">trên 5</span>
                            </div>
                            <ReactStars
                                value={productData?.stars}
                                size={30}
                                edit={false}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className={`  p-4 text-2xl ${
                                    !selectedStar && "bg-primary text-white "
                                }`}
                                size={50}
                                disabled={isLoading}
                                onClick={() => setSelectedStar(null)}
                            >
                                Tất cả
                            </Button>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <Button
                                    key={star}
                                    className={` p-4 text-2xl ${
                                        selectedStar === star &&
                                        "bg-primary text-white"
                                    }`}
                                    size={50}
                                    disabled={isLoading}
                                    onClick={() => setSelectedStar(star)}
                                >
                                    {star} sao
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                  <Skeleton
                                      key={index}
                                      active
                                      avatar
                                      paragraph={{ rows: 2 }}
                                  />
                              ))
                            : commentData?.content?.map((review, index) => (
                                  <div
                                      key={index}
                                      className="bg-white p-4 rounded-lg shadow"
                                  >
                                      <div className="flex items-center mb-2">
                                          <img
                                              src={
                                                  review.postBy.avatar ||
                                                  faker.image.avatar()
                                              }
                                              alt="User Avatar"
                                              className="w-10 h-10 rounded-full mr-3"
                                          />
                                          <div>
                                              <h3 className="font-semibold">
                                                  {review.postBy.username}
                                              </h3>
                                              <ReactStars
                                                  value={review.rating}
                                                  size={22}
                                                  edit={false}
                                              />
                                              <p className="text-sm text-gray-500">
                                                  Đánh giá vào{" "}
                                                  {moment(
                                                      new Date(
                                                          review?.createdAt
                                                      )
                                                  ).format(
                                                      "HH:MM:SS DD/MM/YYYY"
                                                  )}
                                              </p>
                                          </div>
                                      </div>
                                      <p className="text-gray-700">
                                          {review.review_text}
                                      </p>
                                      <div className="flex gap-2">
                                          {review?.images
                                              ?.split(",")
                                              ?.map((el) => (
                                                  <div>
                                                      <img
                                                          src={el}
                                                          alt=""
                                                          className="w-24 h-24"
                                                      />
                                                  </div>
                                              ))}
                                      </div>
                                  </div>
                              ))}
                    </div>
                    {commentData.content && (
                        <div class="flex w-full justify-end p-2 ">
                            <Pagination
                                listLimit={[10, 25, 40, 100]}
                                limitCurrent={limit}
                                setLimit={setLimit}
                                totalPages={commentData?.totalPages}
                                setPage={setPage}
                                pageCurrent={page}
                                totalElements={commentData?.totalElements}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CommentProduct;
