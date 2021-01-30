import {createContext, useContext} from 'react';

export const FormContext = createContext();
export function useFormContext() {
  return useContext(FormContext);
}
