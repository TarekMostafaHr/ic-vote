import * as React from "react";

const user = "1";

const IndexPage = () => {
  const [actor, setActor] = React.useState(null);
  const [votes, setVotes] = React.useState<
    { yes: number; no: number } | undefined
  >();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    import("../actor").then((module) => {
      setActor(module.default);
    });
  }, []);

  //
  React.useEffect(() => {
    const getDataAsync = async () => {
      setLoading(true);
      const data = await actor?.get(user);
      const canisterVotes = data?.[0] && JSON.parse(data?.[0]);
      console.log("getting votes from canister", canisterVotes);
      setVotes(canisterVotes);
      setLoading(false);
    };
    getDataAsync();
  }, [actor, votes?.no, votes?.yes]);

  const handleClick = async (type: "yes" | "no") => {
    setLoading(true);
    const d = await actor?.get(user);
    console.log("data before clicking vote", d[0], 2);
    const newVotes = { ...votes, [type]: votes[type] + 1 };
    console.log("new votes", newVotes);
    await actor?.set(user, JSON.stringify(newVotes));
    setVotes(newVotes);
    setLoading(false);
  };

  return (
    <main>
      <div>Are you ok?</div>
      <button onClick={() => handleClick("yes")}>Yes</button>
      <button onClick={() => handleClick("no")}>No</button>
      <div>Voted yes {loading ? "Loading..." : votes?.yes}</div>
      <div>Voted no {loading ? "Loading..." : votes?.no}</div>
    </main>
  );
};

export default IndexPage;
