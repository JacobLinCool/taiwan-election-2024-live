import { get, parse } from "./get";

export async function indigenous_legislator_1() {
    const link = "https://vote2024.cec.gov.tw/zh-TW/L2/00000000000000000.html";

    const html = await get(link);

    const parsed = await parse(html);
    const $ = parsed.$;
    const table = parsed.table;
    const rows = table.find("tbody > tr");

    const data = rows
        .map((_, row) => {
            const candidate = $(row).find("td:nth-child(2)").text().trim();
            const party = $(row).find("td:nth-child(6)").text().trim();
            const votes = $(row).find("td.numeric").first().text().trim().replace(/,/g, "");
            return {
                candidate,
                party,
                votes: parseInt(votes),
            };
        })
        .get()
        .sort((a, b) => b.votes - a.votes);

    const filtered = data.slice(0, 3);

    return {
        data: filtered,
        collected: parsed.collected_count,
        total: parsed.total_count,
    };
}

export async function indigenous_legislator_2() {
    const link = "https://vote2024.cec.gov.tw/zh-TW/L3/00000000000000000.html";

    const html = await get(link);

    const parsed = await parse(html);
    const $ = parsed.$;
    const table = parsed.table;
    const rows = table.find("tbody > tr");

    const data = rows
        .map((_, row) => {
            const candidate = $(row).find("td:nth-child(2)").text().trim();
            const party = $(row).find("td:nth-child(6)").text().trim();
            const votes = $(row).find("td.numeric").first().text().trim().replace(/,/g, "");
            return {
                candidate,
                party,
                votes: parseInt(votes),
            };
        })
        .get()
        .sort((a, b) => b.votes - a.votes);

    const filtered = data.slice(0, 3);

    return {
        data: filtered,
        collected: parsed.collected_count,
        total: parsed.total_count,
    };
}
