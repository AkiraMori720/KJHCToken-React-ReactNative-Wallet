import {API} from '../actions/actionsTypes';

const initialState = {
    apiCalls: {},
};

export default function btc(state = initialState, action) {
    switch (action.type) {
        case API.START_API_CALL:
            return {
                ...state,
                [action.payload.apiCallId]: state.apiCalls[action.payload.apiCallId] ? state.apiCalls[action.payload.apiCallId] + 1 : 1,
            };
        case API.FINISH_API_CALL:
            return {
                ...state,
                [action.payload.apiCallId]: Math.max(state.apiCalls[action.payload.apiCallId] - 1, 0),
            };
    }
}
