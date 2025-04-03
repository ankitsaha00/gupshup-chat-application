import qs from "query-string";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { useEffect } from "react";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected, socket } = useSocket(); // Destructure socket from useSocket
  const queryClient = useQueryClient();

  const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000, // Keep this optimization
  });

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: any) => {
      // Assuming the message object contains the new message data
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData) return { pages: [{ items: [message], nextCursor: null }] };

        const newPages = oldData.pages.map((page: any, index: number) => {
          if (index === 0) {
            return {
              ...page,
              items: [message, ...page.items], // Add new message to the top
            };
          }
          return page;
        });

        return { ...oldData, pages: newPages };
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, isConnected, queryClient, queryKey]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};