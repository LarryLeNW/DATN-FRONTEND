import { Button, notification, Skeleton } from "antd";
import { deleteDelivery, getDeliveries } from "apis/delivery.api";
import paths from "constant/paths";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import Icons from "utils/icons";

function AddressAccount() {
    const [deliveries, setDeliveries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleFetchDeliveries = async () => {
        setIsLoading(true);
        try {
            const res = await getDeliveries({ limit: 20 });
            setDeliveries(res?.result?.content || []);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
            });
        }
        setIsLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDelivery(id);
            handleFetchDeliveries();
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
            });
        }
    };

    useEffect(() => {
        handleFetchDeliveries();
    }, []);

    return (
        <div className="flex flex-col ">
            <h1 className="text-2xl mb-4">Sổ địa chỉ</h1>
            <div
                className="flex items-center justify-center p-4 gap-2 border-2 border-dotted text-xl cursor-pointer text-green-600 bg-white rounded"
                onClick={() => navigate(paths.MEMBER.CREATE_ADDRESS_ACCOUNT)}
            >
                <Icons.FaPlus />
                <span>Thêm địa chỉ mới</span>
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <div
                              key={index}
                              className="p-4 bg-white flex justify-between items-center"
                          >
                              <Skeleton
                                  active
                                  title={false}
                                  paragraph={{ rows: 2 }}
                              />
                              <div className="flex gap-2">
                                  <Skeleton.Button active />
                                  <Skeleton.Button active />
                              </div>
                          </div>
                      ))
                    : deliveries
                          ?.sort(
                              (a, b) =>
                                  (b.isDefault === true) -
                                  (a.isDefault === true)
                          )
                          .map((el) => (
                              <div
                                  key={el.id}
                                  className="p-4 bg-white flex justify-between items-center"
                              >
                                  <div>
                                      <div className="text-lg font-bold flex gap-4 items-center">
                                          <span>{el?.username}</span>
                                          {el?.isDefault && (
                                              <span className="text-sm text-green-400 flex items-center gap-1">
                                                  <Icons.IoMdCheckmarkCircleOutline />
                                                  <span>Địa chỉ mặc định</span>
                                              </span>
                                          )}
                                      </div>
                                      <div className="flex gap-2">
                                          <span className="text-slate-600">
                                              Địa chỉ:
                                          </span>
                                          <span>
                                              {el?.street}
                                              {el?.ward && (
                                                  <span>, {el?.ward}</span>
                                              )}
                                              {el?.district && (
                                                  <span>, {el?.district}</span>
                                              )}
                                              {el?.city && (
                                                  <span>, {el?.city}</span>
                                              )}
                                          </span>
                                      </div>
                                      <div className="flex gap-2">
                                          <span className="text-slate-600">
                                              Số điện thoại:
                                          </span>
                                          <span>{el?.numberPhone}</span>
                                      </div>
                                  </div>
                                  <div className="flex gap-2">
                                      <Button
                                          className="bg-blue-600 text-white"
                                          onClick={() =>
                                              navigate(
                                                  generatePath(
                                                      paths.MEMBER
                                                          .UPDATE_ADDRESS_ACCOUNT,
                                                      {
                                                          id: el?.id,
                                                      }
                                                  )
                                              )
                                          }
                                      >
                                          Chỉnh sửa
                                      </Button>
                                      {!el?.isDefault && (
                                          <Button
                                              className="bg-red-600 text-white"
                                              onClick={() =>
                                                  handleDelete(el?.id)
                                              }
                                          >
                                              Xóa
                                          </Button>
                                      )}
                                  </div>
                              </div>
                          ))}
            </div>
        </div>
    );
}

export default AddressAccount;
