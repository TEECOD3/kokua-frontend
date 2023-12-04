"use client";

import { useNewId, useUser } from "@/hooks/useUserId";
import { Button } from "@chakra-ui/react";
import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";
import { client } from "../../../../../sanity/lib/client";
import { db } from "@/utils/db";
import { useState } from "react";

export const LikeButton = ({
  resourceId,
  upvotes,
}: {
  resourceId: string;
  upvotes: number;
}) => {
  const { newId } = useNewId();
  const { userId } = useUser({ resourceId });
  const hasLiked = Boolean(userId);

  const [upV, setUpV] = useState(upvotes);

  const increaseResourceCount = () => {
    if (!userId) {
      db.users.add({
        id: newId,
        resourceId,
      });
    }

    setUpV((prev) => prev + 1);

    client
      .patch(resourceId)
      .setIfMissing({ upvotes: 0 })
      .inc({ upvotes: 1 })
      .commit();
  };

  return (
    <>
      <Button
        colorScheme={hasLiked ? "brand" : "gray"}
        onClick={() => {
          increaseResourceCount();
        }}
        leftIcon={hasLiked ? <HiThumbUp /> : <HiOutlineThumbUp />}
        fontSize="sm"
        rounded="xl"
      >
        {upV || 0}
      </Button>
    </>
  );
};
