import { party } from "./party";
import { president } from "./president";
import { regions } from "./constants";
import { legislator } from "./legislator";
import { indigenous_legislator_1, indigenous_legislator_2 } from "./indigenous_legislator";
import fs from "node:fs";
import { sort_object } from "./utls";

export async function main() {
    const leader = await president();
    const shares = await party();

    const legislators = await Promise.all(regions.map((r) => legislator(r)));
    const counting = legislators.filter((l) => l.collected > 0);

    const indigenous_1 = await indigenous_legislator_1();
    const indigenous_2 = await indigenous_legislator_2();

    const seats: Record<string, number> = {
        無: 0,
    };

    for (const s of shares.data) {
        seats[s.party] = s.seats;
    }

    for (const l of counting) {
        const d = l.data[0];
        const party = d.party || "無";

        if (seats[party] === undefined) {
            seats[party] = 0;
        }
        seats[party]++;
    }

    for (const d of indigenous_1.data) {
        const party = d.party || "無";

        if (seats[party] === undefined) {
            seats[party] = 0;
        }
        seats[party]++;
    }

    for (const d of indigenous_2.data) {
        const party = d.party || "無";

        if (seats[party] === undefined) {
            seats[party] = 0;
        }
        seats[party]++;
    }

    const counted = leader.collected;
    const total = leader.total;

    return {
        leader: leader.data,
        seats: sort_object(seats),
        counted,
        total,
    };
}

main().then((result) => {
    console.log(result);
    fs.writeFileSync("votes.json", JSON.stringify(result, null, 2));
});
