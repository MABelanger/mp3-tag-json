// import items from "./mocData/mp3-tag.json" with { type: "json" };

import { getfilteredItem } from "./filterLogicUtils.js";

async function main() {
  const mocData = await import("./mocData/mp3-tag.json", {
    with: { type: "json" },
  });

  const items = mocData.default;
  //console.log("items", items);

  // bpm, exp, fes, con, ryt, bas, cur, ins

  const bpmFiltered = getfilteredItem(items, "bpm", 76, 80);
  console.log("bpmFiltered", bpmFiltered);
  const expentionFiltered = getfilteredItem(items, "expention", 1, 9);
  console.log("expentionFiltered", expentionFiltered);
}

main();
