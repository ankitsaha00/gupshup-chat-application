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
  const { isConnected, socket } = useSocket();
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
    refetchInterval: isConnected ? false : 1000,
  });

  useEffect(() => {
    if (!socket) {
      console.log("Socket object is null or undefined");
      return;
    }

    if (!isConnected) {
      console.log("Socket is not connected");
      return;
    }

    console.log("Socket is connected, setting up listeners for channel:", paramValue);

    // Listen for new messages
    const newMessageEvent = `chat:${paramValue}:message`;
    console.log("Listening for new message event:", newMessageEvent);

    const handleNewMessage = (message: any) => {
      console.log("New message received event triggered:", message);
      queryClient.setQueryData([queryKey], (oldData: any) => {
        console.log("Updating cache with new message:", message);
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return {
            pages: [{ items: [message], nextCursor: null }],
            pageParams: [undefined],
          };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items],
        };

        return {
          ...oldData,
          pages: newPages,
        };
      });
    };

    socket.on(newMessageEvent, handleNewMessage);

    // Listen for message updates (edit/delete)
    const updateMessageEvent = `chat:${paramValue}:messages:update`;
    console.log("Listening for update message event:", updateMessageEvent);

    const handleUpdateMessage = (updatedMessage: any) => {
      console.log("Updated message received:", updatedMessage);
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return oldData;
        }

        const newPages = oldData.pages.map((page: any) => {
          const isDeleted = updatedMessage.content === "This message is deleted" && updatedMessage.deleted;
          const updatedItems = page.items
            .filter((item: any) => !isDeleted || item.id !== updatedMessage.id)
            .map((item: any) => (item.id === updatedMessage.id ? updatedMessage : item));
          return {
            ...page,
            items: updatedItems,
          };
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });
    };

    socket.on(updateMessageEvent, handleUpdateMessage);

    return () => {
      socket.off(newMessageEvent, handleNewMessage);
      socket.off(updateMessageEvent, handleUpdateMessage);
    };
  }, [socket, isConnected, queryClient, queryKey, paramValue]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};