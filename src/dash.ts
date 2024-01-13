import { data } from "./data";
import update from "log-update";

async function main() {
    while (true) {
        const result = await data();

        const progress = Math.round((result.counted / result.total) * 1000) / 10;
        const total_votes = result.leader.reduce((acc, cur) => acc + cur.votes, 0);

        let output = `開票進度: ${progress}%\n\n`;
        output += "總統得票數\n";
        output += "==========\n";
        for (const d of result.leader) {
            output += `${d.candidate}: ${d.votes} (${Math.round((d.votes / total_votes) * 1000) / 10}%)\n`;
        }
        output += "\n";
        output += "立委席次\n";
        output += "========\n";
        for (const [party, seats] of Object.entries(result.seats)) {
            output += `${party}: ${seats}\n`;
        }

        update(output);

        await new Promise((resolve) => setTimeout(resolve, 15_000));
    }
}

main();
