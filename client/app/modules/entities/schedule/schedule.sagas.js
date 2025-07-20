import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import ScheduleActions from './schedule.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getSchedule(api, action) {
  const { scheduleId } = action;
  // make the call to the api
  const apiCall = call(api.getSchedule, scheduleId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(ScheduleActions.scheduleSuccess(response.data));
  } else {
    yield put(ScheduleActions.scheduleFailure(response.data));
  }
}

function* getAllSchedules(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllSchedules, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(ScheduleActions.scheduleAllSuccess(response.data, response.headers));
  } else {
    yield put(ScheduleActions.scheduleAllFailure(response.data));
  }
}

function* updateSchedule(api, action) {
  const { schedule } = action;
  // make the call to the api
  const idIsNotNull = !(schedule.id === null || schedule.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateSchedule : api.createSchedule, schedule);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(ScheduleActions.scheduleUpdateSuccess(response.data));
  } else {
    yield put(ScheduleActions.scheduleUpdateFailure(response.data));
  }
}

function* deleteSchedule(api, action) {
  const { scheduleId } = action;
  // make the call to the api
  const apiCall = call(api.deleteSchedule, scheduleId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(ScheduleActions.scheduleDeleteSuccess());
  } else {
    yield put(ScheduleActions.scheduleDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.date = convertDateTimeFromServer(data.date);
  data.startTime = convertDateTimeFromServer(data.startTime);
  data.endTime = convertDateTimeFromServer(data.endTime);
  return data;
}

export default {
  getAllSchedules,
  getSchedule,
  deleteSchedule,
  updateSchedule,
};
