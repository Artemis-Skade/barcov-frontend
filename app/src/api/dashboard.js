import {post} from "./requests";
import Cookies from 'universal-cookie';

export const updateCompanyData = (company) => {
    const cookies = new Cookies();
    return post('/change_company_data',{
        company_data:company,
        session_key:cookies.get("sessionKeyCompany"),
    })
}
