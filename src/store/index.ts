import { combineReducers } from 'redux';

import userReducer from './user/user.slice';
import vaccineReducer from './vaccine.slice';

const rootReducer = combineReducers({
    user: userReducer,
    vaccine: vaccineReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;