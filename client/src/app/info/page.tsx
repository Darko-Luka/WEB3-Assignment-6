/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export default async function Info() {
  const games = await (await fetch("http://localhost:8080/games")).json();

  if (games.length === 0) {
    return <div className="text-center text-gray-500">No games available</div>;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Games List</h1>
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="text-left px-6 py-3">Game ID</th>
            <th className="text-left px-6 py-3">Players</th>
            <th className="text-left px-6 py-3">Rolls</th>
            <th className="text-left px-6 py-3">Rolls Left</th>
            <th className="text-left px-6 py-3">Pending</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {games.map((game: any) => (
            <tr key={game.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{game.id}</td>
              <td className="px-6 py-4 text-gray-700">
                {game.players.join(", ")}
              </td>
              <td className="px-6 py-4 text-gray-700">
                {game.roll.join(", ")}
              </td>
              <td className="px-6 py-4 text-gray-700">{game.rolls_left}</td>
              <td className="px-6 py-4 text-gray-700">
                {game.pending ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
