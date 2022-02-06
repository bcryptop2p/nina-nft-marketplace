import { UserAccountType } from "../action_types/user_account_type"

export const AddUserAccount = (data) => {
    return {
        type: UserAccountType.ADD_USER_ACCOUNT,
        payload: data
    };
}

export const RemoveUserAccount = () => {
    return {
        type: UserAccountType.REMOVE_USER_ACCOUNT,
        payload: ""
    };
}