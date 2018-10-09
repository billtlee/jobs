import { FETCH_JOBS } from '../actions/types';

const INITAL_STATE = {
  jobs: []
};

export default function (state = INITAL_STATE, action) {
  switch (action.type) {
    case FETCH_JOBS:
      return action.payload;
    default:
      return state;
  }
}
