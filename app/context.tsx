import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Data = { message: string };

type DataContextValue = {
  data: Data | null;
  setData: React.Dispatch<React.SetStateAction<Data | null>>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataContextProvider(props: {
  children: React.ReactNode;
  data: Data | null;
}) {
  const { children } = props;

  const [data, setData] = useState<Data | null>(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const value = useMemo(() => ({ data, setData }), [data]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (context === null) {
    throw new Error(
      'The "useDataContext" hook must be used within the DataContextProvider context'
    );
  }
  return context;
}
