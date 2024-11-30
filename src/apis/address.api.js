import axios from "axios";

export const getProvinces = () =>
    axios({
        url: "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1",
        method: "get",
    });

export const getDistricts = (provincesID) =>
    axios({
        url: `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provincesID}&limit=-1`,
        method: "get",
    });

export const getWards = (districtsID) =>
    axios({
        url: `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtsID}&limit=-1`,
        method: "get",
    });
