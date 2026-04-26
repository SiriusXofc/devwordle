"use client";

import { useEffect, useState } from "react";

export function useGuestId() {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    setGuestId(window.localStorage.getItem("devwordle_guest"));
  }, []);

  return guestId;
}
