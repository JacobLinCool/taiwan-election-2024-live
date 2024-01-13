import { get, parse } from "./get";

export async function president() {
    const link = "https://vote2024.cec.gov.tw/zh-TW/P1/00000000000000000.html";

    const html = await get(link);

    const parsed = await parse(html);
    const $ = parsed.$;
    const table = parsed.table;
    const rows = table.find("tbody > tr");

    const data = rows
        .map((_, row) => {
            const candidate = $(row).find("td:nth-child(2) > div:nth-child(1)").text().trim();
            const party = $(row).find("td:nth-child(6) > div:nth-child(1)").text().trim().replace(" 推薦", "");
            const votes = $(row).find("td.numeric").first().text().trim().replace(/,/g, "");
            return {
                candidate,
                party,
                votes: parseInt(votes),
            };
        })
        .get()
        .sort((a, b) => b.votes - a.votes);

    return {
        data,
        collected: parsed.collected_count,
        total: parsed.total_count,
    };
}
