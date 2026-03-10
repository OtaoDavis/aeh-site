// CONFIGURATION - Get these from Contentful > Settings > API keys
const SPACE_ID = "6nt3q4srjq4o";
const ACCESS_TOKEN = "-2Z4BIpbIAPCWgWpWnGRg5UiZiXODdmL8ZorQYc5Yj8";

const CONTENTFUL_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=newsArticle&order=-fields.publishDate`;

let allNews = []; // Global variable to store fetched news

/**
 * Format Date to "March 3, 2026"
 */
function formatDate(dateString) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Helper: Creates a clean text snippet from a long string
 */
function createSnippet(text, wordLimit = 35) {
  if (!text) return "";

  // 1. Remove Markdown symbols (#, *, _, etc.) so they don't show in the preview
  const cleanText = text
    .replace(/[#*`_~]/g, "") // Remove basic markdown
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links [text](url)
    .replace(/\n/g, " "); // Replace line breaks with spaces

  // 2. Split into words and grab the limit
  const words = cleanText.trim().split(/\s+/);
  if (words.length <= wordLimit) return cleanText;

  return words.slice(0, wordLimit).join(" ") + "...";
}

/**
 * Extract unique categories and fill the <select>
 */
function renderCategoryFilter(news) {
  const filterSelect = document.getElementById("topicFilter");
  if (!filterSelect) return;

  const categories = [...new Set(news.map((item) => item.category))].filter(
    Boolean,
  );

  let options = '<option value="all">All Insights</option>';
  categories.forEach((cat) => {
    options += `<option value="${cat}">${cat}</option>`;
  });
  filterSelect.innerHTML = options;
}

/**
 * Fetch All Articles for news.html
 */
async function getNewsList() {
  try {
    const response = await fetch(CONTENTFUL_URL);
    const data = await response.json();

    // Contentful separates Assets (images) from Entries. We must link them.
    const assets = data.includes.Asset;

    return data.items.map((item) => {
      const assetId = item.fields.thumbnail.sys.id;
      const imgFile = assets.find((a) => a.sys.id === assetId);
      const finalSummary = createSnippet(item.fields.body);
      return {
        id: item.fields.slug,
        title: item.fields.title,
        date: formatDate(item.fields.publishDate),
        category: item.fields.category,
        summary: finalSummary,
        image: imgFile ? "https:" + imgFile.fields.file.url : "",
      };
    });

    renderCategoryFilter(allNews);
    return allNews;
  } catch (error) {
    console.error("Contentful Error:", error);
    return [];
  }
}

/**
 * Fetch Single Article for article.html
 */
async function getArticleBySlug(slug) {
  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=newsArticle&fields.slug=${slug}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items.length) return null;

    const item = data.items[0];
    const assets = data.includes.Asset;
    const assetId = item.fields.thumbnail.sys.id;
    const imgFile = assets.find((a) => a.sys.id === assetId);

    return {
      title: item.fields.title,
      date: formatDate(item.fields.publishDate),
      category: item.fields.category,
      content: item.fields.body, // Markdown text
      image: imgFile ? "https:" + imgFile.fields.file.url : "",
      videoId: item.fields.youtubeVideoId || null, // Optional YouTube video ID
    };
  } catch (error) {
    return null;
  }
}

if (article.videoId) {
  const videoHTML = `
        <div class="video-responsive">
            <iframe src="https://www.youtube.com/embed/${article.videoId}" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
  // Insert the video at the top of the content or wherever you prefer
  document.getElementById("artContent").innerHTML =
    videoHTML + marked.parse(article.content);
}
