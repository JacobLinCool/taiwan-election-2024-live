import { load } from "cheerio";

export async function get(link: string) {
    const url = new URL(link);
    url.searchParams.set("_", Date.now().toString());
    const res = await fetch(url.toString());
    return await res.text();
}

export async function parse(html: string) {
    const $ = load(html);

    const collected_regex = /已送投票所數\/總投票所數: (\d+)\/(\d+)/;
    const collected = collected_regex.exec(html);
    if (collected === null) {
        throw new Error("Regex failed");
    }

    const [_, collected_count, total_count] = collected;

    const table = $("table");
    return {
        collected_count: parseInt(collected_count),
        total_count: parseInt(total_count),
        table: table,
        $,
    };
}
