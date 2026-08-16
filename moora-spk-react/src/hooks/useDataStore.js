import { useContext } from 'react';
import { DataStoreContext } from '../contexts/dataStoreContext';
export const useDataStore = () => useContext(DataStoreContext);
