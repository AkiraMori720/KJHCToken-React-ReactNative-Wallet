import {createActionCreator, FINISH_API_CALL, START_API_CALL} from './actionsTypes';

export const startApiCall = createActionCreator(START_API_CALL);
export const finishApiCall = createActionCreator(FINISH_API_CALL);
