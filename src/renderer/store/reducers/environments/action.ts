import axios from "axios";

import { AppDispatch } from "renderer/store/index";
import { environmentsSlice } from "renderer/store/reducers/environments/slice";

import { useTimer } from "renderer/utils/timer";

export const fetchEnvironments = (workspaceId: string) => async (dispatch: AppDispatch) => {

  dispatch(environmentsSlice.actions.setLoading(true));

  const timer = useTimer();

  const { data } = await axios.get(`/workspaces/${workspaceId}/environments`);

  timer.runWhenElapsed(() => {
    dispatch(environmentsSlice.actions.update(data));
    dispatch(environmentsSlice.actions.setCurrentEnvironmentId(data[0]?.id));
  });
};
