import { UserAccountType } from "../action_types/user_account_type";

let initState = {
    isUserConnected: false,
    userAccountAddress: ''
};
const userReducer = (state = initState, action) => {
    switch (action.type) {
        case UserAccountType.ADD_USER_ACCOUNT:
            state = { ...state, isUserConnected: true };
            state = { ...state, userAccountAddress: action.payload };
            return state;
        case UserAccountType.REMOVE_USER_ACCOUNT:
            state = { ...state, isUserConnected: false };
            state = { ...state, userAccountAddress: "" };
            return state;
        default:
            return state;
    }
}

export default userReducer;