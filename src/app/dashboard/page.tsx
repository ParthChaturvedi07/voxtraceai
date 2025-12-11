"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.hello.queryOptions({ text: "Parth" }));

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error.message}</div>;
  }

  return <div className="text-white">{data?.greeting}</div>;
};

export default Page;