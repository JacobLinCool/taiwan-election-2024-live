import fs from "node:fs";
import { data } from "./data";

data().then((result) => {
    console.log(result);
    fs.writeFileSync("votes.json", JSON.stringify(result, null, 2));
});
