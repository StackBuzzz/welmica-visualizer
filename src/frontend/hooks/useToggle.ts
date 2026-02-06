import { useState, useCallback } from 'react';

type UseToggleReturn = [boolean, () => void, () => void, () => void];

function useToggle(initialVal = false): UseToggleReturn {
  const [state, setState] = useState(initialVal);

  const toggle = useCallback(() => {
    setState((curState) => !curState);
  }, []);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, setTrue, setFalse, toggle];
}

export default useToggle;
