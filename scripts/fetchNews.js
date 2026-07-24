const fs = require("fs");

async function fetchNews() {
    const response = await fetch("https://alsuwaidi.ae/wp-json/wp/v2/posts?_embed&per_page=100");

    const posts = await response.json();

    const news = posts.map(post => {

        let image = "";

        if (
            post._embedded &&
            post._embedded["wp:featuredmedia"] &&
            post._embedded["wp:featuredmedia"][0]
        ) {
            image = post._embedded["wp:featuredmedia"][0].source_url;
        }

        return {
            id: post.id,
            title: post.title.rendered,
            summary: post.excerpt.rendered.replace(/<[^>]+>/g, "").trim(),
            url: post.link,
            image: image,
            date: post.date
        };
    });

    fs.mkdirSync("data", { recursive: true });

    fs.writeFileSync(
        "data/news.json",
        JSON.stringify(news, null, 2)
    );

    console.log("News synced successfully.");
}

fetchNews();
