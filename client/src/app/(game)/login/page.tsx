"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setPlayer } from "../../../stores/playerSlice";

export default function Login() {
  const [player, _setPlayer] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = pathname.split("?")[1] || "";

  const enabled = player !== "";

  const dispatch = useDispatch();

  const login = () => {
    dispatch(setPlayer(player));

    const params = new URLSearchParams(searchParams);

    if (params.get("game")) {
      router.push(`/game/${params.get("game")}`);
    } else if (params.get("pending")) {
      router.push(`/pending/${params.get("pending")}`);
    } else {
      router.push("/");
    }
  };

  const loginKeyListener = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && enabled) {
      e.preventDefault();
      login();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col ">
        <p className="mt-2">Login</p>
        <div className="mt-2">
          Username:
          <Input
            className="h-8 flex w-36 mt-2"
            value={player}
            onChange={(e) => _setPlayer(e.target.value)}
            onKeyDown={loginKeyListener}
          />
          <Button
            className="mt-2 w-16 h-10 mb-2 ml-10"
            disabled={!enabled}
            onClick={login}
          >
            Login
          </Button>
        </div>
      </div>
    </>
  );
}
