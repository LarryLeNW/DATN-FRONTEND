import paths from "constant/paths";
import { useNavigate } from "react-router-dom";
import Icons from "utils/icons";

function AddressAccount() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col ">
            <h1 className="text-2xl mb-4">Sổ địa chỉ</h1>
            <div
                className="flex items-center justify-center p-4 gap-2 border-2 border-dotted text-2xl bg-white rounded"
                onClick={() => navigate(paths.MEMBER.CREATE_ADDRESS_ACCOUNT)}
            >
                <Icons.FaPlus />
                <span>Thêm địa chỉ mới</span>
            </div>
            <div className="bg-white">
                <div></div>
            </div>
        </div>
    );
}

export default AddressAccount;
