import { get, parse } from "./get";

export async function party() {
    const link = "https://vote2024.cec.gov.tw/zh-TW/L4/00000000000000000.html";

    const html = await get(link);

    const parsed = await parse(html);
    const $ = parsed.$;
    const table = parsed.table;
    const rows = table.find("tbody > tr");

    const data = rows
        .map((_, row) => {
            const party = $(row).find("td:nth-child(2)").text().trim();
            const votes = $(row).find("td.numeric").first().text().trim().replace(/,/g, "");
            return {
                party,
                votes: parseInt(votes),
                seats: 0,
            };
        })
        .get()
        .sort((a, b) => b.votes - a.votes);

    const total_votes = data.reduce((acc, cur) => acc + cur.votes, 0);
    const filtered = data.filter((d) => d.votes / total_votes >= 0.05);

    const total_seats = 34;
    const lefts: { party: string; left: number }[] = [];
    for (const d of filtered) {
        const seats = Math.floor((d.votes / total_votes) * total_seats);
        d.seats = seats;
        const left = (d.votes / total_votes) * total_seats - seats;
        lefts.push({ party: d.party, left });
    }
    lefts.sort((a, b) => b.left - a.left);

    const left_seats = total_seats - filtered.reduce((acc, cur) => acc + cur.seats, 0);
    for (let i = 0; i < left_seats; i++) {
        filtered[i % filtered.length].seats++;
    }

    return {
        data: filtered,
        collected: parsed.collected_count,
        total: parsed.total_count,
    };
}
