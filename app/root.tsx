import { createContext, memo, useMemo } from "react";
import { Scripts, useFetcher, useLoaderData, useMatches } from "react-router";
import type { Route } from "./+types/root";
import { DataContextProvider, useDataContext } from "./context";

const DB = {
  message: "Hello, world!",
};

export async function action() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  DB.message =
    DB.message === "Hello, world!" ? "This is a new message!" : "Hello, world!";
  return null;
}

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { message: DB.message };
}

export function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Root({ loaderData }: Route.ComponentProps) {
  console.log("Render <Root /> component");
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <UseFetcherMemo />
      <PropsMemo loaderData={loaderData} />
      <UseLoaderDataMemo />
      <UseMatchesMemo />
      <UseMatchesDataMemo />
      <DataContextProvider data={loaderData}>
        <ContextMemo />
      </DataContextProvider>
    </div>
  );
}

const UseFetcherMemo = memo(function UseFetcherMemo() {
  console.log("Render <UseFetcherMemo /> component");
  const fetcherA = useFetcher({ key: "a" });
  const fetcherB = useFetcher({ key: "b" });
  const fetcherC = useFetcher({ key: "c" });
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div>
        <div>
          <button
            onClick={() => {
              fetcherA.load("/");
            }}
          >
            Fetch "/"
          </button>
        </div>
        <div>{fetcherA.state}</div>
      </div>
      <div>
        <div>
          <button
            onClick={() => {
              fetcherB.load("/check");
            }}
          >
            Fetch "/check"
          </button>
        </div>
        <div>{fetcherB.state}</div>
      </div>
      <div>
        <div>
          <button
            onClick={() => {
              fetcherC.submit(null, { method: "POST", action: "/" });
            }}
          >
            Change message
          </button>
        </div>
        <div>{fetcherC.state}</div>
      </div>
    </div>
  );
});

const PropsMemo = memo(function PropsMemo(props: { loaderData: unknown }) {
  console.log("Render <PropsMemo /> component");
  return <div>PropsMemo = {JSON.stringify(props.loaderData)}</div>;
});

const UseLoaderDataMemo = memo(function UseLoaderDataMemo() {
  console.log("Render <UseLoaderDataMemo /> component");
  const data = useLoaderData();
  return <div>UseLoaderDataMemo = {JSON.stringify(data)}</div>;
});

const UseMatchesMemo = memo(function UseMatchesMemo() {
  console.log("Render <UseMatchesMemo /> component");
  const matches = useMatches();
  const data = matches.find((route) => route.id === "root")?.data;
  return <div>UseMatchesMemo = {JSON.stringify(data)}</div>;
});

export function useMatchesData(id: string) {
  let matchingRoutes = useMatches();
  let route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}
const UseMatchesDataMemo = memo(function UseMatchesDataMemo() {
  console.log("Render <UseMatchesDataMemo /> component");
  const data = useMatchesData("root");
  return <div>UseMatchesDataMemo = {JSON.stringify(data)}</div>;
});

const ContextMemo = memo(function ContextMemo() {
  console.log("Render <ContextMemo /> component");
  const { data } = useDataContext();
  return <div>ContextMemo = {JSON.stringify(data)}</div>;
});
