"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import * as api from "../model/api";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
const Lobby = () => {
  const selectPlayer = (state: RootState) => state.player.player;

  const player = useSelector(selectPlayer);

  const router = useRouter();
  const [numberOfPlayers, setNumberOfpLayers] = useState(2);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let int = 2;
    try {
      int = +event.target.value;
    } catch {
      /* empty */
    }

    setNumberOfpLayers(int);
  };

  const new_game = async (player: string) => {
    const pending_game = await api.new_game(numberOfPlayers, player);
    setTimeout(() => router.push(`/pending/${pending_game.id}`), 100);
  };

  useEffect(() => {
    if (player === undefined) router.push("/login");
  });

  return (
    <div className="max-w-screen-md space-y-6">
      <h1 className="text-3xl">Yahtzee!</h1>
      <main className="space-x-4 flex items-center">
        {player && (
          <>
            <span className="min-w-fit">Number of players: </span>
            <Input
              min="1"
              type="number"
              value={numberOfPlayers}
              onChange={handleChange}
            />
            <Button onClick={() => new_game(player)}>New Game</Button>
          </>
        )}
      </main>
    </div>
  );
};

export default Lobby;
