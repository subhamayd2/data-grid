import { createContext, useContext } from 'react';

const context = createContext();

export const useDataGridContext = () => useContext(context);
export const DataGridProvider = context.Provider;
